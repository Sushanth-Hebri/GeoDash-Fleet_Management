import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  LinearProgress,
  Alert,
  Snackbar
} from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const SpeedMonitor = ({ vehicles, onClose }) => {
  const [speedData, setSpeedData] = useState(vehicles);
  const [speedBreaches, setSpeedBreaches] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('/api/vehicle-data')
        .then(response => response.json())
        .then(data => {
          setSpeedData(data);
          data.forEach(vehicle => {
            if (vehicle.currentSpeed > vehicle.maxSpeed) {
              const breach = {
                id: Date.now(),
                vehicleId: vehicle.id,
                vehicleNumber: vehicle.vehicleNumber,
                speed: vehicle.currentSpeed,
                maxSpeed: vehicle.maxSpeed,
                timestamp: new Date().toLocaleTimeString()
              };
              setSpeedBreaches(prev => [breach, ...prev]);
              setCurrentAlert(breach);
              setOpenAlert(true);
            }
          });
        })
        .catch(error => console.error('Error fetching data:', error));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const getSpeedColor = (speed, maxSpeed) => {
    if (speed > maxSpeed) return 'error.main';
    if (speed > maxSpeed * 0.9) return 'warning.main';
    return 'success.main';
  };

  const getSpeedPercentage = (speed, maxSpeed) => {
    return Math.min(100, (speed / maxSpeed) * 100);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Speed Monitor
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Current Speeds Section */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" gutterBottom>
            Current Speeds
          </Typography>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={2}>
              {speedData.map((vehicle) => (
                <Grid item xs={12} sm={6} key={vehicle.id}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        <SpeedIcon />
                      </Avatar>
                      <Typography variant="subtitle1">
                        {vehicle.vehicleNumber}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          color: getSpeedColor(vehicle.currentSpeed, vehicle.maxSpeed),
                          mr: 1
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
                      value={getSpeedPercentage(vehicle.currentSpeed, vehicle.maxSpeed)}
                      sx={{
                        height: 8,
                        borderRadius: 4
                      }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>
      </Box>

      {/* Vehicle Simulation Section */}

      {/* Speed Breach Alert */}
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity="error"
          icon={<NotificationsActiveIcon fontSize="inherit" />}
          sx={{ width: '100%' }}
        >
          {currentAlert && (
            <>
              <Typography variant="subtitle2">Speed Limit Exceeded!</Typography>
              <Typography variant="body2">
                {currentAlert.vehicleNumber} at {currentAlert.speed} km/h
              </Typography>
            </>
          )}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SpeedMonitor;
