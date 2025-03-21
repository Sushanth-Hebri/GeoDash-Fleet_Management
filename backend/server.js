// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const morgan = require("morgan");
// const connectDB = require("./config/db");

// dotenv.config(); // Load environment variables
// connectDB(); // Connect to MongoDB

// const app = express();

// // Middleware
// app.use(express.json()); // JSON body parser
// app.use(cors()); // Enable CORS
// app.use(morgan("dev")); // Log requests

// // Import Routes
// const authRoutes = require("./routes/authRoutes");
// app.use("/api/auth", authRoutes); // Authentication routes

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//_____________________________________________________________________________
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('updateLocation', (location) => {
    console.log('Location received:', location);
    io.emit('locationUpdate', location); // Broadcast to all clients
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(4000, () => {
  console.log('Server running on port 4000');
});
