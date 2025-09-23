const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Trip = require('../models/Trip');
const Analytics = require('../models/Analytics');
const { checkOwnership } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/trips
// @desc    Create a new trip
// @access  Private
router.post('/', [
  body('startLocation.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Start latitude must be between -90 and 90'),
  body('startLocation.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Start longitude must be between -180 and 180'),
  body('endLocation.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('End latitude must be between -90 and 90'),
  body('endLocation.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('End longitude must be between -180 and 180'),
  body('startTime')
    .isISO8601()
    .withMessage('Start time must be a valid ISO 8601 date'),
  body('endTime')
    .isISO8601()
    .withMessage('End time must be a valid ISO 8601 date'),
  body('modeOfTransport')
    .isIn(['walking', 'cycling', 'car', 'motorcycle', 'bus', 'train', 'metro', 'taxi', 'rideshare', 'plane', 'boat', 'other'])
    .withMessage('Invalid mode of transport'),
  body('purpose')
    .isIn(['work', 'education', 'shopping', 'recreation', 'healthcare', 'social', 'personal', 'tourism', 'other'])
    .withMessage('Invalid trip purpose')
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

    const tripData = {
      ...req.body,
      user: req.user._id
    };

    // Calculate distance if not provided
    if (!tripData.distance && tripData.startLocation && tripData.endLocation) {
      const geolib = require('geolib');
      tripData.distance = geolib.getDistance(
        { latitude: tripData.startLocation.latitude, longitude: tripData.startLocation.longitude },
        { latitude: tripData.endLocation.latitude, longitude: tripData.endLocation.longitude }
      );
    }

    // Calculate carbon footprint
    const trip = new Trip(tripData);
    trip.calculateCarbonFootprint();

    await trip.save();

    // Generate analytics for the user
    try {
      await Analytics.generateUserAnalytics(req.user._id, 'daily', new Date());
    } catch (analyticsError) {
      console.error('Analytics generation error:', analyticsError);
    }

    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      data: { trip }
    });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during trip creation'
    });
  }
});

// @route   GET /api/trips
// @desc    Get user's trips with filtering and pagination
// @access  Private
router.get('/', [
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

    // Build filter object
    const filter = { user: req.user._id };

    if (req.query.modeOfTransport) {
      filter.modeOfTransport = req.query.modeOfTransport;
    }

    if (req.query.purpose) {
      filter.purpose = req.query.purpose;
    }

    if (req.query.startDate || req.query.endDate) {
      filter.startTime = {};
      if (req.query.startDate) {
        filter.startTime.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filter.startTime.$lte = new Date(req.query.endDate);
      }
    }

    // Get trips with pagination
    const trips = await Trip.find(filter)
      .sort({ startTime: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'firstName lastName email');

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

// @route   GET /api/trips/:id
// @desc    Get a specific trip
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('user', 'firstName lastName email');

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    res.json({
      success: true,
      data: { trip }
    });
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching trip'
    });
  }
});

// @route   PUT /api/trips/:id
// @desc    Update a trip
// @access  Private
router.put('/:id', [
  body('modeOfTransport')
    .optional()
    .isIn(['walking', 'cycling', 'car', 'motorcycle', 'bus', 'train', 'metro', 'taxi', 'rideshare', 'plane', 'boat', 'other'])
    .withMessage('Invalid mode of transport'),
  body('purpose')
    .optional()
    .isIn(['work', 'education', 'shopping', 'recreation', 'healthcare', 'social', 'personal', 'tourism', 'other'])
    .withMessage('Invalid trip purpose')
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

    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Update trip
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        trip[key] = req.body[key];
      }
    });

    // Recalculate carbon footprint if mode of transport changed
    if (req.body.modeOfTransport) {
      trip.calculateCarbonFootprint();
    }

    await trip.save();

    res.json({
      success: true,
      message: 'Trip updated successfully',
      data: { trip }
    });
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating trip'
    });
  }
});

// @route   DELETE /api/trips/:id
// @desc    Delete a trip
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    res.json({
      success: true,
      message: 'Trip deleted successfully'
    });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting trip'
    });
  }
});

// @route   POST /api/trips/:id/start
// @desc    Start a trip (for real-time tracking)
// @access  Private
router.post('/:id/start', async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    if (trip.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Trip is already active'
      });
    }

    trip.isActive = true;
    trip.startTime = new Date();
    await trip.save();

    res.json({
      success: true,
      message: 'Trip started successfully',
      data: { trip }
    });
  } catch (error) {
    console.error('Start trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while starting trip'
    });
  }
});

// @route   POST /api/trips/:id/end
// @desc    End a trip (for real-time tracking)
// @access  Private
router.post('/:id/end', [
  body('endLocation.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('End latitude must be between -90 and 90'),
  body('endLocation.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('End longitude must be between -180 and 180')
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

    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    if (!trip.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Trip is not active'
      });
    }

    // Update trip with end data
    trip.endLocation = req.body.endLocation;
    trip.endTime = new Date();
    trip.isActive = false;
    trip.isCompleted = true;

    // Calculate distance if not provided
    if (!trip.distance && trip.startLocation && trip.endLocation) {
      const geolib = require('geolib');
      trip.distance = geolib.getDistance(
        { latitude: trip.startLocation.latitude, longitude: trip.startLocation.longitude },
        { latitude: trip.endLocation.latitude, longitude: trip.endLocation.longitude }
      );
    }

    // Recalculate carbon footprint
    trip.calculateCarbonFootprint();

    await trip.save();

    // Generate analytics
    try {
      await Analytics.generateUserAnalytics(req.user._id, 'daily', new Date());
    } catch (analyticsError) {
      console.error('Analytics generation error:', analyticsError);
    }

    res.json({
      success: true,
      message: 'Trip ended successfully',
      data: { trip }
    });
  } catch (error) {
    console.error('End trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while ending trip'
    });
  }
});

// @route   POST /api/trips/:id/track
// @desc    Add GPS tracking point to active trip
// @access  Private
router.post('/:id/track', [
  body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  body('timestamp')
    .optional()
    .isISO8601()
    .withMessage('Timestamp must be a valid ISO 8601 date')
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

    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Active trip not found'
      });
    }

    // Add tracking point
    const trackingPoint = {
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      accuracy: req.body.accuracy,
      altitude: req.body.altitude,
      speed: req.body.speed,
      heading: req.body.heading,
      timestamp: req.body.timestamp ? new Date(req.body.timestamp) : new Date()
    };

    trip.route.push(trackingPoint);
    await trip.save();

    res.json({
      success: true,
      message: 'Tracking point added successfully',
      data: { trackingPoint }
    });
  } catch (error) {
    console.error('Add tracking point error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding tracking point'
    });
  }
});

// @route   POST /api/trips/:id/issues
// @desc    Report an issue during the trip
// @access  Private
router.post('/:id/issues', [
  body('type')
    .isIn(['delay', 'cancellation', 'crowding', 'safety', 'accessibility', 'other'])
    .withMessage('Invalid issue type'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('severity')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid severity level')
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

    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    const issue = {
      type: req.body.type,
      description: req.body.description,
      location: req.body.location,
      timestamp: new Date(),
      photos: req.body.photos || [],
      severity: req.body.severity || 'medium',
      status: 'reported'
    };

    trip.issues.push(issue);
    await trip.save();

    res.status(201).json({
      success: true,
      message: 'Issue reported successfully',
      data: { issue }
    });
  } catch (error) {
    console.error('Report issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while reporting issue'
    });
  }
});

// @route   GET /api/trips/stats/summary
// @desc    Get user's trip statistics summary
// @access  Private
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Trip.getUserStats(req.user._id);
    
    if (stats.length === 0) {
      return res.json({
        success: true,
        data: {
          totalTrips: 0,
          totalDistance: 0,
          totalDuration: 0,
          totalCarbonFootprint: 0,
          averageDistance: 0,
          averageDuration: 0,
          modeBreakdown: []
        }
      });
    }

    res.json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    console.error('Get trip stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching trip statistics'
    });
  }
});

module.exports = router;
