# ⚡ Quick Start Guide

Get Fleetera Fleet Management System running in 5 minutes!

## 🚀 Super Quick Setup

### 1️⃣ Clone & Install (2 minutes)

```bash
# Clone repository
git clone https://github.com/Sushanth-Hebri/Fleet_Management.git
cd Fleet_Management/fleet-tracker

# Install backend
cd backend && npm install && cd ..

# Install frontend
cd frontend && npm install && cd ..
```

### 2️⃣ Configure Environment

**Backend `.env` (backend/.env):**
```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/fleet_management
JWT_SECRET=dev_secret_key_change_in_production
CORS_ORIGIN=http://localhost:3000
```

> 💡 **Tip**: For quick testing, MongoDB is optional. WebSocket will still work.

### 3️⃣ Start Servers (1 minute)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

Expected: `Server running on port 4000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Expected: Browser opens `http://localhost:3000` with dashboard

### 4️⃣ You're Live! 🎉

- ✅ Dashboard displays live map
- ✅ Top bar shows 🟢 Live indicator
- ✅ Stats cards show vehicle count
- ✅ Alerts panel ready to use
- ✅ Dark mode available

---

## 📱 First Test Run

### 1. Explore Dashboard
- [ ] View the interactive map
- [ ] See vehicle markers
- [ ] Check stats cards

### 2. Test Alerts
- [ ] Click 🔔 badge in top bar
- [ ] See sample alerts list
- [ ] Click any alert
- [ ] Map zooms to location
- [ ] See driver info panel

### 3. Try Features
- [ ] Toggle dark mode (bottom of sidebar)
- [ ] Change time filter (📅 Today)
- [ ] Select fleet (🚚 All Fleets)
- [ ] Search vehicles

### 4. Navigation
- [ ] Click "Fleet Radar" from sidebar
- [ ] Click "Speed Monitor"
- [ ] Click "Reports"
- [ ] Click "Geo trigger"

---

## 🗂️ File Structure Overview

```
fleet-tracker/
├── README.md              ← Start here
├── SETUP.md               ← Detailed setup
├── ARCHITECTURE.md        ← Technical details
├── FEATURES.md            ← Feature documentation
├── QUICKSTART.md          ← This file
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   └── Dashboard.tsx   ← Main component
│   │   ├── components/
│   │   └── App.tsx
│   └── package.json
│
└── backend/
    ├── server.js          ← Express + Socket.io
    ├── routes/
    ├── models/
    └── package.json
```

---

## 🎮 Usage Examples

### View Live Vehicles

```
1. Open http://localhost:3000
2. Map loads automatically
3. See all vehicles as markers
4. Zoom/pan with mouse
5. Click marker for tooltip
```

### Open Alerts

```
1. Click 🔔 badge (shows "3" alerts)
2. Right panel opens
3. Lists all active alerts
4. Click any alert
5. Details panel opens
6. Map zooms to location
```

### Contact a Driver

```
1. Open alert details
2. Scroll to "📞 Contact Driver"
3. Click phone number → Opens phone app
4. Click email → Opens email app
5. Click "Call Driver Now" → Dials directly
```

### Change Theme

```
1. Open sidebar (left edge)
2. Scroll to bottom
3. Toggle "Dark Mode"
4. Theme switches instantly
5. Persists on page reload
```

---

## 🔧 Common Commands

### Backend

```bash
cd backend

# Start server
npm start

# Install new package
npm install package-name

# Check Node version
node --version

# Check npm version
npm --version
```

### Frontend

```bash
cd frontend

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Check syntax
npm run lint
```

---

## 🆘 Quick Troubleshooting

| Problem | Quick Fix |
|---------|-----------|
| Port 4000 in use | `npm start` will ask to use different port, press `Y` |
| Map blank | Check internet connection, refresh browser |
| No 🟢 Live indicator | Check backend is running, check console |
| Alerts don't show | Ensure you have sample data loaded |
| Can't connect to backend | Ensure backend on 4000, check CORS in .env |

---

## 📚 Documentation Map

- **README.md** - Project overview & features
- **SETUP.md** - Detailed installation guide
- **ARCHITECTURE.md** - Technical architecture
- **FEATURES.md** - Feature documentation
- **QUICKSTART.md** - This file

---

## 🎯 Next Steps

### After Getting It Running

1. **Explore Code**
   - Check `Dashboard.tsx` (main component)
   - Review `server.js` (backend setup)
   - Understand WebSocket flow

2. **Customize**
   - Change company name (search "Fleetera")
   - Add your vehicle data
   - Customize colors in theme

3. **Add Real Data**
   - Connect to MongoDB
   - Load real driver locations
   - Import vehicle list

4. **Deploy**
   - Deploy backend to Heroku/AWS
   - Deploy frontend to Vercel/Netlify
   - Update API URLs

---

## 🎓 Learning Resources

- **React**: [react.dev](https://react.dev)
- **Leaflet Maps**: [leafletjs.com](https://leafletjs.com)
- **Socket.io**: [socket.io](https://socket.io)
- **Material-UI**: [mui.com](https://mui.com)
- **Express.js**: [expressjs.com](https://expressjs.com)

---

## 🐛 Debug Mode

### Enable Verbose Logging

**Backend:**
```bash
DEBUG=* npm start
```

**Frontend:**
Open browser DevTools: F12 → Console

### Check WebSocket Connection

```javascript
// In browser console
socket.on('connect', () => console.log('Connected!'));
socket.on('disconnect', () => console.log('Disconnected!'));
socket.on('locationUpdate', (data) => console.log('Update:', data));
```

---

## 🚀 Performance Tips

1. **Faster Startup**
   - Clear node_modules: `rm -rf node_modules`
   - Fresh install: `npm install`

2. **Better Experience**
   - Use Chrome/Firefox
   - Close other tabs
   - Disable extensions

3. **Development**
   - Keep browser DevTools closed (uses RAM)
   - Use dark mode (reduces eye strain)
   - Refresh page if UI freezes

---

## 🎉 Success Indicators

You're set up correctly when you see:

✅ Terminal shows "Server running on port 4000"  
✅ Browser opens to dashboard  
✅ Map displays with vehicle markers  
✅ Top bar shows 🟢 Live  
✅ Alerts panel opens when clicked  
✅ No red errors in console  

---

## 📞 Need Help?

1. **Check Logs**
   - Backend console for errors
   - Browser DevTools (F12)
   - Network tab for API errors

2. **Read Documentation**
   - SETUP.md for detailed setup
   - ARCHITECTURE.md for technical info
   - FEATURES.md for feature details

3. **Try Examples**
   - Open existing alert
   - Zoom to location
   - Contact driver

4. **Report Issues**
   - GitHub Issues page
   - Include error messages
   - Include steps to reproduce

---

## 📋 Pre-Deployment Checklist

Before deploying to production:

- [ ] Test all features locally
- [ ] Update API URLs in `.env`
- [ ] Secure JWT secret
- [ ] Configure CORS properly
- [ ] Set up MongoDB Atlas
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Enable logging
- [ ] Test on mobile
- [ ] Performance test

---

## 🎊 Congratulations!

You've successfully set up Fleetera! 

### Now you can:
✨ Track vehicles in real-time  
🔔 Manage alerts and incidents  
📊 View fleet analytics  
👥 Contact drivers instantly  
🎨 Customize with dark mode  

**Happy fleet managing! 🚚**

---

**Quick Reference:**

```bash
# Start development
cd backend && npm start      # Terminal 1
cd frontend && npm start     # Terminal 2

# Open dashboard
http://localhost:3000

# Stop servers
Ctrl + C (in both terminals)
```

---

Last Updated: January 8, 2026  
Version: 1.0.0  
Status: Production Ready ✅
