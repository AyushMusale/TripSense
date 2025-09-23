const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true,
    index: true
  },
  metrics: {
    totalTrips: {
      type: Number,
      default: 0
    },
    totalDistance: {
      type: Number,
      default: 0 // in meters
    },
    totalDuration: {
      type: Number,
      default: 0 // in minutes
    },
    totalCarbonFootprint: {
      type: Number,
      default: 0 // in kg CO2
    },
    averageSpeed: {
      type: Number,
      default: 0 // in km/h
    },
    modeBreakdown: {
      walking: {
        trips: { type: Number, default: 0 },
        distance: { type: Number, default: 0 },
        duration: { type: Number, default: 0 }
      },
      cycling: {
        trips: { type: Number, default: 0 },
        distance: { type: Number, default: 0 },
        duration: { type: Number, default: 0 }
      },
      car: {
        trips: { type: Number, default: 0 },
        distance: { type: Number, default: 0 },
        duration: { type: Number, default: 0 }
      },
      publicTransport: {
        trips: { type: Number, default: 0 },
        distance: { type: Number, default: 0 },
        duration: { type: Number, default: 0 }
      },
      other: {
        trips: { type: Number, default: 0 },
        distance: { type: Number, default: 0 },
        duration: { type: Number, default: 0 }
      }
    },
    purposeBreakdown: {
      work: { type: Number, default: 0 },
      education: { type: Number, default: 0 },
      shopping: { type: Number, default: 0 },
      recreation: { type: Number, default: 0 },
      healthcare: { type: Number, default: 0 },
      social: { type: Number, default: 0 },
      personal: { type: Number, default: 0 },
      tourism: { type: Number, default: 0 },
      other: { type: Number, default: 0 }
    },
    timeBreakdown: {
      morning: { type: Number, default: 0 }, // 6-12
      afternoon: { type: Number, default: 0 }, // 12-18
      evening: { type: Number, default: 0 }, // 18-24
      night: { type: Number, default: 0 } // 0-6
    },
    weekdayTrips: {
      type: Number,
      default: 0
    },
    weekendTrips: {
      type: Number,
      default: 0
    }
  },
  insights: {
    mostUsedMode: String,
    longestTrip: {
      distance: Number,
      duration: Number,
      mode: String
    },
    shortestTrip: {
      distance: Number,
      duration: Number,
      mode: String
    },
    averageTripDistance: Number,
    averageTripDuration: Number,
    carbonEfficiency: Number, // kg CO2 per km
    activeDays: Number,
    consistencyScore: Number // 0-1
  },
  trends: {
    distanceTrend: {
      type: String,
      enum: ['increasing', 'decreasing', 'stable'],
      default: 'stable'
    },
    carbonTrend: {
      type: String,
      enum: ['increasing', 'decreasing', 'stable'],
      default: 'stable'
    },
    modeShift: {
      type: String,
      enum: ['sustainable', 'unsustainable', 'neutral'],
      default: 'neutral'
    }
  },
  goals: {
    distanceGoal: Number,
    carbonGoal: Number,
    tripsGoal: Number,
    achieved: {
      distance: { type: Boolean, default: false },
      carbon: { type: Boolean, default: false },
      trips: { type: Boolean, default: false }
    }
  },
  recommendations: [{
    type: {
      type: String,
      enum: ['mode_shift', 'route_optimization', 'timing', 'carbon_reduction', 'health']
    },
    title: String,
    description: String,
    impact: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    carbonSavings: Number,
    timeSavings: Number,
    healthBenefits: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for efficient queries
analyticsSchema.index({ user: 1, period: 1, date: -1 });
analyticsSchema.index({ user: 1, date: -1 });
analyticsSchema.index({ period: 1, date: -1 });

// Virtual for total distance in kilometers
analyticsSchema.virtual('totalDistanceKm').get(function() {
  return this.metrics.totalDistance / 1000;
});

// Virtual for total duration in hours
analyticsSchema.virtual('totalDurationHours').get(function() {
  return this.metrics.totalDuration / 60;
});

// Method to calculate consistency score
analyticsSchema.methods.calculateConsistencyScore = function() {
  if (this.period === 'daily') {
    // For daily analytics, consistency is based on active days in the period
    const daysInPeriod = this.date.getDate();
    this.insights.consistencyScore = this.insights.activeDays / daysInPeriod;
  } else if (this.period === 'weekly') {
    // For weekly analytics, consistency is based on active days in the week
    this.insights.consistencyScore = this.insights.activeDays / 7;
  } else if (this.period === 'monthly') {
    // For monthly analytics, consistency is based on active days in the month
    const daysInMonth = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();
    this.insights.consistencyScore = this.insights.activeDays / daysInMonth;
  }
  
  return this.insights.consistencyScore;
};

// Method to generate recommendations
analyticsSchema.methods.generateRecommendations = function() {
  const recommendations = [];
  
  // Mode shift recommendations
  if (this.metrics.modeBreakdown.car.trips > this.metrics.modeBreakdown.walking.trips + this.metrics.modeBreakdown.cycling.trips) {
    recommendations.push({
      type: 'mode_shift',
      title: 'Consider Walking or Cycling',
      description: 'You use your car more than walking or cycling. Try replacing short car trips with active transport.',
      impact: 'high',
      carbonSavings: this.metrics.modeBreakdown.car.distance * 0.1, // Rough estimate
      healthBenefits: 'Improved cardiovascular health and reduced stress'
    });
  }
  
  // Carbon reduction recommendations
  if (this.metrics.totalCarbonFootprint > 10) { // More than 10kg CO2
    recommendations.push({
      type: 'carbon_reduction',
      title: 'Reduce Carbon Footprint',
      description: 'Your carbon footprint is high. Consider using public transport or carpooling.',
      impact: 'medium',
      carbonSavings: this.metrics.totalCarbonFootprint * 0.2
    });
  }
  
  // Route optimization
  if (this.insights.averageTripDistance > 10000) { // More than 10km average
    recommendations.push({
      type: 'route_optimization',
      title: 'Optimize Your Routes',
      description: 'Your trips are quite long. Consider planning more efficient routes or combining trips.',
      impact: 'medium',
      timeSavings: this.metrics.totalDuration * 0.1
    });
  }
  
  this.recommendations = recommendations;
  return recommendations;
};

// Static method to generate analytics for a user
analyticsSchema.statics.generateUserAnalytics = async function(userId, period = 'daily', date = new Date()) {
  const startDate = new Date(date);
  const endDate = new Date(date);
  
  // Set date range based on period
  switch (period) {
    case 'daily':
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'weekly':
      startDate.setDate(date.getDate() - date.getDay());
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(date.getDate() - date.getDay() + 6);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'monthly':
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setMonth(date.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'yearly':
      startDate.setMonth(0, 1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setMonth(11, 31);
      endDate.setHours(23, 59, 59, 999);
      break;
  }
  
  // Aggregate trip data
  const tripData = await mongoose.model('Trip').aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        startTime: { $gte: startDate, $lte: endDate },
        isCompleted: true
      }
    },
    {
      $group: {
        _id: null,
        totalTrips: { $sum: 1 },
        totalDistance: { $sum: '$distance' },
        totalDuration: { $sum: '$duration' },
        totalCarbonFootprint: { $sum: '$carbonFootprint' },
        trips: { $push: '$$ROOT' }
      }
    }
  ]);
  
  if (tripData.length === 0) {
    return null;
  }
  
  const data = tripData[0];
  const trips = data.trips;
  
  // Calculate mode breakdown
  const modeBreakdown = {
    walking: { trips: 0, distance: 0, duration: 0 },
    cycling: { trips: 0, distance: 0, duration: 0 },
    car: { trips: 0, distance: 0, duration: 0 },
    publicTransport: { trips: 0, distance: 0, duration: 0 },
    other: { trips: 0, distance: 0, duration: 0 }
  };
  
  trips.forEach(trip => {
    const mode = trip.modeOfTransport;
    if (['walking'].includes(mode)) {
      modeBreakdown.walking.trips++;
      modeBreakdown.walking.distance += trip.distance;
      modeBreakdown.walking.duration += trip.duration;
    } else if (['cycling'].includes(mode)) {
      modeBreakdown.cycling.trips++;
      modeBreakdown.cycling.distance += trip.distance;
      modeBreakdown.cycling.duration += trip.duration;
    } else if (['car', 'motorcycle', 'taxi', 'rideshare'].includes(mode)) {
      modeBreakdown.car.trips++;
      modeBreakdown.car.distance += trip.distance;
      modeBreakdown.car.duration += trip.duration;
    } else if (['bus', 'train', 'metro'].includes(mode)) {
      modeBreakdown.publicTransport.trips++;
      modeBreakdown.publicTransport.distance += trip.distance;
      modeBreakdown.publicTransport.duration += trip.duration;
    } else {
      modeBreakdown.other.trips++;
      modeBreakdown.other.distance += trip.distance;
      modeBreakdown.other.duration += trip.duration;
    }
  });
  
  // Calculate insights
  const longestTrip = trips.reduce((max, trip) => 
    trip.distance > max.distance ? trip : max, trips[0] || { distance: 0, duration: 0 });
  
  const shortestTrip = trips.reduce((min, trip) => 
    trip.distance < min.distance ? trip : min, trips[0] || { distance: Infinity, duration: 0 });
  
  const averageSpeed = data.totalDistance > 0 ? 
    (data.totalDistance / 1000) / (data.totalDuration / 60) : 0;
  
  // Create analytics document
  const analytics = new this({
    user: userId,
    date: date,
    period: period,
    metrics: {
      totalTrips: data.totalTrips,
      totalDistance: data.totalDistance,
      totalDuration: data.totalDuration,
      totalCarbonFootprint: data.totalCarbonFootprint,
      averageSpeed: averageSpeed,
      modeBreakdown: modeBreakdown
    },
    insights: {
      longestTrip: {
        distance: longestTrip.distance,
        duration: longestTrip.duration,
        mode: longestTrip.modeOfTransport
      },
      shortestTrip: {
        distance: shortestTrip.distance,
        duration: shortestTrip.duration,
        mode: shortestTrip.modeOfTransport
      },
      averageTripDistance: data.totalTrips > 0 ? data.totalDistance / data.totalTrips : 0,
      averageTripDuration: data.totalTrips > 0 ? data.totalDuration / data.totalTrips : 0,
      carbonEfficiency: data.totalDistance > 0 ? data.totalCarbonFootprint / (data.totalDistance / 1000) : 0,
      activeDays: new Set(trips.map(trip => trip.startTime.toDateString())).size
    }
  });
  
  // Calculate consistency score and generate recommendations
  analytics.calculateConsistencyScore();
  analytics.generateRecommendations();
  
  return analytics;
};

module.exports = mongoose.model('Analytics', analyticsSchema);
