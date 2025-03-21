import React, { useState } from "react";
import { AppBar, Toolbar, Button, Typography, Box, Container, Grid, Paper, Avatar, CssBaseline, IconButton, Drawer, List, ListItem, ListItemText } from "@mui/material";
import { FaTruckMoving, FaUsers, FaShieldAlt, FaMapMarkedAlt, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

// Hero Section Background Image
const heroBackground = "https://plus.unsplash.com/premium_photo-1733259739350-d30a39452c9a?q=80&w=2070&auto=format&fit=crop";

const LandingPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = ["Home", "Features", "Pricing", "Testimonials", "Contact"];

  return (
    <>
      <CssBaseline />

      {/* Navbar */}
      <AppBar position="sticky" sx={{ bgcolor: "white", color: "black", boxShadow: 2 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            FleetTracker
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            {menuItems.map((item) => (
              <Button
  key={item}
  sx={{
    mx: 1,
    color: "black",
    fontWeight: "bold",
    transition: "0.3s",
    position: "relative",
    "&:hover": {
      color: "#007bff",
      "&::after": {
        content: '""',
        position: "absolute",
        left: 0,
        bottom: 0,
        width: "100%",
        height: "2px",
        backgroundColor: "#007bff",
        transition: "0.3s",
      },
    },
  }}
>
  {item}
</Button>
            ))}
          </Box>

          {/* Sign Up Button */}
          <Button variant="contained" sx={{ bgcolor: "#007bff", color: "white", display: { xs: "none", md: "block" } }}>
            Sign Up
          </Button>

          {/* Mobile Menu Toggle */}
          <IconButton sx={{ display: { md: "none" } }} onClick={handleDrawerToggle}>
            <AiOutlineMenu size={24} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Sidebar Menu */}
      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        <Box sx={{ width: 250 }}>
          <IconButton sx={{ display: "block", mx: "auto", mt: 2 }} onClick={handleDrawerToggle}>
            <AiOutlineClose size={24} />
          </IconButton>
          <List>
            {menuItems.map((item) => (
              <ListItem button key={item} onClick={handleDrawerToggle}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
            <ListItem>
              <Button variant="contained" fullWidth sx={{ bgcolor: "#007bff", color: "white" }}>
                Sign Up
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Hero Section (100vh) */}
      <Box
        sx={{
          height: "100vh",
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "white",
          position: "relative",
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.6)",
          },
        }}
      >
        <Container sx={{ zIndex: 2 }}>
          <Typography variant="h3" fontWeight="bold">
            Smart Fleet Management
          </Typography>
          <Typography variant="h6" mt={2}>
            Optimize Your Fleet, Track Vehicles & Improve Efficiency
          </Typography>
          <Box mt={4}>
            <Button variant="contained" size="large" sx={{ mx: 1, bgcolor: "#007bff" }}>
              Driver
            </Button>
            <Button variant="outlined" size="large" sx={{ mx: 1, borderColor: "#007bff", color: "#007bff" }}>
              Owner
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Why Choose Us?
        </Typography>
        <Grid container spacing={4} mt={3}>
          {[
            { icon: <FaTruckMoving size={40} />, title: "Real-Time Tracking", desc: "Monitor your fleet in real-time with GPS accuracy." },
            { icon: <FaUsers size={40} />, title: "User Management", desc: "Manage drivers and owners with ease." },
            { icon: <FaShieldAlt size={40} />, title: "Safety & Security", desc: "Get instant alerts for unauthorized access." },
            { icon: <FaMapMarkedAlt size={40} />, title: "Route Optimization", desc: "Plan and optimize routes for better efficiency." }
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper elevation={4} sx={{ p: 3, textAlign: "center", bgcolor: "#f8f9fa", color: "black" }}>
                {feature.icon}
                <Typography variant="h6" fontWeight="bold" mt={2}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" mt={1}>{feature.desc}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: "#343a40", color: "white", mt: 8, py: 5 }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" fontWeight="bold">
                FleetTracker
              </Typography>
              <Typography variant="body2" mt={1}>
                Smart Fleet Management for seamless tracking & optimization.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" fontWeight="bold">
                Quick Links
              </Typography>
              {["Features", "Pricing", "Contact", "FAQs"].map((item) => (
                <Typography key={item} variant="body2" mt={1}>
                  {item}
                </Typography>
              ))}
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" fontWeight="bold">
                Follow Us
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                <IconButton sx={{ color: "white" }}>
                  <FaFacebook size={20} />
                </IconButton>
                <IconButton sx={{ color: "white" }}>
                  <FaTwitter size={20} />
                </IconButton>
                <IconButton sx={{ color: "white" }}>
                  <FaLinkedin size={20} />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="body2">© 2025 FleetTracker. All Rights Reserved.</Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default LandingPage;
