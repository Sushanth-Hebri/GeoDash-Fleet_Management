import React, { useState, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Container,
  Grid,
  Paper,
  CssBaseline,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  FaTruckMoving,
  FaUsers,
  FaShieldAlt,
  FaMapMarkedAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaChartLine,
  FaCogs,
  FaHandshake,
  FaQuoteLeft,
  FaQuoteRight,
} from "react-icons/fa";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";

// Images
const heroBackground = "https://plus.unsplash.com/premium_photo-1733259739350-d30a39452c9a?q=80&w=2070&auto=format&fit=crop";
const customerImage = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop";
const driverImage = "https://images.unsplash.com/photo-1626397859727-6d15fb78d8ec?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const ownerImage = "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

// Animated Component
const AnimatedBox = ({ children, variants, style }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true });

  React.useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div ref={ref} initial="hidden" animate={controls} variants={variants} style={style}>
      {children}
    </motion.div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [role, setRole] = useState("driver"); // For role selection
  const chooseRoleRef = useRef(null); // Ref for "Choose Your Role" section
  const [isHovered, setIsHovered] = useState(false); // For carousel hover state
  const carouselRef = useRef(null); // Ref for carousel

  // Handle drawer toggle
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Handle role change
  const handleRoleChange = (event, newRole) => {
    setRole(newRole);
  };

  // Scroll to "Choose Your Role" section
  const scrollToChooseRole = () => {
    if (chooseRoleRef.current) {
      chooseRoleRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Carousel auto-scroll
  React.useEffect(() => {
    const carousel = carouselRef.current;
    let animationFrameId;

    const scrollCarousel = () => {
      if (!isHovered && carousel) {
        carousel.scrollLeft += 1; // Adjust scroll speed
        if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth) {
          carousel.scrollLeft = 0; // Reset to start
        }
      }
      animationFrameId = requestAnimationFrame(scrollCarousel);
    };

    animationFrameId = requestAnimationFrame(scrollCarousel);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  // Menu items
  const menuItems = ["Home", "Features", "Pricing", "Testimonials", "Contact"];

  // Testimonials data
  const testimonials = [
    {
      image: customerImage,
      name: "John Doe",
      role: "Fleet Manager",
      company: "LogiCorp",
      quote: "FleetTracker has transformed how we manage our vehicles. The real-time tracking is a game-changer!",
    },
    {
      image: customerImage,
      name: "Jane Smith",
      role: "Logistics Coordinator",
      company: "Transit Solutions",
      quote: "The analytics dashboard is incredibly intuitive. It’s helped us reduce costs significantly.",
    },
    {
      image: customerImage,
      name: "Michael Johnson",
      role: "Operations Director",
      company: "Global Freight",
      quote: "The safety features have given us peace of mind. Our drivers feel more secure on the road.",
    },
    {
      image: customerImage,
      name: "Emily Davis",
      role: "Transport Supervisor",
      company: "QuickMove Logistics",
      quote: "Route optimization has saved us hours of planning and reduced fuel costs by 20%.",
    },
    {
      image: customerImage,
      name: "David Wilson",
      role: "Fleet Owner",
      company: "City Cargo",
      quote: "FleetTracker is the best investment we’ve made. It’s streamlined our entire operation.",
    },
  ];

  return (
    <>
      <CssBaseline />

      {/* Navbar */}
      <AppBar position="sticky" sx={{ bgcolor: "white", color: "black", boxShadow: 2 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            Fleetera
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
          <Button
            variant="contained"
            sx={{ bgcolor: "#007bff", color: "white", display: { xs: "none", md: "block" } }}
            onClick={() => navigate("/choosetherole")}
          >
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
              <Button
                variant="contained"
                fullWidth
                sx={{ bgcolor: "#007bff", color: "white" }}
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Hero Section */}
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
          <AnimatedBox variants={fadeInUp}>
            <Typography variant="h2" fontWeight="bold" sx={{ fontSize: { xs: "2.5rem", md: "4rem" } }}>
              Revolutionize Your Fleet Management
            </Typography>
            <Typography variant="h5" mt={2} sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" } }}>
              From real-time tracking to predictive analytics, we empower your business to thrive.
            </Typography>
            <Box mt={4}>
              <Button
                variant="contained"
                size="large"
                sx={{ mx: 1, bgcolor: "#007bff" }}
                onClick={scrollToChooseRole}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{ mx: 1, borderColor: "#007bff", color: "#007bff" }}
                onClick={() => navigate("/learnmore")}
              >
                Learn More
              </Button>
            </Box>
          </AnimatedBox>
        </Container>
      </Box>

      {/* Choose Your Role Section */}
      <Container ref={chooseRoleRef} sx={{ mt: 8, textAlign: "center", scrollMarginTop: "68px" }}>
        <AnimatedBox variants={fadeIn}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Choose Your Role
          </Typography>
          <Typography variant="body1" mt={2}>
            Select your role to get started with FleetTracker.
          </Typography>
        </AnimatedBox>
        <Tabs
          value={role}
          onChange={handleRoleChange}
          centered
          sx={{ mt: 4 }}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Driver" value="driver" />
          <Tab label="Owner" value="owner" />
        </Tabs>
        <Box mt={4}>
          {role === "driver" ? (
            <Card sx={{ maxWidth: 600, mx: "auto" }}>
              <CardMedia component="img" height="300" image={driverImage} alt="Driver" />
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  Driver Login
                </Typography>
                <Typography variant="body2" mt={1}>
                  Access real-time routes, schedules, and updates.
                </Typography>
                <Button variant="contained" sx={{ mt: 2, bgcolor: "#007bff" }}>
                  Login as Driver
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card sx={{ maxWidth: 600, mx: "auto" }}>
              <CardMedia component="img" height="300" image={ownerImage} alt="Owner" />
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  Owner Login
                </Typography>
                <Typography variant="body2" mt={1}>
                  Manage your fleet, track performance, and optimize operations.
                </Typography>
                <Button variant="contained" sx={{ mt: 2, bgcolor: "#007bff" }}>
                  Login as Owner
                </Button>
              </CardContent>
            </Card>
          )}
        </Box>
      </Container>

      {/* What We Solve Section */}
      <Container sx={{ mt: 8, textAlign: "center" }}>
        <AnimatedBox variants={fadeIn}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            What We Solve
          </Typography>
          <Typography variant="body1" mt={2}>
            As a tech-driven SaaS company, we address the following challenges:
          </Typography>
        </AnimatedBox>
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8f9fa" }}>Challenges Faced by Customers</TableCell>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8f9fa" }}>How We Solve Them</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                {
                  challenge: "Inefficient Route Planning",
                  solution: "AI-powered route optimization to reduce fuel costs and delivery times.",
                },
                {
                  challenge: "Lack of Real-Time Visibility",
                  solution: "Live GPS tracking for real-time fleet monitoring.",
                },
                {
                  challenge: "High Operational Costs",
                  solution: "Predictive analytics to identify cost-saving opportunities.",
                },
                {
                  challenge: "Driver Safety Concerns",
                  solution: "Advanced safety features like fatigue detection and emergency alerts.",
                },
                {
                  challenge: "Poor Fleet Utilization",
                  solution: "Data-driven insights to maximize fleet efficiency.",
                },
              ].map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.challenge}</TableCell>
                  <TableCell>{row.solution}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Customer Experience Section */}
      <Box sx={{ bgcolor: "#f8f9fa", py: 8, mt: 8 }}>
        <Container>
          <AnimatedBox variants={fadeIn}>
            <Typography variant="h4" fontWeight="bold" color="primary" textAlign="center">
              What Our Customers Say
            </Typography>
          </AnimatedBox>
          {/* Carousel Container */}
          <Box
            ref={carouselRef}
            sx={{
              display: "flex",
              overflowX: "hidden",
              gap: 4,
              mt: 4,
              scrollBehavior: "smooth",
              "&:hover": {
                overflowX: "auto", // Show scrollbar on hover
              },
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                sx={{
                  minWidth: 300,
                  maxWidth: 350,
                  p: 3,
                  textAlign: "center",
                  bgcolor: "white",
                  borderRadius: 2,
                  boxShadow: 3,
                  flexShrink: 0, // Prevent cards from shrinking
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  <FaQuoteLeft size={24} color="#007bff" />
                </Box>
                <Typography variant="body1" sx={{ fontStyle: "italic", mb: 2 }}>
                  "{testimonial.quote}"
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  <FaQuoteRight size={24} color="#007bff" />
                </Box>
                <Avatar src={testimonial.image} sx={{ width: 80, height: 80, mx: "auto", mb: 2 }} />
                <Typography variant="h6" fontWeight="bold">
                  {testimonial.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {testimonial.role}, {testimonial.company}
                </Typography>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "#343a40", color: "white", mt: 8, py: 5 }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <AnimatedBox variants={fadeIn}>
                <Typography variant="h6" fontWeight="bold">
                  Fleetera
                </Typography>
                <Typography variant="body2" mt={1}>
                  Smart Fleet Management for seamless tracking & optimization.
                </Typography>
              </AnimatedBox>
            </Grid>
            <Grid item xs={12} sm={4}>
              <AnimatedBox variants={fadeIn}>
                <Typography variant="h6" fontWeight="bold">
                  Quick Links
                </Typography>
                {["Features", "Pricing", "Contact", "FAQs"].map((item) => (
                  <Typography key={item} variant="body2" mt={1}>
                    {item}
                  </Typography>
                ))}
              </AnimatedBox>
            </Grid>
            <Grid item xs={12} sm={4}>
              <AnimatedBox variants={fadeIn}>
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
              </AnimatedBox>
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