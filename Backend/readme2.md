# NATPAC Travel App Backend

A comprehensive backend API for the NATPAC Travel App, designed to collect, analyze, and manage travel data for transportation planning and research.

## Features

### Core Features
- **User Authentication & Management** - JWT-based authentication with role-based access control
- **Trip Logging** - GPS tracking, trip recording, and real-time monitoring
- **Data Analytics** - Comprehensive analytics and insights generation
- **Carbon Footprint Calculation** - Environmental impact tracking
- **Admin Dashboard** - System administration and data management
- **Data Export** - CSV/JSON export capabilities for researchers

### Advanced Features
- **Passive Trip Detection** - Background trip detection using GPS
- **Smart Recommendations** - Personalized travel suggestions
- **Issue Reporting** - Travel problem reporting and tracking
- **Privacy Controls** - GDPR-compliant data handling
- **Real-time Tracking** - Live trip monitoring and updates

## Tech Stack

- **Runtime**: Node.js (v16+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer
- **Geolocation**: Geolib
- **Carbon Calculation**: Custom carbon footprint calculator

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd natpac-travel-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/natpac_travel
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "consent": {
    "dataCollection": true,
    "dataProcessing": true,
    "dataSharing": true
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Trip Management

#### Create Trip
```http
POST /api/trips
Authorization: Bearer <token>
Content-Type: application/json

{
  "startLocation": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "timestamp": "2024-01-01T09:00:00Z"
  },
  "endLocation": {
    "latitude": 40.7589,
    "longitude": -73.9851,
    "timestamp": "2024-01-01T09:30:00Z"
  },
  "startTime": "2024-01-01T09:00:00Z",
  "endTime": "2024-01-01T09:30:00Z",
  "modeOfTransport": "car",
  "purpose": "work",
  "companions": [
    {
      "name": "Jane Doe",
      "relationship": "colleague"
    }
  ]
}
```

#### Get User Trips
```http
GET /api/trips?page=1&limit=20&modeOfTransport=car&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

#### Start Trip (Real-time Tracking)
```http
POST /api/trips/:id/start
Authorization: Bearer <token>
```

#### Add GPS Tracking Point
```http
POST /api/trips/:id/track
Authorization: Bearer <token>
Content-Type: application/json

{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "accuracy": 5,
  "timestamp": "2024-01-01T09:15:00Z"
}
```

#### End Trip
```http
POST /api/trips/:id/end
Authorization: Bearer <token>
Content-Type: application/json

{
  "endLocation": {
    "latitude": 40.7589,
    "longitude": -73.9851
  }
}
```

### Analytics

#### Get Dashboard Data
```http
GET /api/analytics/dashboard?period=monthly&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

#### Get Insights
```http
GET /api/analytics/insights
Authorization: Bearer <token>
```

#### Export Data
```http
GET /api/analytics/export?format=csv&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

### Admin Endpoints

#### Get System Overview
```http
GET /api/admin/dashboard
Authorization: Bearer <admin-token>
```

#### Get All Users
```http
GET /api/admin/users?page=1&limit=20&role=user&isActive=true
Authorization: Bearer <admin-token>
```

#### Export System Data
```http
GET /api/admin/export?type=trips&format=csv&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <admin-token>
```

## Database Schema

### User Model
```javascript
{
  email: String (unique, required),
  password: String (required, hashed),
  firstName: String (required),
  lastName: String (required),
  phone: String (optional),
  role: String (enum: ['user', 'admin', 'analyst']),
  isActive: Boolean (default: true),
  preferences: {
    units: String (enum: ['metric', 'imperial']),
    language: String,
    notifications: {
      email: Boolean,
      push: Boolean
    },
    privacy: {
      shareData: Boolean,
      anonymizeData: Boolean
    }
  },
  consent: {
    dataCollection: Boolean (required),
    dataProcessing: Boolean (required),
    dataSharing: Boolean (required),
    consentDate: Date,
    consentVersion: String
  }
}
```

### Trip Model
```javascript
{
  user: ObjectId (ref: 'User'),
  tripId: String (unique),
  startLocation: {
    latitude: Number (required),
    longitude: Number (required),
    accuracy: Number,
    timestamp: Date (required),
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      formatted: String
    }
  },
  endLocation: { /* same as startLocation */ },
  startTime: Date (required),
  endTime: Date (required),
  duration: Number (minutes),
  distance: Number (meters),
  modeOfTransport: String (enum: ['walking', 'cycling', 'car', ...]),
  purpose: String (enum: ['work', 'education', 'shopping', ...]),
  companions: [{
    name: String,
    relationship: String,
    ageGroup: String,
    gender: String
  }],
  route: [/* GPS tracking points */],
  carbonFootprint: Number (kg CO2),
  isActive: Boolean,
  isCompleted: Boolean,
  isAutoDetected: Boolean,
  issues: [{
    type: String,
    description: String,
    location: Object,
    timestamp: Date,
    photos: [String],
    severity: String,
    status: String
  }]
}
```

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt with salt rounds
- **Rate Limiting** - Prevent brute force attacks
- **CORS Protection** - Cross-origin request security
- **Helmet Security** - HTTP header security
- **Input Validation** - Comprehensive request validation
- **SQL Injection Prevention** - MongoDB ODM protection
- **XSS Protection** - Input sanitization

## Privacy & Compliance

- **GDPR Compliance** - User consent management
- **Data Anonymization** - Optional data anonymization
- **Data Retention** - Configurable data retention policies
- **Right to be Forgotten** - Complete data deletion
- **Data Portability** - Export user data
- **Consent Management** - Granular consent controls

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Deployment

### Environment Variables
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production/test)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRE` - JWT expiration time
- `CORS_ORIGIN` - Allowed CORS origins
- `RATE_LIMIT_WINDOW_MS` - Rate limiting window
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window

### Production Considerations
- Use a reverse proxy (nginx)
- Enable HTTPS
- Set up monitoring and logging
- Configure database backups
- Use environment-specific configurations
- Implement proper error handling
- Set up health checks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please contact the development team or create an issue in the repository.
