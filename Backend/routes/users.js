const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Trip = require('../models/Trip');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user's profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user's profile
// @access  Private
router.put('/profile', [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please enter a valid phone number'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Date of birth must be a valid ISO 8601 date'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other', 'prefer_not_to_say'])
    .withMessage('Invalid gender selection')
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

    const allowedUpdates = ['firstName', 'lastName', 'phone', 'dateOfBirth', 'gender', 'preferences'];
    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key) && req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
});

// @route   PUT /api/users/password
// @desc    Change user's password
// @access  Private
router.put('/password', [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
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

    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    // Check current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while changing password'
    });
  }
});

// @route   PUT /api/users/preferences
// @desc    Update user's preferences
// @access  Private
router.put('/preferences', [
  body('units')
    .optional()
    .isIn(['metric', 'imperial'])
    .withMessage('Units must be metric or imperial'),
  body('language')
    .optional()
    .isLength({ min: 2, max: 5 })
    .withMessage('Language code must be 2-5 characters'),
  body('notifications.email')
    .optional()
    .isBoolean()
    .withMessage('Email notification preference must be boolean'),
  body('notifications.push')
    .optional()
    .isBoolean()
    .withMessage('Push notification preference must be boolean'),
  body('privacy.shareData')
    .optional()
    .isBoolean()
    .withMessage('Data sharing preference must be boolean'),
  body('privacy.anonymizeData')
    .optional()
    .isBoolean()
    .withMessage('Data anonymization preference must be boolean')
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

    const user = await User.findById(req.user._id);

    // Update preferences
    if (req.body.units) {
      user.preferences.units = req.body.units;
    }
    if (req.body.language) {
      user.preferences.language = req.body.language;
    }
    if (req.body.notifications) {
      if (req.body.notifications.email !== undefined) {
        user.preferences.notifications.email = req.body.notifications.email;
      }
      if (req.body.notifications.push !== undefined) {
        user.preferences.notifications.push = req.body.notifications.push;
      }
    }
    if (req.body.privacy) {
      if (req.body.privacy.shareData !== undefined) {
        user.preferences.privacy.shareData = req.body.privacy.shareData;
      }
      if (req.body.privacy.anonymizeData !== undefined) {
        user.preferences.privacy.anonymizeData = req.body.privacy.anonymizeData;
      }
    }

    await user.save();

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating preferences'
    });
  }
});

// @route   PUT /api/users/consent
// @desc    Update user's consent preferences
// @access  Private
router.put('/consent', [
  body('dataCollection')
    .isBoolean()
    .withMessage('Data collection consent must be boolean'),
  body('dataProcessing')
    .isBoolean()
    .withMessage('Data processing consent must be boolean'),
  body('dataSharing')
    .isBoolean()
    .withMessage('Data sharing consent must be boolean')
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

    const { dataCollection, dataProcessing, dataSharing } = req.body;

    const user = await User.findById(req.user._id);

    // Update consent
    user.consent.dataCollection = dataCollection;
    user.consent.dataProcessing = dataProcessing;
    user.consent.dataSharing = dataSharing;
    user.consent.consentDate = new Date();
    user.consent.consentVersion = '1.0';

    await user.save();

    res.json({
      success: true,
      message: 'Consent preferences updated successfully',
      data: {
        consent: user.consent
      }
    });
  } catch (error) {
    console.error('Update consent error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating consent preferences'
    });
  }
});

// @route   DELETE /api/users/account
// @desc    Delete user's account
// @access  Private
router.delete('/account', [
  body('password')
    .notEmpty()
    .withMessage('Password is required to delete account')
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

    const { password } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Password is incorrect'
      });
    }

    // Delete user's trips
    await Trip.deleteMany({ user: req.user._id });

    // Delete user's analytics
    await require('../models/Analytics').deleteMany({ user: req.user._id });

    // Delete user account
    await User.findByIdAndDelete(req.user._id);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting account'
    });
  }
});

// @route   GET /api/users/stats
// @desc    Get user's statistics
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    // Get trip statistics
    const tripStats = await Trip.getUserStats(req.user._id);

    // Get user's join date
    const user = await User.findById(req.user._id).select('createdAt');

    // Get recent activity
    const recentTrips = await Trip.find({
      user: req.user._id,
      isCompleted: true
    })
      .sort({ startTime: -1 })
      .limit(5)
      .select('modeOfTransport purpose distance duration startTime');

    // Get monthly breakdown for the last 12 months
    const monthlyStats = await Trip.aggregate([
      {
        $match: {
          user: req.user._id,
          isCompleted: true,
          startTime: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$startTime' },
            month: { $month: '$startTime' }
          },
          trips: { $sum: 1 },
          distance: { $sum: '$distance' },
          duration: { $sum: '$duration' },
          carbonFootprint: { $sum: '$carbonFootprint' }
        }
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1 }
      },
      {
        $limit: 12
      }
    ]);

    res.json({
      success: true,
      data: {
        tripStats: tripStats[0] || {
          totalTrips: 0,
          totalDistance: 0,
          totalDuration: 0,
          totalCarbonFootprint: 0,
          averageDistance: 0,
          averageDuration: 0
        },
        userStats: {
          memberSince: user.createdAt,
          lastLogin: req.user.lastLogin,
          totalActiveDays: new Set(recentTrips.map(trip => trip.startTime.toDateString())).size
        },
        recentTrips,
        monthlyStats
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user statistics'
    });
  }
});

// @route   POST /api/users/upload-avatar
// @desc    Upload user's profile picture
// @access  Private
router.post('/upload-avatar', async (req, res) => {
  try {
    // In a real application, you would handle file upload here
    // For now, we'll just return a placeholder
    res.json({
      success: true,
      message: 'Avatar upload functionality not implemented yet',
      data: {
        avatarUrl: null
      }
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading avatar'
    });
  }
});

module.exports = router;
