/**
 * Carbon footprint calculation utilities for different transport modes
 */

// Carbon emission factors (kg CO2 per km)
const CARBON_FACTORS = {
  walking: 0,
  cycling: 0,
  car: 0.192, // Average car
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

// Fuel efficiency factors for different car types
const CAR_FUEL_FACTORS = {
  petrol: 0.192,
  diesel: 0.171,
  hybrid: 0.120,
  electric: 0.053, // Depends on electricity source
  lpg: 0.180
};

// Bus type factors
const BUS_FACTORS = {
  city: 0.089,
  intercity: 0.103,
  school: 0.089,
  coach: 0.027
};

/**
 * Calculate carbon footprint for a trip
 * @param {string} modeOfTransport - Transport mode
 * @param {number} distance - Distance in meters
 * @param {Object} options - Additional options
 * @returns {number} Carbon footprint in kg CO2
 */
const calculateCarbonFootprint = (modeOfTransport, distance, options = {}) => {
  const distanceKm = distance / 1000;
  
  let factor = CARBON_FACTORS[modeOfTransport] || CARBON_FACTORS.other;
  
  // Apply specific factors based on options
  if (modeOfTransport === 'car' && options.fuelType) {
    factor = CAR_FUEL_FACTORS[options.fuelType] || factor;
  }
  
  if (modeOfTransport === 'bus' && options.busType) {
    factor = BUS_FACTORS[options.busType] || factor;
  }
  
  // Apply occupancy factor for shared transport
  if (options.occupancy && options.occupancy > 1) {
    factor = factor / options.occupancy;
  }
  
  return distanceKm * factor;
};

/**
 * Calculate carbon savings compared to car
 * @param {string} modeOfTransport - Transport mode
 * @param {number} distance - Distance in meters
 * @param {Object} options - Additional options
 * @returns {number} Carbon savings in kg CO2
 */
const calculateCarbonSavings = (modeOfTransport, distance, options = {}) => {
  const carFootprint = calculateCarbonFootprint('car', distance, options);
  const actualFootprint = calculateCarbonFootprint(modeOfTransport, distance, options);
  
  return Math.max(0, carFootprint - actualFootprint);
};

/**
 * Calculate carbon efficiency (kg CO2 per km)
 * @param {string} modeOfTransport - Transport mode
 * @param {Object} options - Additional options
 * @returns {number} Carbon efficiency in kg CO2/km
 */
const getCarbonEfficiency = (modeOfTransport, options = {}) => {
  let factor = CARBON_FACTORS[modeOfTransport] || CARBON_FACTORS.other;
  
  if (modeOfTransport === 'car' && options.fuelType) {
    factor = CAR_FUEL_FACTORS[options.fuelType] || factor;
  }
  
  if (modeOfTransport === 'bus' && options.busType) {
    factor = BUS_FACTORS[options.busType] || factor;
  }
  
  if (options.occupancy && options.occupancy > 1) {
    factor = factor / options.occupancy;
  }
  
  return factor;
};

/**
 * Get carbon footprint ranking for different modes
 * @param {number} distance - Distance in meters
 * @param {Object} options - Additional options
 * @returns {Array} Sorted array of modes by carbon footprint
 */
const getCarbonRanking = (distance, options = {}) => {
  const modes = Object.keys(CARBON_FACTORS);
  
  return modes
    .map(mode => ({
      mode,
      footprint: calculateCarbonFootprint(mode, distance, options),
      efficiency: getCarbonEfficiency(mode, options)
    }))
    .sort((a, b) => a.footprint - b.footprint);
};

/**
 * Calculate carbon footprint for multiple trips
 * @param {Array} trips - Array of trip objects
 * @returns {Object} Summary of carbon footprint
 */
const calculateTotalCarbonFootprint = (trips) => {
  let totalFootprint = 0;
  const modeBreakdown = {};
  
  trips.forEach(trip => {
    const footprint = calculateCarbonFootprint(
      trip.modeOfTransport,
      trip.distance,
      trip.options || {}
    );
    
    totalFootprint += footprint;
    
    if (!modeBreakdown[trip.modeOfTransport]) {
      modeBreakdown[trip.modeOfTransport] = 0;
    }
    modeBreakdown[trip.modeOfTransport] += footprint;
  });
  
  return {
    totalFootprint,
    modeBreakdown,
    averageFootprint: trips.length > 0 ? totalFootprint / trips.length : 0
  };
};

/**
 * Calculate carbon footprint reduction potential
 * @param {Array} trips - Array of trip objects
 * @returns {Object} Reduction potential analysis
 */
const calculateReductionPotential = (trips) => {
  const carTrips = trips.filter(trip => 
    ['car', 'taxi', 'rideshare'].includes(trip.modeOfTransport)
  );
  
  const potentialSavings = carTrips.map(trip => {
    const currentFootprint = calculateCarbonFootprint(
      trip.modeOfTransport,
      trip.distance,
      trip.options || {}
    );
    
    const alternatives = ['walking', 'cycling', 'bus', 'train'];
    const bestAlternative = alternatives.reduce((best, mode) => {
      const footprint = calculateCarbonFootprint(mode, trip.distance, trip.options || {});
      return footprint < best.footprint ? { mode, footprint } : best;
    }, { mode: 'walking', footprint: currentFootprint });
    
    return {
      tripId: trip._id,
      currentMode: trip.modeOfTransport,
      currentFootprint,
      bestAlternative: bestAlternative.mode,
      alternativeFootprint: bestAlternative.footprint,
      potentialSavings: currentFootprint - bestAlternative.footprint
    };
  });
  
  const totalPotentialSavings = potentialSavings.reduce(
    (sum, trip) => sum + trip.potentialSavings, 0
  );
  
  return {
    totalPotentialSavings,
    potentialSavings,
    carTripsCount: carTrips.length,
    averageSavingsPerTrip: carTrips.length > 0 ? totalPotentialSavings / carTrips.length : 0
  };
};

/**
 * Get carbon footprint insights
 * @param {Array} trips - Array of trip objects
 * @returns {Object} Carbon footprint insights
 */
const getCarbonInsights = (trips) => {
  const totalFootprint = calculateTotalCarbonFootprint(trips);
  const reductionPotential = calculateReductionPotential(trips);
  
  const insights = [];
  
  // High carbon footprint insight
  if (totalFootprint.totalFootprint > 50) {
    insights.push({
      type: 'high_carbon',
      severity: 'high',
      title: 'High Carbon Footprint',
      message: `Your total carbon footprint is ${totalFootprint.totalFootprint.toFixed(1)} kg CO2. Consider using more sustainable transport modes.`,
      action: 'Try walking, cycling, or public transport for short trips'
    });
  }
  
  // Car dependency insight
  const carFootprint = totalFootprint.modeBreakdown.car || 0;
  const carPercentage = totalFootprint.totalFootprint > 0 ? 
    (carFootprint / totalFootprint.totalFootprint) * 100 : 0;
  
  if (carPercentage > 70) {
    insights.push({
      type: 'car_dependency',
      severity: 'medium',
      title: 'High Car Dependency',
      message: `${carPercentage.toFixed(1)}% of your carbon footprint comes from car travel.`,
      action: 'Consider alternatives like public transport or carpooling'
    });
  }
  
  // Reduction potential insight
  if (reductionPotential.totalPotentialSavings > 10) {
    insights.push({
      type: 'reduction_potential',
      severity: 'medium',
      title: 'High Reduction Potential',
      message: `You could reduce your carbon footprint by ${reductionPotential.totalPotentialSavings.toFixed(1)} kg CO2 by switching transport modes.`,
      action: 'Review your recent trips for optimization opportunities'
    });
  }
  
  return {
    insights,
    totalFootprint: totalFootprint.totalFootprint,
    reductionPotential: reductionPotential.totalPotentialSavings,
    carPercentage,
    modeBreakdown: totalFootprint.modeBreakdown
  };
};

module.exports = {
  calculateCarbonFootprint,
  calculateCarbonSavings,
  getCarbonEfficiency,
  getCarbonRanking,
  calculateTotalCarbonFootprint,
  calculateReductionPotential,
  getCarbonInsights,
  CARBON_FACTORS,
  CAR_FUEL_FACTORS,
  BUS_FACTORS
};
