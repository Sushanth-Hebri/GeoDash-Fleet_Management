# 🏗️ Architecture & Implementation Guide

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT SIDE (React)                     │
├─────────────────────────────────────────────────────────────┤
│  Dashboard.tsx (Main Component)                             │
│  ├── Map Container (Leaflet)                               │
│  ├── Alerts Panel (Right Drawer)                           │
│  ├── Dashboard Stats                                        │
│  └── Navigation (Sidebar + Top Bar)                        │
└──────────────┬──────────────────────────────────────────────┘
               │
         WebSocket (Socket.io)
               │
┌──────────────▼──────────────────────────────────────────────┐
│                    SERVER SIDE (Node.js)                    │
├─────────────────────────────────────────────────────────────┤
│  server.js (Express + Socket.io)                            │
│  ├── Real-time Location Broadcasting                        │
│  ├── Authentication (JWT)                                   │
│  └── Database Connection (MongoDB)                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 Frontend Architecture

### State Management

**Dashboard Component State**
```typescript
// User Interface States
- showAlertsPanel: boolean          // Alerts drawer visibility
- selectedAlert: Alert | null       // Currently viewed alert
- darkMode: boolean                 // Theme toggle
- mobileOpen: boolean               // Mobile menu toggle

// Data States
- drivers: Driver[]                 // Active drivers
- alerts: Alert[]                   // Active alerts
- isLive: boolean                   // WebSocket connection status

// UI Filter States
- search: string                    // Search query
- timeFilter: "today" | "all"       // Time-based filtering
- selectedFleet: string             // Fleet selector
- activeView: ViewType              // Active navigation view
```

### Component Hierarchy

```
Dashboard (Main)
├── AppBar
│   ├── Live Status Indicator (🟢)
│   ├── Time Filter (📅)
│   ├── Fleet Dropdown (🚚)
│   ├── Alerts Badge (🔔)
│   └── Search + User Menu
│
├── Drawer (Left Navigation)
│   ├── Menu Items
│   └── Dark Mode Toggle
│
├── Main Content Area
│   ├── Map (Leaflet)
│   ├── Stats Cards
│   ├── Vehicle DataGrid
│   └── Dynamic Views (Reports, Radar, etc.)
│
├── Alerts Panel (Right Drawer)
│   └── List of Alerts with Details
│
└── Alert Details Panel (Right Drawer)
    ├── Vehicle Info
    ├── Driver Info
    ├── Contact Options
    └── Location Details
```

### Key Interfaces

```typescript
// Driver Interface
interface Driver {
  userId: string;
  name: string;
  lat: number;
  lng: number;
}

// Alert Interface
interface Alert {
  id: string;
  vehicleNumber: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverEmail: string;
  alertType: "overspeed" | "harsh_braking" | "harsh_acceleration" | "geofence" | "maintenance";
  severity: "critical" | "warning" | "info";
  message: string;
  timestamp: Date;
  lat: number;
  lng: number;
}
```

---

## 🔌 WebSocket Implementation

### Connection Setup

**Frontend (client)**
```javascript
const socket = io("https://location-track-testing.onrender.com", {
  transports: ["polling"],  // Fallback to polling
});

// Listen for location updates
socket.on('locationUpdate', (data) => {
  setDrivers(data.map(driver => ({
    userId: driver.userId,
    name: driver.name,
    lat: driver.lat,
    lng: driver.lng
  })));
  setIsLive(true);
});

// Monitor connection status
socket.on('connect', () => setIsLive(true));
socket.on('disconnect', () => setIsLive(false));
```

**Backend (server)**
```javascript
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('updateLocation', (location) => {
    // Broadcast to all connected clients
    io.emit('locationUpdate', location);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
```

### Event Flow

```
Driver Location Update
    ↓
Socket emits 'updateLocation'
    ↓
Server receives location
    ↓
Server broadcasts 'locationUpdate' to all clients
    ↓
React state updates
    ↓
Map markers re-render
    ↓
Leaflet updates map display
```

---

## 🗺️ Leaflet Map Integration

### Map Initialization

```typescript
// Initialize map instance
mapInstance.current = L.map(mapRef.current, {
  center: [20.5937, 78.9629],  // India center
  zoom: 8,
  zoomControl: true,
  maxZoom: 18,
});

// Add tile layer (OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 18,
}).addTo(mapInstance.current);
```

### Marker Management

```typescript
// Create custom car icon
const carIcon = L.icon({
  iconUrl: carIconUrl,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// Add marker for each driver
drivers.forEach((driver) => {
  const marker = L.marker([driver.lat, driver.lng], { icon: carIcon })
    .addTo(mapInstance.current)
    .bindTooltip(driver.userId, {
      permanent: true,
      direction: "right",
      offset: [10, 0],
      className: "driver-label",
    });

  bounds.extend(marker.getLatLng());
});

// Auto-fit all markers in view
if (bounds.isValid()) {
  mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
}
```

### Alert Location Zoom

```typescript
const handleAlertSelect = (alert: Alert) => {
  setSelectedAlert(alert);
  if (mapInstance.current) {
    // Zoom to alert location
    mapInstance.current.setView([alert.lat, alert.lng], 16);
  }
};
```

---

## 🎨 UI/UX Features

### Theme System

**Dark Theme**
```javascript
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },
    secondary: { main: '#f48fb1' },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});
```

**Light Theme**
```javascript
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#f50057' },
  },
});
```

### Top Bar Status Indicators

**Live Status with Pulse Animation**
```typescript
<Chip
  icon={<FiberManualRecordIcon />}
  label={isLive ? "Live" : "Offline"}
  color={isLive ? "success" : "default"}
  sx={{
    fontWeight: 600,
    '& .MuiChip-icon': {
      animation: isLive ? "pulse 1s infinite" : "none",
    },
    '@keyframes pulse': {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 },
    },
  }}
/>
```

### Alert Severity Color Coding

```typescript
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical": return "#ff5252";    // Red
    case "warning": return "#ffa726";     // Orange
    case "info": return "#42a5f5";        // Blue
    default: return "#gray";
  }
};
```

---

## 🔐 Authentication Flow

### JWT Authentication

**Login**
```
User enters credentials
    ↓
POST /api/auth/login
    ↓
Server validates password
    ↓
Server generates JWT token
    ↓
Return token to client
    ↓
Client stores token
    ↓
Client includes token in headers for subsequent requests
```

**Protected Routes**

```javascript
// Backend Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.userId = decoded.userId;
    next();
  });
};
```

---

## 🔄 Data Flow Diagrams

### Location Update Flow

```
Driver App
    │
    ├─ Sends location via socket
    │  {userId, name, lat, lng}
    │
    └─→ Backend Server
         │
         ├─ Receives 'updateLocation' event
         │
         └─→ Broadcasts to all connected clients
             │
             └─→ Frontend Dashboard
                 │
                 ├─ Receives 'locationUpdate'
                 │
                 ├─ Updates drivers state
                 │
                 ├─ Clears old markers
                 │
                 ├─ Adds new markers
                 │
                 └─→ Map re-renders
```

### Alert Management Flow

```
System detects incident
    │
    ├─ Speed > limit
    ├─ Harsh braking detected
    ├─ Geofence boundary crossed
    │
    └─→ Create Alert object
         │
         ├─ Alert stored in state
         │
         ├─ Alert count increased
         │
         ├─ Alert badge updates
         │
         └─→ Alert visible in list
             │
             └─→ User clicks alert
                 │
                 ├─ Alert details panel opens
                 │
                 ├─ Map zooms to location
                 │
                 └─→ Driver info displayed
```

---

## 📊 Performance Considerations

### Optimization Strategies

1. **Map Rendering**
   - Use `useRef` to avoid re-initializing map
   - Clear layers before re-adding markers
   - Use `fitBounds` instead of `setView` for multiple markers

2. **State Management**
   - Only update state when necessary
   - Use `useCallback` for event handlers
   - Debounce search input

3. **WebSocket Efficiency**
   - Broadcast only when location changes significantly
   - Use event filtering to reduce bandwidth
   - Connection pooling on backend

4. **Component Rendering**
   - Lazy load components (Reports, FleetRadar)
   - Memoize expensive components
   - Use key props in lists

---

## 🛠️ Common Development Tasks

### Adding a New Alert Type

1. Update Alert interface:
```typescript
alertType: "overspeed" | "harsh_braking" | ... | "new_type";
```

2. Add to getAlertTypeLabel:
```typescript
case "new_type": return "🎯 New Type";
```

3. Update mock alerts if needed

### Adding a New Dashboard Stat

```typescript
<Card>
  <CardContent>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ mr: 2 }}>
        {/* Icon */}
      </Box>
      <Typography variant="h6">Stat Title</Typography>
    </Box>
    <Typography variant="h3">{statValue}</Typography>
  </CardContent>
</Card>
```

### Connecting Real API

Replace mock alerts:
```typescript
// Instead of mockAlerts, fetch from API
useEffect(() => {
  fetch('/api/alerts')
    .then(res => res.json())
    .then(data => setAlerts(data));
}, []);
```

---

## 🐛 Debugging Tips

### WebSocket Issues
- Check browser console for connection logs
- Verify backend server is running on correct port
- Check CORS configuration in Socket.io

### Map Rendering Issues
- Ensure map container has height: 400px
- Check that Leaflet CSS is imported
- Verify coordinates are valid [lat, lng]

### Alert Not Showing
- Check alert object structure matches interface
- Verify timestamp is Date object
- Ensure severity is valid value

---

## 📚 Resources

- [React Documentation](https://react.dev)
- [Leaflet Documentation](https://leafletjs.com)
- [Socket.io Documentation](https://socket.io)
- [Material-UI Documentation](https://mui.com)
- [Express.js Guide](https://expressjs.com)

---

**Last Updated**: January 8, 2026
