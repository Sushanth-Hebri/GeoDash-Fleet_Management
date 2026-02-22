import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  LinearProgress,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const SpeedMonitor = ({ vehicles = [], onClose }) => {
  const [speedData, setSpeedData] = useState(vehicles);
  const [speedBreaches, setSpeedBreaches] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(null);

  useEffect(() => {
    const fetchSpeedData = async () => {
      try {
        const response = await fetch('/api/vehicle-data');
        const data = await response.json();
        setSpeedData(data);

        // 1. Filter all breaches in this cycle
        const newBreaches = data
          .filter(vehicle => vehicle.currentSpeed > vehicle.maxSpeed)
          .map(vehicle => ({
            // Use combination of timestamp and ID to guarantee unique keys
            id: `${vehicle.id}-${Date.now()}`,
            vehicleId: vehicle.id,
            vehicleNumber: vehicle.vehicleNumber,
            speed: vehicle.currentSpeed,
            maxSpeed: vehicle.maxSpeed,
            timestamp: new Date().toLocaleTimeString()
          }));

        // 2. Batch update state only if there are breaches
        if (newBreaches.length > 0) {
          // Keep only the 50 most recent breaches to prevent memory leaks
          setSpeedBreaches(prev => [...newBreaches, ...prev].slice(0, 50));
          setCurrentAlert(newBreaches[0]); // Show the most recent one in the snackbar
          setOpenAlert(true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const interval = setInterval(fetchSpeedData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenAlert(false);
  };

  // Refactored to return standard MUI color names
  const getSpeedStatus = (speed, maxSpeed) => {
    if (speed > maxSpeed) return 'error';
    if (speed > maxSpeed * 0.9) return 'warning';
    return 'success';
  };

  const getSpeedPercentage = (speed, maxSpeed) => {
    return Math.min(100, (speed / maxSpeed) * 100);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Speed Monitor
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
        {/* Current Speeds Section */}
        <Box sx={{ flex: 2 }}>
          <Typography variant="h5" gutterBottom>
            Current Speeds
          </Typography>
          <Grid container spacing={2}>
            {speedData.map((vehicle) => {
              const status = getSpeedStatus(vehicle.currentSpeed, vehicle.maxSpeed);

              return (
                <Grid item xs={12} sm={6} key={vehicle.id}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ bgcolor: `${status}.main`, mr: 2 }}>
                        <SpeedIcon />
                      </Avatar>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {vehicle.vehicleNumber}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          color: `${status}.main`,
                          mr: 1,
                          fontWeight: 'bold'
                        }}
                      >
                        {vehicle.currentSpeed}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        km/h (Max: {vehicle.maxSpeed} km/h)
                      </Typography>
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      color={status} // Now dynamically changes to red/yellow/green
                      value={getSpeedPercentage(vehicle.currentSpeed, vehicle.maxSpeed)}
                      sx={{
                        height: 8,
                        borderRadius: 4
                      }}
                    />
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Recent Breaches History Section */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" gutterBottom color="error.main">
            Recent Breaches
          </Typography>
          <Paper elevation={2} sx={{ maxHeight: '600px', overflow: 'auto' }}>
            {speedBreaches.length === 0 ? (
              <Typography variant="body2" sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                No speed breaches detected.
              </Typography>
            ) : (
              <List disablePadding>
                {speedBreaches.map((breach, index) => (
                  <React.Fragment key={breach.id}>
                    <ListItem>
                      <ListItemText
                        primary={`${breach.vehicleNumber} exceeded limit`}
                        secondary={`${breach.speed} km/h (Limit: ${breach.maxSpeed} km/h) at ${breach.timestamp}`}
                        primaryTypographyProps={{ color: 'error', fontWeight: 'medium' }}
                      />
                    </ListItem>
                    {index < speedBreaches.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Box>
      </Box>

      {/* Speed Breach Alert */}
      <Snackbar
        open={openAlert}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity="error"
          onClose={handleCloseAlert}
          icon={<NotificationsActiveIcon fontSize="inherit" />}
          sx={{ width: '100%', boxShadow: 3 }}
        >
          {currentAlert && (
            <>
              <Typography variant="subtitle2">Speed Limit Exceeded!</Typography>
              <Typography variant="body2">
                <strong>{currentAlert.vehicleNumber}</strong> recorded at {currentAlert.speed} km/h
              </Typography>
            </>
          )}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SpeedMonitor;