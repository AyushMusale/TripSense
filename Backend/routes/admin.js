const express = require('express');
const { body, query, validationResult } = require('express-validator');
const User = require('../models/User');
const Trip = require('../models/Trip');
const Analytics = require('../models/Analytics');
const { restrictTo } = require('../middleware/auth');

const router = express.Router();

// Apply admin/analyst restriction to all routes
router.use(restrictTo('admin', 'analyst'));

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard overview
// @access  Private (Admin/Analyst only)
router.get('/dashboard', async (req, res) => {
  try {
    // Get total users
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });

    // Get total trips
    const totalTrips = await Trip.countDocuments({ isCompleted: true });
    const tripsThisMonth = await Trip.countDocuments({
      isCompleted: true,
      startTime: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });

    // Get total distance and carbon footprint
    const distanceStats = await Trip.aggregate([
      { $match: { isCompleted: true } },
      {
        $group: {
          _id: null,
          totalDistance: { $sum: '$distance' },
          totalCarbonFootprint: { $sum: '$carbonFootprint' },
          averageDistance: { $avg: '$distance' }
        }
      }
    ]);

    // Get mode distribution
    const modeDistribution = await Trip.aggregate([
      { $match: { isCompleted: true } },
      {
        $group: {
          _id: '$modeOfTransport',
          count: { $sum: 1 },
          totalDistance: { $sum: '$distance' },
          totalCarbonFootprint: { $sum: '$carbonFootprint' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get purpose distribution
    const purposeDistribution = await Trip.aggregate([
      { $match: { isCompleted: true } },
      {
        $group: {
          _id: '$purpose',
          count: { $sum: 1 },
          totalDistance: { $sum: '$distance' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get daily activity for the last 30 days
    const dailyActivity = await Trip.aggregate([
      {
        $match: {
          isCompleted: true,
          startTime: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$startTime' },
            month: { $month: '$startTime' },
            day: { $dayOfMonth: '$startTime' }
          },
          trips: { $sum: 1 },
          distance: { $sum: '$distance' },
          carbonFootprint: { $sum: '$carbonFootprint' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } },
      { $limit: 30 }
    ]);

    // Get recent issues
    const recentIssues = await Trip.aggregate([
      { $match: { 'issues.0': { $exists: true } } },
      { $unwind: '$issues' },
      { $sort: { 'issues.timestamp': -1 } },
      { $limit: 10 },
      {
        $project: {
          tripId: 1,
          'issues.type': 1,
          'issues.description': 1,
          'issues.severity': 1,
          'issues.status': 1,
          'issues.timestamp': 1,
          user: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          activeUsers,
          totalTrips,
          tripsThisMonth,
          totalDistance: distanceStats[0]?.totalDistance || 0,
          totalCarbonFootprint: distanceStats[0]?.totalCarbonFootprint || 0,
          averageDistance: distanceStats[0]?.averageDistance || 0
        },
        modeDistribution,
        purposeDistribution,
        dailyActivity,
        recentIssues
      }
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching admin dashboard'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with pagination and filtering
// @access  Private (Admin/Analyst only)
router.get('/users', [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('role')
    .optional()
    .isIn(['user', 'admin', 'analyst'])
    .withMessage('Invalid role filter'),
  query('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

    // Get users
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
});

// @route   GET /api/admin/trips
// @desc    Get all trips with filtering and pagination
// @access  Private (Admin/Analyst only)
router.get('/trips', [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('modeOfTransport')
    .optional()
    .isIn(['walking', 'cycling', 'car', 'motorcycle', 'bus', 'train', 'metro', 'taxi', 'rideshare', 'plane', 'boat', 'other'])
    .withMessage('Invalid mode of transport filter'),
  query('purpose')
    .optional()
    .isIn(['work', 'education', 'shopping', 'recreation', 'healthcare', 'social', 'personal', 'tourism', 'other'])
    .withMessage('Invalid purpose filter'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { isCompleted: true };
    if (req.query.modeOfTransport) filter.modeOfTransport = req.query.modeOfTransport;
    if (req.query.purpose) filter.purpose = req.query.purpose;
    if (req.query.startDate || req.query.endDate) {
      filter.startTime = {};
      if (req.query.startDate) filter.startTime.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.startTime.$lte = new Date(req.query.endDate);
    }

    // Get trips
    const trips = await Trip.find(filter)
      .populate('user', 'firstName lastName email')
      .sort({ startTime: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Trip.countDocuments(filter);

    res.json({
      success: true,
      data: {
        trips,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalTrips: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching trips'
    });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get system-wide analytics
// @access  Private (Admin/Analyst only)
router.get('/analytics', [
  query('period')
    .optional()
    .isIn(['daily', 'weekly', 'monthly', 'yearly'])
    .withMessage('Invalid period'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();

    // Get comprehensive analytics
    const analytics = await Trip.aggregate([
      {
        $match: {
          isCompleted: true,
          startTime: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalTrips: { $sum: 1 },
          totalDistance: { $sum: '$distance' },
          totalDuration: { $sum: '$duration' },
          totalCarbonFootprint: { $sum: '$carbonFootprint' },
          averageDistance: { $avg: '$distance' },
          averageDuration: { $avg: '$duration' },
          averageCarbonFootprint: { $avg: '$carbonFootprint' }
        }
      }
    ]);

    // Get mode distribution
    const modeDistribution = await Trip.aggregate([
      {
        $match: {
          isCompleted: true,
          startTime: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$modeOfTransport',
          count: { $sum: 1 },
          totalDistance: { $sum: '$distance' },
          totalCarbonFootprint: { $sum: '$carbonFootprint' },
          averageDistance: { $avg: '$distance' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get geographic distribution
    const geographicDistribution = await Trip.aggregate([
      {
        $match: {
          isCompleted: true,
          startTime: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            lat: { $round: ['$startLocation.latitude', 1] },
            lng: { $round: ['$startLocation.longitude', 1] }
          },
          count: { $sum: 1 },
          modes: { $addToSet: '$modeOfTransport' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 100 }
    ]);

    res.json({
      success: true,
      data: {
        overview: analytics[0] || {
          totalTrips: 0,
          totalDistance: 0,
          totalDuration: 0,
          totalCarbonFootprint: 0,
          averageDistance: 0,
          averageDuration: 0,
          averageCarbonFootprint: 0
        },
        modeDistribution,
        geographicDistribution,
        period: { startDate, endDate }
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics'
    });
  }
});

// @route   GET /api/admin/export
// @desc    Export system data
// @access  Private (Admin/Analyst only)
router.get('/export', [
  query('type')
    .isIn(['trips', 'users', 'analytics'])
    .withMessage('Export type must be trips, users, or analytics'),
  query('format')
    .optional()
    .isIn(['json', 'csv'])
    .withMessage('Format must be json or csv'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { type, format = 'json', startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    let data = [];
    let filename = '';

    switch (type) {
      case 'trips':
        data = await Trip.find({
          isCompleted: true,
          startTime: { $gte: start, $lte: end }
        })
          .populate('user', 'firstName lastName email')
          .sort({ startTime: -1 });
        filename = `trips_export_${Date.now()}`;
        break;

      case 'users':
        data = await User.find({
          createdAt: { $gte: start, $lte: end }
        })
          .select('-password')
          .sort({ createdAt: -1 });
        filename = `users_export_${Date.now()}`;
        break;

      case 'analytics':
        data = await Analytics.find({
          date: { $gte: start, $lte: end }
        })
          .populate('user', 'firstName lastName email')
          .sort({ date: -1 });
        filename = `analytics_export_${Date.now()}`;
        break;
    }

    if (format === 'csv') {
      // Generate CSV
      const createCsvWriter = require('csv-writer').createObjectCsvWriter;
      const csvWriter = createCsvWriter({
        path: `temp_${filename}.csv`,
        header: Object.keys(data[0]?.toObject() || {}).map(key => ({
          id: key,
          title: key.charAt(0).toUpperCase() + key.slice(1)
        }))
      });

      const csvData = data.map(item => item.toObject());
      await csvWriter.writeRecords(csvData);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      res.send(csvData.map(row => Object.values(row).join(',')).join('\n'));
    } else {
      res.json({
        success: true,
        data: {
          type,
          format,
          count: data.length,
          period: { startDate: start, endDate: end },
          exportedAt: new Date(),
          data
        }
      });
    }
  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while exporting data'
    });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Update user's active status
// @access  Private (Admin only)
router.put('/users/:id/status', [
  body('isActive')
    .isBoolean()
    .withMessage('isActive must be boolean')
], async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can modify user status'
      });
    }

    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user }
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user status'
    });
  }
});

// @route   GET /api/admin/issues
// @desc    Get all reported issues
// @access  Private (Admin/Analyst only)
router.get('/issues', [
  query('status')
    .optional()
    .isIn(['reported', 'acknowledged', 'in_progress', 'resolved', 'closed'])
    .withMessage('Invalid status filter'),
  query('severity')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid severity filter')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build match stage for aggregation
    const matchStage = { 'issues.0': { $exists: true } };
    if (req.query.status) {
      matchStage['issues.status'] = req.query.status;
    }
    if (req.query.severity) {
      matchStage['issues.severity'] = req.query.severity;
    }

    const issues = await Trip.aggregate([
      { $match: matchStage },
      { $unwind: '$issues' },
      {
        $match: req.query.status ? { 'issues.status': req.query.status } : {},
        ...(req.query.severity && { 'issues.severity': req.query.severity })
      },
      { $sort: { 'issues.timestamp': -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          tripId: 1,
          'issues.type': 1,
          'issues.description': 1,
          'issues.severity': 1,
          'issues.status': 1,
          'issues.timestamp': 1,
          'issues.location': 1,
          'issues.photos': 1,
          user: 1
        }
      }
    ]);

    const total = await Trip.aggregate([
      { $match: matchStage },
      { $unwind: '$issues' },
      {
        $match: req.query.status ? { 'issues.status': req.query.status } : {},
        ...(req.query.severity && { 'issues.severity': req.query.severity })
      },
      { $count: 'total' }
    ]);

    res.json({
      success: true,
      data: {
        issues,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil((total[0]?.total || 0) / limit),
          totalIssues: total[0]?.total || 0,
          hasNextPage: page < Math.ceil((total[0]?.total || 0) / limit),
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get issues error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching issues'
    });
  }
});

module.exports = router;
