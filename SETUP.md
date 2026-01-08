# 🚀 Installation & Setup Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher)
  - Download from [nodejs.org](https://nodejs.org)
  - Verify: `node --version`

- **npm** or **yarn** (comes with Node.js)
  - Verify npm: `npm --version`

- **Git** (for cloning repository)
  - Download from [git-scm.com](https://git-scm.com)
  - Verify: `git --version`

- **MongoDB** (optional, for full database features)
  - Download from [mongodb.com](https://mongodb.com)
  - Or use MongoDB Atlas (cloud)

- **Code Editor** (VS Code recommended)
  - Download from [code.visualstudio.com](https://code.visualstudio.com)

---

## 📦 Installation Steps

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/Sushanth-Hebri/Fleet_Management.git

# Navigate to project directory
cd Fleet_Management/fleet-tracker
```

### Step 2: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
touch .env
```

**Edit `backend/.env` file:**
```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fleet_management
# Or local: MONGODB_URI=mongodb://localhost:27017/fleet_management

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Socket.io
SOCKET_PORT=4000
```

**Install Database:**

*Option A: MongoDB Atlas (Cloud)*
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster
4. Get connection string
5. Replace `MONGODB_URI` in `.env`

*Option B: Local MongoDB*
1. Download MongoDB Community from [mongodb.com/try/download](https://mongodb.com/try/download)
2. Install and start service
3. Use connection string: `mongodb://localhost:27017/fleet_management`

### Step 3: Setup Frontend

```bash
# Navigate to project root
cd ../

# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file (if needed)
touch .env
```

**Edit `frontend/.env` file (optional):**
```env
# API Configuration
REACT_APP_API_URL=http://localhost:4000
REACT_APP_SOCKET_URL=http://localhost:4000
REACT_APP_ENV=development

# Analytics (optional)
REACT_APP_PENDO_KEY=your_pendo_key
```

---

## 🎯 Running the Application

### Terminal 1: Start Backend Server

```bash
# Navigate to backend
cd backend

# Start the server
npm start

# Expected output:
# Server running on port 4000
# Socket.io server ready for connections
```

**Backend Endpoints:**
- REST API: `http://localhost:4000`
- Socket.io: `ws://localhost:4000`
- Health Check: `http://localhost:4000/health` (if implemented)

### Terminal 2: Start Frontend Application

```bash
# Navigate to frontend (new terminal)
cd frontend

# Start React development server
npm start

# Browser will automatically open
# If not, visit: http://localhost:3000
```

**Frontend Application:**
- URL: `http://localhost:3000`
- Auto-refresh on file changes
- Hot module reloading enabled

### Verify Setup

**Checklist:**
- [ ] Backend console shows "Server running on port 4000"
- [ ] Frontend browser shows Fleetera dashboard
- [ ] Top bar shows 🟢 Live indicator
- [ ] Map loads with no errors
- [ ] No red errors in browser console

---

## 🐛 Troubleshooting

### Backend Issues

#### Port Already in Use
```bash
# Find process using port 4000
# On Windows PowerShell:
netstat -ano | findstr :4000

# Kill the process (Windows):
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -i :4000
kill -9 <PID>

# Change port in .env or server.js
```

#### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**
1. Check if MongoDB is running
2. Verify connection string in `.env`
3. Check firewall settings
4. Use MongoDB Atlas instead of local

#### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Frontend Issues

#### Port 3000 Already in Use
```bash
# Option 1: Kill the process (same as above)
# Option 2: Run on different port
PORT=3001 npm start

# Windows:
set PORT=3001 && npm start
```

#### Module Not Found
```bash
# Same as backend
rm -rf node_modules package-lock.json
npm install
```

#### WebSocket Connection Failed
1. Ensure backend is running on port 4000
2. Check `REACT_APP_SOCKET_URL` in `.env`
3. Check browser console for exact error
4. Verify CORS settings in backend

#### Map Not Loading
1. Check internet connection (tiles need network)
2. Verify Leaflet CSS is imported in Dashboard.tsx
3. Check browser console for Leaflet errors
4. Clear browser cache and refresh

---

## 🔄 Development Workflow

### Making Changes

**Backend Changes:**
```bash
# Changes auto-reload with nodemon
# Just save the file and it will restart

# Manual restart if needed:
# Stop (Ctrl+C) and run: npm start
```

**Frontend Changes:**
```bash
# Changes auto-reload
# Save file and browser updates automatically
# If not, manually refresh (F5)
```

### Adding Dependencies

**Backend:**
```bash
cd backend
npm install package-name
npm install --save-dev package-name  # For dev dependencies
```

**Frontend:**
```bash
cd frontend
npm install package-name
npm install --save-dev package-name
```

---

## 📝 Environment Variables Reference

### Backend (.env)

```env
# Essential
PORT=4000                           # Server port
NODE_ENV=development                # Environment

# Database
MONGODB_URI=<your_mongodb_url>      # MongoDB connection
DB_NAME=fleet_management            # Database name

# Security
JWT_SECRET=your_secret_key_here     # JWT signing key
JWT_EXPIRE=7d                       # Token expiration

# CORS
CORS_ORIGIN=http://localhost:3000   # Allowed origins

# Socket.io
SOCKET_TRANSPORTS=polling,websocket # Transport methods

# Logging
LOG_LEVEL=debug                     # Log detail level
```

### Frontend (.env)

```env
# API Configuration
REACT_APP_API_URL=http://localhost:4000
REACT_APP_SOCKET_URL=http://localhost:4000

# Environment
REACT_APP_ENV=development

# Analytics (optional)
REACT_APP_PENDO_KEY=your_key

# Features
REACT_APP_ENABLE_DARK_MODE=true
REACT_APP_MAP_CENTER_LAT=20.5937
REACT_APP_MAP_CENTER_LNG=78.9629
```

---

## 🐳 Docker Setup (Optional)

### Build Docker Images

**Backend Dockerfile:**
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:16-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_DATABASE: fleet_management

  backend:
    build: ./backend
    ports:
      - "4000:4000"
    depends_on:
      - mongodb
    environment:
      MONGODB_URI: mongodb://mongodb:27017/fleet_management
      NODE_ENV: development
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
    environment:
      REACT_APP_API_URL: http://localhost:4000
      REACT_APP_SOCKET_URL: http://localhost:4000

volumes:
  mongo-data:
```

**Run with Docker:**
```bash
docker-compose up
```

---

## 📊 Database Setup (MongoDB)

### Collections Structure

```javascript
// Users Collection
db.users.insertOne({
  _id: ObjectId(),
  name: "John Manager",
  email: "john@example.com",
  password: "hashed_password",
  role: "manager",
  createdAt: new Date()
})

// Drivers Collection
db.drivers.insertOne({
  _id: ObjectId(),
  userId: "D001",
  name: "John Doe",
  phone: "+1-555-0101",
  email: "john.doe@example.com",
  licenseNumber: "ABC123",
  createdAt: new Date()
})

// Vehicles Collection
db.vehicles.insertOne({
  _id: ObjectId(),
  vehicleNumber: "TRK-001",
  type: "Heavy Truck",
  status: "Active",
  assignedDriver: "D001",
  createdAt: new Date()
})

// Alerts Collection
db.alerts.insertOne({
  _id: ObjectId(),
  vehicleNumber: "TRK-001",
  alertType: "overspeed",
  severity: "critical",
  message: "Vehicle exceeded speed limit",
  timestamp: new Date(),
  lat: 12.9352,
  lng: 77.6245,
  resolved: false
})
```

### Create Indexes

```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true })

// Drivers
db.drivers.createIndex({ userId: 1 }, { unique: true })

// Vehicles
db.vehicles.createIndex({ vehicleNumber: 1 }, { unique: true })

// Alerts
db.alerts.createIndex({ timestamp: -1 })
db.alerts.createIndex({ vehicleNumber: 1 })
```

---

## 🧪 Testing

### Backend Tests (Coming Soon)

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

---

## 🚀 Deployment

### Deploy Backend

**Heroku:**
```bash
heroku login
heroku create fleetera-backend
git push heroku main
```

**AWS/GCP/Azure:** Use respective CLI tools

### Deploy Frontend

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**Vercel:**
```bash
npm install -g vercel
vercel deploy --prod
```

---

## 📞 Support

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port already in use | Kill process or change port |
| Module not found | Run `npm install` again |
| WebSocket error | Check backend running on 4000 |
| Map not loading | Check internet, refresh page |
| Blank page | Check browser console for errors |

### Getting Help

1. Check [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details
2. Review [FEATURES.md](./FEATURES.md) for feature documentation
3. Check GitHub Issues for known problems
4. Open new issue with error logs

---

## ✅ Checklist

After successful installation:

- [ ] Backend running on port 4000
- [ ] Frontend running on port 3000
- [ ] 🟢 Live indicator shows in top bar
- [ ] Map displays with OpenStreetMap tiles
- [ ] No errors in browser console
- [ ] No errors in terminal
- [ ] Dashboard stats display correctly
- [ ] Alert panel opens/closes smoothly
- [ ] Dark mode toggle works
- [ ] Search functionality works

---

**Last Updated**: January 8, 2026  
**Version**: 1.0.0

> 🎉 Congratulations! Your Fleetera Fleet Management System is ready!
