# NATPAC Travel App Backend - VS Code Setup Guide

## 🚀 Quick Start in VS Code

### Prerequisites
1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** - [Download here](https://www.mongodb.com/try/download/community)
3. **VS Code** with recommended extensions

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Environment Setup
1. Copy the environment file:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/natpac_travel
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:3000
   ```

### Step 3: Start MongoDB
**Option A: Using VS Code Task**
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "Tasks: Run Task"
3. Select "MongoDB: Start"

**Option B: Using Terminal**
```bash
# Windows
mongod

# macOS/Linux
sudo mongod
```

### Step 4: Run the Application

#### Method 1: Using VS Code Debugger
1. Press `F5` or go to Run and Debug panel (`Ctrl+Shift+D`)
2. Select "Start Server" from the dropdown
3. Click the green play button

#### Method 2: Using VS Code Tasks
1. Press `Ctrl+Shift+P`
2. Type "Tasks: Run Task"
3. Select "npm: dev" for development mode

#### Method 3: Using Terminal
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

### Step 5: Seed the Database
```bash
# Using VS Code Task
Ctrl+Shift+P → Tasks: Run Task → npm: seed

# Using Terminal
npm run seed
```

## 🔧 VS Code Features

### Debugging
- **F5** - Start debugging
- **F10** - Step over
- **F11** - Step into
- **Shift+F11** - Step out
- **Ctrl+Shift+F5** - Restart debugging

### Available Debug Configurations
1. **Start Server** - Run the server normally
2. **Debug Server** - Run with debugging enabled
3. **Run Tests** - Execute test suite
4. **Seed Database** - Populate database with sample data

### Tasks Available
- `npm: install` - Install dependencies
- `npm: start` - Start production server
- `npm: dev` - Start development server
- `npm: test` - Run tests
- `npm: seed` - Seed database
- `MongoDB: Start` - Start MongoDB service

## 📁 Project Structure
```
natpac-travel-backend/
├── .vscode/                 # VS Code configuration
│   ├── launch.json         # Debug configurations
│   ├── tasks.json          # Task definitions
│   ├── settings.json       # Workspace settings
│   └── extensions.json     # Recommended extensions
├── config/                 # Configuration files
├── middleware/             # Express middleware
├── models/                 # Database models
├── routes/                 # API routes
├── utils/                  # Utility functions
├── tests/                  # Test files
├── scripts/                # Database scripts
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
└── README.md              # Documentation
```

## 🧪 Testing

### Run Tests
```bash
# Using VS Code Debugger
F5 → Select "Run Tests"

# Using VS Code Task
Ctrl+Shift+P → Tasks: Run Task → npm: test

# Using Terminal
npm test
```

### Test Files
- `tests/auth.test.js` - Authentication tests
- Add more test files as needed

## 📊 API Testing

### Using Thunder Client (Recommended)
1. Install Thunder Client extension in VS Code
2. Open Thunder Client panel
3. Import the API collection (create one with sample requests)

### Using REST Client
1. Install REST Client extension
2. Create `.http` files with API requests
3. Click "Send Request" above each request

### Sample API Requests
```http
### Register User
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "consent": {
    "dataCollection": true,
    "dataProcessing": true,
    "dataSharing": true
  }
}

### Login
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}

### Get User Profile
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE

### Create Trip
POST http://localhost:5000/api/trips
Authorization: Bearer YOUR_TOKEN_HERE
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
  "purpose": "work"
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process using port 5000
   npx kill-port 5000
   ```

2. **MongoDB connection error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify MongoDB service is started

3. **Module not found errors**
   ```bash
   npm install
   ```

4. **Permission errors (macOS/Linux)**
   ```bash
   sudo chown -R $(whoami) ~/.npm
   ```

### Debug Tips
- Use VS Code debugger to set breakpoints
- Check the Debug Console for logs
- Use `console.log()` for debugging
- Check MongoDB Compass for database inspection

## 📝 Development Workflow

1. **Start MongoDB** (if not running)
2. **Start the server** (`F5` or `npm run dev`)
3. **Make changes** to your code
4. **Test changes** using API requests
5. **Run tests** to ensure everything works
6. **Commit changes** to version control

## 🔗 Useful Links

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Documentation](https://jwt.io/)
- [VS Code Node.js Debugging](https://code.visualstudio.com/docs/nodejs/nodejs-debugging)

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the console logs
3. Check the MongoDB connection
4. Verify all dependencies are installed
5. Ensure environment variables are set correctly
