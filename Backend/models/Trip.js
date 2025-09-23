const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true,
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,
    required: true,
    min: -180,
    max: 180
  },
  accuracy: {
    type: Number,
    min: 0
  },
  altitude: Number,
  speed: Number,
  heading: Number,
  timestamp: {
    type: Date,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    formatted: String
  }
}, { _id: false });

const companionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Companion name cannot exceed 100 characters']
  },
  relationship: {
    type: String,
    enum: ['family', 'friend', 'colleague', 'stranger', 'other'],
    default: 'other'
  },
  ageGroup: {
    type: String,
    enum: ['child', 'teen', 'adult', 'senior', 'unknown'],
    default: 'unknown'
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'unknown'],
    default: 'unknown'
  }
}, { _id: false });

const tripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  tripId: {
    type: String,
    unique: true,
    required: true
  },
  startLocation: {
    type: locationSchema,
    required: true
  },
  endLocation: {
    type: locationSchema,
    required: true
  },
  startTime: {
    type: Date,
    required: true,
    index: true
  },
  endTime: {
    type: Date,
    required: true,
    index: true
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: 0
  },
  distance: {
    type: Number, // in meters
    required: true,
    min: 0
  },
  modeOfTransport: {
    type: String,
    required: true,
    enum: [
      'walking',
      'cycling',
      'car',
      'motorcycle',
      'bus',
      'train',
      'metro',
      'taxi',
      'rideshare',
      'plane',
      'boat',
      'other'
    ],
    index: true
  },
  purpose: {
    type: String,
    required: true,
    enum: [
      'work',
      'education',
      'shopping',
      'recreation',
      'healthcare',
      'social',
      'personal',
      'tourism',
      'other'
    ],
    index: true
  },
  companions: [companionSchema],
  route: [locationSchema], // GPS track points
  isActive: {
    type: Boolean,
    default: false
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  isAutoDetected: {
    type: Boolean,
    default: false
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 1
  },
  carbonFootprint: {
    type: Number, // in kg CO2
    min: 0
  },
  cost: {
    amount: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  weather: {
    temperature: Number,
    condition: String,
    humidity: Number,
    windSpeed: Number
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  issues: [{
    type: {
      type: String,
      enum: ['delay', 'cancellation', 'crowding', 'safety', 'accessibility', 'other']
    },
    description: String,
    location: locationSchema,
    timestamp: Date,
    photos: [String], // URLs to uploaded photos
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['reported', 'acknowledged', 'in_progress', 'resolved', 'closed'],
      default: 'reported'
    }
  }],
  metadata: {
    appVersion: String,
    deviceInfo: {
      deviceId: String,
      deviceType: String,
      osVersion: String
    },
    batteryLevel: Number,
    networkType: String,
    accuracy: Number
  },
  privacy: {
    isAnonymized: {
      type: Boolean,
      default: false
    },
    shareWithPlanners: {
      type: Boolean,
      default: false
    },
    dataRetention: {
      type: Date,
      default: function() {
        return new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year from now
      }
    }
  },
  validation: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationMethod: {
      type: String,
      enum: ['manual', 'gps', 'auto', 'hybrid']
    },
    qualityScore: {
      type: Number,
      min: 0,
      max: 1
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for trip duration in hours
tripSchema.virtual('durationHours').get(function() {
  return this.duration / 60;
});

// Virtual for distance in kilometers
tripSchema.virtual('distanceKm').get(function() {
  return this.distance / 1000;
});

// Virtual for average speed in km/h
tripSchema.virtual('averageSpeed').get(function() {
  if (this.duration === 0) return 0;
  return (this.distance / 1000) / (this.duration / 60);
});

// Indexes for better query performance
tripSchema.index({ user: 1, startTime: -1 });
tripSchema.index({ modeOfTransport: 1, startTime: -1 });
tripSchema.index({ purpose: 1, startTime: -1 });
tripSchema.index({ startTime: -1, endTime: -1 });
tripSchema.index({ isCompleted: 1, isActive: 1 });
tripSchema.index({ 'startLocation.latitude': 1, 'startLocation.longitude': 1 });
tripSchema.index({ 'endLocation.latitude': 1, 'endLocation.longitude': 1 });
tripSchema.index({ carbonFootprint: 1 });
tripSchema.index({ 'privacy.dataRetention': 1 });

// Pre-save middleware to generate tripId
tripSchema.pre('save', function(next) {
  if (!this.tripId) {
    this.tripId = `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

// Pre-save middleware to calculate duration and distance
tripSchema.pre('save', function(next) {
  if (this.startTime && this.endTime) {
    this.duration = Math.round((this.endTime - this.startTime) / (1000 * 60)); // in minutes
  }
  next();
});

// Method to calculate carbon footprint
tripSchema.methods.calculateCarbonFootprint = function() {
  const carbonFactors = {
    walking: 0,
    cycling: 0,
    car: 0.192, // kg CO2 per km
    motorcycle: 0.113,
    bus: 0.089,
    train: 0.041,
    metro: 0.041,
    taxi: 0.192,
    rideshare: 0.192,
    plane: 0.255,
    boat: 0.018,
    other: 0.1
  };
  
  const factor = carbonFactors[this.modeOfTransport] || 0.1;
  this.carbonFootprint = (this.distance / 1000) * factor;
  return this.carbonFootprint;
};

// Method to anonymize trip data
tripSchema.methods.anonymize = function() {
  // Round coordinates to reduce precision
  if (this.startLocation) {
    this.startLocation.latitude = Math.round(this.startLocation.latitude * 100) / 100;
    this.startLocation.longitude = Math.round(this.startLocation.longitude * 100) / 100;
  }
  if (this.endLocation) {
    this.endLocation.latitude = Math.round(this.endLocation.latitude * 100) / 100;
    this.endLocation.longitude = Math.round(this.endLocation.longitude * 100) / 100;
  }
  
  // Remove personal identifiers
  this.companions = [];
  this.notes = '';
  this.privacy.isAnonymized = true;
  
  return this;
};

// Static method to get trip statistics
tripSchema.statics.getUserStats = async function(userId, startDate, endDate) {
  const matchStage = {
    user: mongoose.Types.ObjectId(userId),
    isCompleted: true
  };
  
  if (startDate && endDate) {
    matchStage.startTime = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }
  
  return await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalTrips: { $sum: 1 },
        totalDistance: { $sum: '$distance' },
        totalDuration: { $sum: '$duration' },
        totalCarbonFootprint: { $sum: '$carbonFootprint' },
        averageDistance: { $avg: '$distance' },
        averageDuration: { $avg: '$duration' },
        modeBreakdown: {
          $push: {
            mode: '$modeOfTransport',
            distance: '$distance',
            duration: '$duration'
          }
        }
      }
    }
  ]);
};

module.exports = mongoose.model('Trip', tripSchema);
