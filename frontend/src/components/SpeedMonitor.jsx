import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  LinearProgress,
  Alert,
  Snackbar,
  Chip,
  Divider,
  CircularProgress
} from "@mui/material";
import SpeedIcon from "@mui/icons-material/Speed";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

const POLL_INTERVAL = 3000;
const BREACH_COOLDOWN = 10000; // 10 sec per vehicle

const SpeedMonitor = ({ vehicles = [] }) => {
  const [speedData, setSpeedData] = useState(vehicles);
  const [breachHistory, setBreachHistory] = useState([]);
  const [alertQueue, setAlertQueue] = useState([]);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const lastBreachRef = useRef({});

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const response = await fetch("/api/vehicle-data", {
          signal: controller.signal
        });

        if (!response.ok) throw new Error("Failed to fetch vehicle data");

        const data = await response.json();
        if (!isMounted) return;

        setSpeedData(data);
        setLoading(false);
        detectBreaches(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Unable to fetch vehicle data.");
          setLoading(false);
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, POLL_INTERVAL);

    return () => {
      isMounted = false;
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  const detectBreaches = (data) => {
    const now = Date.now();

    data.forEach((vehicle) => {
      if (vehicle.currentSpeed > vehicle.maxSpeed) {
        const lastTime = lastBreachRef.current[vehicle.id] || 0;

        if (now - lastTime > BREACH_COOLDOWN) {
          const breach = {
            id: now,
            vehicleId: vehicle.id,
            vehicleNumber: vehicle.vehicleNumber,
            speed: vehicle.currentSpeed,
            maxSpeed: vehicle.maxSpeed,
            timestamp: new Date().toLocaleTimeString()
          };

          lastBreachRef.current[vehicle.id] = now;

          setBreachHistory((prev) => [breach, ...prev.slice(0, 19)]);
          setAlertQueue((prev) => [...prev, breach]);
        }
      }
    });
  };

  useEffect(() => {
    if (!openAlert && alertQueue.length > 0) {
      setCurrentAlert(alertQueue[0]);
      setAlertQueue((prev) => prev.slice(1));
      setOpenAlert(true);
    }
  }, [alertQueue, openAlert]);

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const getSpeedColor = (speed, maxSpeed) => {
    if (speed > maxSpeed) return "error";
    if (speed > maxSpeed * 0.9) return "warning";
    return "success";
  };

  const getSpeedPercentage = (speed, maxSpeed) =>
    Math.min(100, (speed / maxSpeed) * 100);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Speed Monitor
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <Grid container spacing={3}>
          {/* Live Speed Cards */}
          {speedData.map((vehicle) => (
            <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                    <SpeedIcon />
                  </Avatar>
                  <Typography variant="subtitle1">
                    {vehicle.vehicleNumber}
                  </Typography>
                </Box>

                <Typography
                  variant="h5"
                  color={getSpeedColor(
                    vehicle.currentSpeed,
                    vehicle.maxSpeed
                  )}
                >
                  {vehicle.currentSpeed} km/h
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Max: {vehicle.maxSpeed} km/h
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={getSpeedPercentage(
                    vehicle.currentSpeed,
                    vehicle.maxSpeed
                  )}
                  color={getSpeedColor(
                    vehicle.currentSpeed,
                    vehicle.maxSpeed
                  )}
                  sx={{ height: 10, borderRadius: 5, mt: 2 }}
                />
              </Paper>
            </Grid>
          ))}

          {/* Breach History Panel */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Speed Breaches
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {breachHistory.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No breaches detected.
                </Typography>
              )}

              {breachHistory.map((breach) => (
                <Box
                  key={breach.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1
                  }}
                >
                  <Typography variant="body2">
                    {breach.vehicleNumber} - {breach.speed} km/h
                  </Typography>
                  <Chip
                    label={breach.timestamp}
                    color="error"
                    size="small"
                  />
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Alert Snackbar */}
      <Snackbar
        open={openAlert}
        autoHideDuration={5000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity="error"
          icon={<NotificationsActiveIcon fontSize="inherit" />}
          sx={{ width: "100%" }}
        >
          {currentAlert && (
            <>
              <Typography variant="subtitle2">
                Speed Limit Exceeded!
              </Typography>
              <Typography variant="body2">
                {currentAlert.vehicleNumber} at{" "}
                {currentAlert.speed} km/h
              </Typography>
            </>
          )}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SpeedMonitor;
