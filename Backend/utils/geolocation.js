const geolib = require('geolib');

/**
 * Calculate distance between two points
 * @param {Object} point1 - {latitude, longitude}
 * @param {Object} point2 - {latitude, longitude}
 * @returns {number} Distance in meters
 */
const calculateDistance = (point1, point2) => {
  return geolib.getDistance(point1, point2);
};

/**
 * Calculate bearing between two points
 * @param {Object} point1 - {latitude, longitude}
 * @param {Object} point2 - {latitude, longitude}
 * @returns {number} Bearing in degrees
 */
const calculateBearing = (point1, point2) => {
  return geolib.getBearing(point1, point2);
};

/**
 * Check if a point is within a bounding box
 * @param {Object} point - {latitude, longitude}
 * @param {Object} bounds - {north, south, east, west}
 * @returns {boolean}
 */
const isPointInBounds = (point, bounds) => {
  return geolib.isPointInPolygon(point, [
    { latitude: bounds.north, longitude: bounds.west },
    { latitude: bounds.north, longitude: bounds.east },
    { latitude: bounds.south, longitude: bounds.east },
    { latitude: bounds.south, longitude: bounds.west }
  ]);
};

/**
 * Calculate the center point of multiple coordinates
 * @param {Array} coordinates - Array of {latitude, longitude} objects
 * @returns {Object} Center point {latitude, longitude}
 */
const getCenterPoint = (coordinates) => {
  return geolib.getCenter(coordinates);
};

/**
 * Calculate the bounds of multiple coordinates
 * @param {Array} coordinates - Array of {latitude, longitude} objects
 * @returns {Object} Bounds {north, south, east, west}
 */
const getBounds = (coordinates) => {
  const lats = coordinates.map(coord => coord.latitude);
  const lngs = coordinates.map(coord => coord.longitude);
  
  return {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lngs),
    west: Math.min(...lngs)
  };
};

/**
 * Calculate speed between two points with timestamps
 * @param {Object} point1 - {latitude, longitude, timestamp}
 * @param {Object} point2 - {latitude, longitude, timestamp}
 * @returns {number} Speed in km/h
 */
const calculateSpeed = (point1, point2) => {
  const distance = calculateDistance(point1, point2);
  const timeDiff = Math.abs(point2.timestamp - point1.timestamp) / 1000; // in seconds
  
  if (timeDiff === 0) return 0;
  
  const speedMs = distance / timeDiff; // m/s
  return speedMs * 3.6; // km/h
};

/**
 * Smooth GPS track by removing outliers
 * @param {Array} track - Array of {latitude, longitude, timestamp} objects
 * @param {number} maxSpeed - Maximum reasonable speed in km/h
 * @returns {Array} Filtered track
 */
const smoothTrack = (track, maxSpeed = 200) => {
  if (track.length < 2) return track;
  
  const filtered = [track[0]];
  
  for (let i = 1; i < track.length; i++) {
    const prevPoint = filtered[filtered.length - 1];
    const currentPoint = track[i];
    
    const speed = calculateSpeed(prevPoint, currentPoint);
    
    if (speed <= maxSpeed) {
      filtered.push(currentPoint);
    }
  }
  
  return filtered;
};

/**
 * Calculate total distance of a track
 * @param {Array} track - Array of {latitude, longitude} objects
 * @returns {number} Total distance in meters
 */
const calculateTrackDistance = (track) => {
  if (track.length < 2) return 0;
  
  let totalDistance = 0;
  
  for (let i = 1; i < track.length; i++) {
    totalDistance += calculateDistance(track[i - 1], track[i]);
  }
  
  return totalDistance;
};

/**
 * Calculate average speed of a track
 * @param {Array} track - Array of {latitude, longitude, timestamp} objects
 * @returns {number} Average speed in km/h
 */
const calculateAverageSpeed = (track) => {
  if (track.length < 2) return 0;
  
  const totalDistance = calculateTrackDistance(track);
  const timeDiff = (track[track.length - 1].timestamp - track[0].timestamp) / 1000; // in seconds
  
  if (timeDiff === 0) return 0;
  
  const speedMs = totalDistance / timeDiff; // m/s
  return speedMs * 3.6; // km/h
};

/**
 * Detect stops in a track
 * @param {Array} track - Array of {latitude, longitude, timestamp} objects
 * @param {number} minStopDuration - Minimum stop duration in minutes
 * @param {number} maxStopRadius - Maximum radius for stop detection in meters
 * @returns {Array} Array of stop objects {startTime, endTime, location, duration}
 */
const detectStops = (track, minStopDuration = 2, maxStopRadius = 50) => {
  const stops = [];
  let stopStart = null;
  let stopLocation = null;
  
  for (let i = 1; i < track.length; i++) {
    const prevPoint = track[i - 1];
    const currentPoint = track[i];
    
    const distance = calculateDistance(prevPoint, currentPoint);
    
    if (distance <= maxStopRadius) {
      if (!stopStart) {
        stopStart = prevPoint.timestamp;
        stopLocation = prevPoint;
      }
    } else {
      if (stopStart) {
        const stopDuration = (currentPoint.timestamp - stopStart) / (1000 * 60); // in minutes
        
        if (stopDuration >= minStopDuration) {
          stops.push({
            startTime: new Date(stopStart),
            endTime: new Date(currentPoint.timestamp),
            location: stopLocation,
            duration: stopDuration
          });
        }
        
        stopStart = null;
        stopLocation = null;
      }
    }
  }
  
  return stops;
};

/**
 * Reverse geocoding using a simple lookup (in production, use a real geocoding service)
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Object} Address object
 */
const reverseGeocode = async (latitude, longitude) => {
  // This is a placeholder - in production, integrate with Google Maps, OpenStreetMap, or similar
  return {
    street: 'Unknown Street',
    city: 'Unknown City',
    state: 'Unknown State',
    country: 'Unknown Country',
    postalCode: '00000',
    formatted: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
  };
};

module.exports = {
  calculateDistance,
  calculateBearing,
  isPointInBounds,
  getCenterPoint,
  getBounds,
  calculateSpeed,
  smoothTrack,
  calculateTrackDistance,
  calculateAverageSpeed,
  detectStops,
  reverseGeocode
};
