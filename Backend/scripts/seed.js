const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Trip = require('../models/Trip');
const Analytics = require('../models/Analytics');

// Sample data
const sampleUsers = [
  {
    email: 'admin@natpac.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    consent: {
      dataCollection: true,
      dataProcessing: true,
      dataSharing: true
    }
  },
  {
    email: 'analyst@natpac.com',
    password: 'analyst123',
    firstName: 'Data',
    lastName: 'Analyst',
    role: 'analyst',
    consent: {
      dataCollection: true,
      dataProcessing: true,
      dataSharing: true
    }
  },
  {
    email: 'user1@example.com',
    password: 'user123',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    gender: 'male',
    consent: {
      dataCollection: true,
      dataProcessing: true,
      dataSharing: false
    }
  },
  {
    email: 'user2@example.com',
    password: 'user123',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+1234567891',
    gender: 'female',
    consent: {
      dataCollection: true,
      dataProcessing: true,
      dataSharing: true
    }
  }
];

const sampleTrips = [
  {
    user: null, // Will be set to actual user ID
    startLocation: {
      latitude: 40.7128,
      longitude: -74.0060,
      timestamp: new Date('2024-01-01T09:00:00Z'),
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        formatted: '123 Main St, New York, NY, USA'
      }
    },
    endLocation: {
      latitude: 40.7589,
      longitude: -73.9851,
      timestamp: new Date('2024-01-01T09:30:00Z'),
      address: {
        street: '456 Broadway',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        formatted: '456 Broadway, New York, NY, USA'
      }
    },
    startTime: new Date('2024-01-01T09:00:00Z'),
    endTime: new Date('2024-01-01T09:30:00Z'),
    modeOfTransport: 'car',
    purpose: 'work',
    companions: [
      {
        name: 'Jane Doe',
        relationship: 'colleague',
        ageGroup: 'adult',
        gender: 'female'
      }
    ],
    notes: 'Morning commute to office'
  },
  {
    user: null,
    startLocation: {
      latitude: 40.7589,
      longitude: -73.9851,
      timestamp: new Date('2024-01-01T17:00:00Z'),
      address: {
        street: '456 Broadway',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        formatted: '456 Broadway, New York, NY, USA'
      }
    },
    endLocation: {
      latitude: 40.7128,
      longitude: -74.0060,
      timestamp: new Date('2024-01-01T17:45:00Z'),
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        formatted: '123 Main St, New York, NY, USA'
      }
    },
    startTime: new Date('2024-01-01T17:00:00Z'),
    endTime: new Date('2024-01-01T17:45:00Z'),
    modeOfTransport: 'bus',
    purpose: 'work',
    notes: 'Evening commute home'
  },
  {
    user: null,
    startLocation: {
      latitude: 40.7128,
      longitude: -74.0060,
      timestamp: new Date('2024-01-02T10:00:00Z'),
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        formatted: '123 Main St, New York, NY, USA'
      }
    },
    endLocation: {
      latitude: 40.7505,
      longitude: -73.9934,
      timestamp: new Date('2024-01-02T10:15:00Z'),
      address: {
        street: '789 5th Ave',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        formatted: '789 5th Ave, New York, NY, USA'
      }
    },
    startTime: new Date('2024-01-02T10:00:00Z'),
    endTime: new Date('2024-01-02T10:15:00Z'),
    modeOfTransport: 'walking',
    purpose: 'shopping',
    notes: 'Walk to grocery store'
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/natpac_travel');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create users
    const users = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      users.push(user);
      console.log(`Created user: ${user.email}`);
    }

    return users;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

const seedTrips = async (users) => {
  try {
    // Clear existing trips
    await Trip.deleteMany({});
    console.log('Cleared existing trips');

    // Create trips
    const trips = [];
    const regularUsers = users.filter(user => user.role === 'user');
    
    for (let i = 0; i < sampleTrips.length; i++) {
      const tripData = { ...sampleTrips[i] };
      tripData.user = regularUsers[i % regularUsers.length]._id;
      
      // Calculate distance
      const geolib = require('geolib');
      tripData.distance = geolib.getDistance(
        { latitude: tripData.startLocation.latitude, longitude: tripData.startLocation.longitude },
        { latitude: tripData.endLocation.latitude, longitude: tripData.endLocation.longitude }
      );
      
      // Calculate duration
      tripData.duration = Math.round((tripData.endTime - tripData.startTime) / (1000 * 60));
      
      // Calculate carbon footprint
      const carbonFactors = {
        walking: 0,
        cycling: 0,
        car: 0.192,
        bus: 0.089,
        train: 0.041,
        metro: 0.041,
        taxi: 0.192,
        rideshare: 0.192,
        plane: 0.255,
        boat: 0.018,
        other: 0.1
      };
      
      const factor = carbonFactors[tripData.modeOfTransport] || 0.1;
      tripData.carbonFootprint = (tripData.distance / 1000) * factor;
      
      tripData.isCompleted = true;
      
      const trip = new Trip(tripData);
      await trip.save();
      trips.push(trip);
      console.log(`Created trip: ${trip.tripId}`);
    }

    return trips;
  } catch (error) {
    console.error('Error seeding trips:', error);
    throw error;
  }
};

const seedAnalytics = async (users) => {
  try {
    // Clear existing analytics
    await Analytics.deleteMany({});
    console.log('Cleared existing analytics');

    // Generate analytics for each user
    for (const user of users) {
      if (user.role === 'user') {
        try {
          const analytics = await Analytics.generateUserAnalytics(user._id, 'daily', new Date());
          if (analytics) {
            await analytics.save();
            console.log(`Generated analytics for user: ${user.email}`);
          }
        } catch (error) {
          console.error(`Error generating analytics for user ${user.email}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Error seeding analytics:', error);
    throw error;
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('Starting database seeding...');
    
    const users = await seedUsers();
    const trips = await seedTrips(users);
    await seedAnalytics(users);
    
    console.log('Database seeding completed successfully!');
    console.log(`Created ${users.length} users`);
    console.log(`Created ${trips.length} trips`);
    
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, seedUsers, seedTrips, seedAnalytics };
