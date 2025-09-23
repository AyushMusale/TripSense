const express = require('express');
const { query, validationResult } = require('express-validator');
const Analytics = require('../models/Analytics');
const Trip = require('../models/Trip');

const router = express.Router();

// @route   GET /api/analytics/dashboard
// @desc    Get user's analytics dashboard data
// @access  Private
router.get('/dashboard', [
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

    const period = req.query.period || 'monthly';
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date();
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();

    // Get analytics for the specified period
    const analytics = await Analytics.findOne({
      user: req.user._id,
      period: period,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });

    // Get recent trips for additional context
    const recentTrips = await Trip.find({
      user: req.user._id,
      isCompleted: true
    })
      .sort({ startTime: -1 })
      .limit(10)
      .select('modeOfTransport purpose distance duration carbonFootprint startTime');

    // Get mode distribution
    const modeDistribution = await Trip.aggregate([
      {
        $match: {
          user: req.user._id,
          isCompleted: true,
          startTime: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$modeOfTransport',
          count: { $sum: 1 },
          totalDistance: { $sum: '$distance' },
          totalDuration: { $sum: '$duration' },
          totalCarbonFootprint: { $sum: '$carbonFootprint' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get purpose distribution
    const purposeDistribution = await Trip.aggregate([
      {
        $match: {
          user: req.user._id,
          isCompleted: true,
          startTime: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$purpose',
          count: { $sum: 1 },
          totalDistance: { $sum: '$distance' },
          totalDuration: { $sum: '$duration' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get daily activity for the last 30 days
    const dailyActivity = await Trip.aggregate([
      {
        $match: {
          user: req.user._id,
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
          duration: { $sum: '$duration' },
          carbonFootprint: { $sum: '$carbonFootprint' }
        }
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 }
      },
      {
        $limit: 30
      }
    ]);

    res.json({
      success: true,
      data: {
        analytics: analytics || {
          metrics: {
            totalTrips: 0,
            totalDistance: 0,
            totalDuration: 0,
            totalCarbonFootprint: 0
          },
          insights: {
            averageTripDistance: 0,
            averageTripDuration: 0,
            consistencyScore: 0
          },
          recommendations: []
        },
        recentTrips,
        modeDistribution,
        purposeDistribution,
        dailyActivity
      }
    });
  } catch (error) {
    console.error('Get analytics dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics dashboard'
    });
  }
});

// @route   GET /api/analytics/insights
// @desc    Get personalized insights and recommendations
// @access  Private
router.get('/insights', async (req, res) => {
  try {
    // Get user's recent analytics
    const analytics = await Analytics.findOne({
      user: req.user._id
    }).sort({ date: -1 });

    if (!analytics) {
      return res.json({
        success: true,
        data: {
          insights: [],
          recommendations: [],
          trends: {}
        }
      });
    }

    // Generate insights based on user data
    const insights = [];
    const recommendations = analytics.recommendations || [];

    // Carbon footprint insights
    if (analytics.metrics.totalCarbonFootprint > 20) {
      insights.push({
        type: 'carbon',
        title: 'High Carbon Footprint',
        message: `Your carbon footprint is ${analytics.metrics.totalCarbonFootprint.toFixed(1)} kg CO2. Consider using more sustainable transport modes.`,
        severity: 'high',
        action: 'Try walking or cycling for short trips'
      });
    }

    // Distance insights
    if (analytics.metrics.totalDistance > 100000) { // More than 100km
      insights.push({
        type: 'distance',
        title: 'High Travel Distance',
        message: `You've traveled ${(analytics.metrics.totalDistance / 1000).toFixed(1)} km. Consider optimizing your routes.`,
        severity: 'medium',
        action: 'Plan more efficient routes or combine trips'
      });
    }

    // Consistency insights
    if (analytics.insights.consistencyScore < 0.3) {
      insights.push({
        type: 'consistency',
        title: 'Low Activity Consistency',
        message: 'Your travel patterns are irregular. Try to maintain a consistent routine.',
        severity: 'low',
        action: 'Set a daily travel goal'
      });
    }

    // Mode shift insights
    const carTrips = analytics.metrics.modeBreakdown.car.trips;
    const activeTrips = analytics.metrics.modeBreakdown.walking.trips + analytics.metrics.modeBreakdown.cycling.trips;
    
    if (carTrips > activeTrips * 2) {
      insights.push({
        type: 'mode_shift',
        title: 'Car Dependency',
        message: 'You use your car significantly more than active transport. Consider alternatives.',
        severity: 'medium',
        action: 'Try walking or cycling for trips under 2km'
      });
    }

    res.json({
      success: true,
      data: {
        insights,
        recommendations,
        trends: analytics.trends || {},
        goals: analytics.goals || {}
      }
    });
  } catch (error) {
    console.error('Get insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching insights'
    });
  }
});

// @route   GET /api/analytics/export
// @desc    Export user's trip data
// @access  Private
router.get('/export', [
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

    const format = req.query.format || 'json';
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(Date.now() - 365 * 24 * 60 * 60 * 1000); // Last year
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();

    // Get trips for export
    const trips = await Trip.find({
      user: req.user._id,
      isCompleted: true,
      startTime: { $gte: startDate, $lte: endDate }
    }).sort({ startTime: -1 });

    if (format === 'csv') {
      // Generate CSV
      const createCsvWriter = require('csv-writer').createObjectCsvWriter;
      const csvWriter = createCsvWriter({
        path: `temp_export_${req.user._id}_${Date.now()}.csv`,
        header: [
          { id: 'tripId', title: 'Trip ID' },
          { id: 'startTime', title: 'Start Time' },
          { id: 'endTime', title: 'End Time' },
          { id: 'duration', title: 'Duration (minutes)' },
          { id: 'distance', title: 'Distance (meters)' },
          { id: 'modeOfTransport', title: 'Mode of Transport' },
          { id: 'purpose', title: 'Purpose' },
          { id: 'carbonFootprint', title: 'Carbon Footprint (kg CO2)' },
          { id: 'startLatitude', title: 'Start Latitude' },
          { id: 'startLongitude', title: 'Start Longitude' },
          { id: 'endLatitude', title: 'End Latitude' },
          { id: 'endLongitude', title: 'End Longitude' }
        ]
      });

      const csvData = trips.map(trip => ({
        tripId: trip.tripId,
        startTime: trip.startTime.toISOString(),
        endTime: trip.endTime.toISOString(),
        duration: trip.duration,
        distance: trip.distance,
        modeOfTransport: trip.modeOfTransport,
        purpose: trip.purpose,
        carbonFootprint: trip.carbonFootprint || 0,
        startLatitude: trip.startLocation.latitude,
        startLongitude: trip.startLocation.longitude,
        endLatitude: trip.endLocation.latitude,
        endLongitude: trip.endLocation.longitude
      }));

      await csvWriter.writeRecords(csvData);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="trips_export_${Date.now()}.csv"`);
      res.send(csvData.map(row => Object.values(row).join(',')).join('\n'));
    } else {
      // Return JSON
      res.json({
        success: true,
        data: {
          trips: trips.map(trip => ({
            tripId: trip.tripId,
            startTime: trip.startTime,
            endTime: trip.endTime,
            duration: trip.duration,
            distance: trip.distance,
            modeOfTransport: trip.modeOfTransport,
            purpose: trip.purpose,
            carbonFootprint: trip.carbonFootprint,
            startLocation: trip.startLocation,
            endLocation: trip.endLocation,
            companions: trip.companions,
            notes: trip.notes
          })),
          exportInfo: {
            totalTrips: trips.length,
            startDate: startDate,
            endDate: endDate,
            exportedAt: new Date(),
            format: 'json'
          }
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

// @route   POST /api/analytics/generate
// @desc    Generate analytics for a specific period
// @access  Private
router.post('/generate', [
  body('period')
    .isIn(['daily', 'weekly', 'monthly', 'yearly'])
    .withMessage('Invalid period'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date')
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

    const { period, date } = req.body;
    const targetDate = date ? new Date(date) : new Date();

    // Generate analytics
    const analytics = await Analytics.generateUserAnalytics(req.user._id, period, targetDate);

    if (!analytics) {
      return res.status(404).json({
        success: false,
        message: 'No trip data found for the specified period'
      });
    }

    // Save analytics
    await analytics.save();

    res.json({
      success: true,
      message: 'Analytics generated successfully',
      data: { analytics }
    });
  } catch (error) {
    console.error('Generate analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating analytics'
    });
  }
});

// @route   GET /api/analytics/heatmap
// @desc    Get location heatmap data for trips
// @access  Private
router.get('/heatmap', [
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

    // Get trip locations
    const trips = await Trip.find({
      user: req.user._id,
      isCompleted: true,
      startTime: { $gte: startDate, $lte: endDate }
    }).select('startLocation endLocation modeOfTransport');

    // Process locations for heatmap
    const heatmapData = [];
    
    trips.forEach(trip => {
      // Add start location
      heatmapData.push({
        lat: trip.startLocation.latitude,
        lng: trip.startLocation.longitude,
        weight: 1,
        mode: trip.modeOfTransport,
        type: 'start'
      });
      
      // Add end location
      heatmapData.push({
        lat: trip.endLocation.latitude,
        lng: trip.endLocation.longitude,
        weight: 1,
        mode: trip.modeOfTransport,
        type: 'end'
      });
    });

    res.json({
      success: true,
      data: {
        heatmapData,
        totalPoints: heatmapData.length,
        period: { startDate, endDate }
      }
    });
  } catch (error) {
    console.error('Get heatmap data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching heatmap data'
    });
  }
});

module.exports = router;
