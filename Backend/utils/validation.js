const { body, validationResult } = require('express-validator');

/**
 * Common validation rules
 */
const commonValidations = {
  email: body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
    
  password: body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
    
  firstName: body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
    
  lastName: body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
    
  phone: body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please enter a valid phone number'),
    
  latitude: body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
    
  longitude: body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
    
  modeOfTransport: body('modeOfTransport')
    .isIn(['walking', 'cycling', 'car', 'motorcycle', 'bus', 'train', 'metro', 'taxi', 'rideshare', 'plane', 'boat', 'other'])
    .withMessage('Invalid mode of transport'),
    
  purpose: body('purpose')
    .isIn(['work', 'education', 'shopping', 'recreation', 'healthcare', 'social', 'personal', 'tourism', 'other'])
    .withMessage('Invalid trip purpose'),
    
  isoDate: body('date')
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
    
  page: body('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
    
  limit: body('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
};

/**
 * Location validation rules
 */
const locationValidations = {
  startLocation: [
    body('startLocation.latitude')
      .isFloat({ min: -90, max: 90 })
      .withMessage('Start latitude must be between -90 and 90'),
    body('startLocation.longitude')
      .isFloat({ min: -180, max: 180 })
      .withMessage('Start longitude must be between -180 and 180')
  ],
  
  endLocation: [
    body('endLocation.latitude')
      .isFloat({ min: -90, max: 90 })
      .withMessage('End latitude must be between -90 and 90'),
    body('endLocation.longitude')
      .isFloat({ min: -180, max: 180 })
      .withMessage('End longitude must be between -180 and 180')
  ],
  
  location: [
    body('latitude')
      .isFloat({ min: -90, max: 90 })
      .withMessage('Latitude must be between -90 and 90'),
    body('longitude')
      .isFloat({ min: -180, max: 180 })
      .withMessage('Longitude must be between -180 and 180')
  ]
};

/**
 * Trip validation rules
 */
const tripValidations = {
  create: [
    ...locationValidations.startLocation,
    ...locationValidations.endLocation,
    body('startTime')
      .isISO8601()
      .withMessage('Start time must be a valid ISO 8601 date'),
    body('endTime')
      .isISO8601()
      .withMessage('End time must be a valid ISO 8601 date'),
    commonValidations.modeOfTransport,
    commonValidations.purpose,
    body('companions')
      .optional()
      .isArray()
      .withMessage('Companions must be an array'),
    body('companions.*.name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Companion name must be between 1 and 100 characters'),
    body('companions.*.relationship')
      .optional()
      .isIn(['family', 'friend', 'colleague', 'stranger', 'other'])
      .withMessage('Invalid relationship type'),
    body('notes')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Notes cannot exceed 500 characters')
  ],
  
  update: [
    body('modeOfTransport')
      .optional()
      .isIn(['walking', 'cycling', 'car', 'motorcycle', 'bus', 'train', 'metro', 'taxi', 'rideshare', 'plane', 'boat', 'other'])
      .withMessage('Invalid mode of transport'),
    body('purpose')
      .optional()
      .isIn(['work', 'education', 'shopping', 'recreation', 'healthcare', 'social', 'personal', 'tourism', 'other'])
      .withMessage('Invalid trip purpose'),
    body('notes')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Notes cannot exceed 500 characters')
  ],
  
  track: [
    ...locationValidations.location,
    body('timestamp')
      .optional()
      .isISO8601()
      .withMessage('Timestamp must be a valid ISO 8601 date'),
    body('accuracy')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Accuracy must be a positive number'),
    body('altitude')
      .optional()
      .isFloat()
      .withMessage('Altitude must be a number'),
    body('speed')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Speed must be a positive number'),
    body('heading')
      .optional()
      .isFloat({ min: 0, max: 360 })
      .withMessage('Heading must be between 0 and 360 degrees')
  ],
  
  issue: [
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
      .withMessage('Invalid severity level'),
    body('photos')
      .optional()
      .isArray()
      .withMessage('Photos must be an array'),
    body('photos.*')
      .optional()
      .isURL()
      .withMessage('Photo must be a valid URL')
  ]
};

/**
 * User validation rules
 */
const userValidations = {
  register: [
    commonValidations.email,
    commonValidations.password,
    commonValidations.firstName,
    commonValidations.lastName,
    commonValidations.phone,
    body('dateOfBirth')
      .optional()
      .isISO8601()
      .withMessage('Date of birth must be a valid ISO 8601 date'),
    body('gender')
      .optional()
      .isIn(['male', 'female', 'other', 'prefer_not_to_say'])
      .withMessage('Invalid gender selection'),
    body('consent.dataCollection')
      .equals('true')
      .withMessage('Data collection consent is required'),
    body('consent.dataProcessing')
      .equals('true')
      .withMessage('Data processing consent is required'),
    body('consent.dataSharing')
      .equals('true')
      .withMessage('Data sharing consent is required')
  ],
  
  login: [
    commonValidations.email,
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  
  updateProfile: [
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
    commonValidations.phone,
    body('dateOfBirth')
      .optional()
      .isISO8601()
      .withMessage('Date of birth must be a valid ISO 8601 date'),
    body('gender')
      .optional()
      .isIn(['male', 'female', 'other', 'prefer_not_to_say'])
      .withMessage('Invalid gender selection')
  ],
  
  changePassword: [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters')
  ],
  
  updatePreferences: [
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
  ],
  
  updateConsent: [
    body('dataCollection')
      .isBoolean()
      .withMessage('Data collection consent must be boolean'),
    body('dataProcessing')
      .isBoolean()
      .withMessage('Data processing consent must be boolean'),
    body('dataSharing')
      .isBoolean()
      .withMessage('Data sharing consent must be boolean')
  ]
};

/**
 * Query validation rules
 */
const queryValidations = {
  pagination: [
    commonValidations.page,
    commonValidations.limit
  ],
  
  dateRange: [
    body('startDate')
      .optional()
      .isISO8601()
      .withMessage('Start date must be a valid ISO 8601 date'),
    body('endDate')
      .optional()
      .isISO8601()
      .withMessage('End date must be a valid ISO 8601 date')
  ],
  
  tripFilters: [
    body('modeOfTransport')
      .optional()
      .isIn(['walking', 'cycling', 'car', 'motorcycle', 'bus', 'train', 'metro', 'taxi', 'rideshare', 'plane', 'boat', 'other'])
      .withMessage('Invalid mode of transport filter'),
    body('purpose')
      .optional()
      .isIn(['work', 'education', 'shopping', 'recreation', 'healthcare', 'social', 'personal', 'tourism', 'other'])
      .withMessage('Invalid purpose filter'),
    ...queryValidations.dateRange
  ]
};

/**
 * Handle validation errors
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {Object} Validation result
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * Sanitize input data
 * @param {Object} data - Input data
 * @returns {Object} Sanitized data
 */
const sanitizeInput = (data) => {
  const sanitized = {};
  
  Object.keys(data).forEach(key => {
    if (typeof data[key] === 'string') {
      sanitized[key] = data[key].trim();
    } else if (typeof data[key] === 'object' && data[key] !== null) {
      sanitized[key] = sanitizeInput(data[key]);
    } else {
      sanitized[key] = data[key];
    }
  });
  
  return sanitized;
};

/**
 * Validate file upload
 * @param {Object} file - Uploaded file
 * @param {Array} allowedTypes - Allowed MIME types
 * @param {number} maxSize - Maximum file size in bytes
 * @returns {Object} Validation result
 */
const validateFileUpload = (file, allowedTypes = ['image/jpeg', 'image/png', 'image/gif'], maxSize = 5 * 1024 * 1024) => {
  if (!file) {
    return { valid: false, error: 'No file uploaded' };
  }
  
  if (!allowedTypes.includes(file.mimetype)) {
    return { valid: false, error: 'Invalid file type' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File too large' };
  }
  
  return { valid: true };
};

module.exports = {
  commonValidations,
  locationValidations,
  tripValidations,
  userValidations,
  queryValidations,
  handleValidationErrors,
  sanitizeInput,
  validateFileUpload
};
