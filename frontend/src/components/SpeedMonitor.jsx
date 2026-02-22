import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box, Typography, Paper, Grid, Avatar, LinearProgress, Alert,
  Snackbar, List, ListItem, ListItemText, Divider, Chip, Tooltip, IconButton
} from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import HistoryIcon from '@mui/icons-material/History';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { keyframes } from '@mui/system';

// Animation for speeding alerts
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const SpeedMonitor = ({ vehicles = [] }) => {
  const [speedData, setSpeedData] = useState(vehicles);
  const [breachHistory, setBreachHistory] = useState([]);
  const [activeAlert, setActiveAlert] = useState({ open: false, data: null });

  // 1. Optimized Data Fetching
  const updateVehicleStats = useCallback(async () => {
    try {
      const response = await fetch('/api/vehicle-data');
      const newData = await response.json();
      
      setSpeedData(newData);

      // Identify new breaches this tick
      const newBreaches = newData
        .filter(v => v.currentSpeed > v.maxSpeed)
        .map(v => ({
          ...v,
          timestamp: new Date().toLocaleTimeString(),
          id: `${v.id}-${Date.now()}`
        }));

      if (newBreaches.length > 0) {
        setBreachHistory(prev => [...newBreaches, ...prev].slice(0, 50));
        // Only trigger snackbar for the most severe/recent one
        setActiveAlert({ open: true, data: newBreaches[0] });
      }
    } catch (err) {
      console.error("Failed to sync vehicle data", err);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(updateVehicleStats, 3000);
    return () => clearInterval(timer);
  }, [updateVehicleStats]);

  // 2. Helper Logic
  const getStatus = (speed, max) => {
    if (speed > max) return { color: 'error', label: 'CRITICAL' };
    if (speed > max * 0.85) return { color: 'warning', label: 'WARNING' };
    return { color: 'success', label: 'NORMAL' };
  };

  const stats = useMemo(() => ({
    total: speedData.length,
    overspeeding: speedData.filter(v => v.currentSpeed > v.maxSpeed).length
  }), [speedData]);

  return (
<<<<<<< HEAD
    <Box sx={{ p: 3 }}>
    <Typography variant="h4" fontWeight="900" color="error">
  Fleet Speed Command
</Typography>


      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Current Speeds Section */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" gutterBottom>
            Current Speeds
=======
    <Box sx={{ p: 4, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="800" color="primary.dark">
            Fleet Speed Command
>>>>>>> origin/speed-monitor
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time telemetry monitoring for {stats.total} active units
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Chip icon={<SpeedIcon />} label={`Live Units: ${stats.total}`} variant="outlined" />
          <Chip 
            label={`Violations: ${stats.overspeeding}`} 
            color={stats.overspeeding > 0 ? "error" : "success"} 
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Main Monitoring Grid */}
        <Grid item xs={12} lg={8}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <SpeedIcon color="primary" /> Live Telemetry
          </Typography>
          <Grid container spacing={2}>
            {speedData.map((vehicle) => {
              const { color, label } = getStatus(vehicle.currentSpeed, vehicle.maxSpeed);
              const isSpeeding = color === 'error';

              return (
                <Grid item xs={12} sm={6} key={vehicle.id}>
                  <Paper 
                    elevation={isSpeeding ? 6 : 1}
                    sx={{ 
                      p: 2, 
                      borderRadius: 3,
                      borderLeft: 6,
                      borderColor: `${color}.main`,
                      animation: isSpeeding ? `${pulse} 2s infinite` : 'none'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: `${color}.light`, width: 40, height: 40 }}>
                          <SpeedIcon sx={{ color: `${color}.dark` }} />
                        </Avatar>
                        <Typography variant="subtitle1" fontWeight="700">
                          {vehicle.vehicleNumber}
                        </Typography>
                      </Box>
                      <Chip label={label} size="small" color={color} variant="soft" />
                    </Box>

                    <Box sx={{ textAlign: 'center', mb: 1 }}>
                      <Typography variant="h3" fontWeight="bold" color={`${color}.main`}>
                        {vehicle.currentSpeed}
                        <Typography component="span" variant="h6" color="text.secondary" sx={{ ml: 1 }}>
                          km/h
                        </Typography>
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Threshold Limit: {vehicle.maxSpeed} km/h
                      </Typography>
                    </Box>

                    <Tooltip title={`${Math.round((vehicle.currentSpeed / vehicle.maxSpeed) * 100)}% of limit`}>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min(100, (vehicle.currentSpeed / vehicle.maxSpeed) * 100)}
                        color={color}
                        sx={{ height: 10, borderRadius: 5, mt: 2 }}
                      />
                    </Tooltip>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Grid>

        {/* Sidebar: Breach History */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 2, borderRadius: 3, height: '100%', minHeight: 500 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <HistoryIcon /> Incident Log
              </Typography>
              <IconButton size="small" onClick={() => setBreachHistory([])}>
                <ClearAllIcon />
              </IconButton>
            </Box>
            <Divider />
            <List sx={{ maxHeight: 600, overflow: 'auto' }}>
              {breachHistory.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 10, color: 'text.secondary' }}>
                  <Typography variant="body2">No recent violations detected</Typography>
                </Box>
              ) : (
                breachHistory.map((incident) => (
                  <ListItem key={incident.id} alignItems="flex-start" sx={{ mb: 1, bgcolor: 'error.light', borderRadius: 2, opacity: 0.9 }}>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight="bold" color="error.dark">
                          Violation: {incident.vehicleNumber}
                        </Typography>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography component="span" variant="body2" color="text.primary">
                            {incident.speed} km/h
                          </Typography>
                          {` — Recorded at ${incident.timestamp}`}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Snackbar Alert */}
      <Snackbar
        open={activeAlert.open}
        autoHideDuration={4000}
        onClose={() => setActiveAlert({ ...activeAlert, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert severity="error" variant="filled" sx={{ width: '100%', borderRadius: 2 }}>
          {activeAlert.data && (
            <Box>
              <Typography variant="subtitle2">IMMEDIATE ACTION REQUIRED</Typography>
              <Typography variant="body2">
                Unit {activeAlert.data.vehicleNumber} is traveling at {activeAlert.data.speed} km/h!
              </Typography>
            </Box>
          )}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SpeedMonitor;