import React from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Container,
  IconButton,
  Grid, // Import Grid component
} from "@mui/material";
import { FaFacebook, FaTwitter, FaLinkedin, FaTruckMoving, FaChartLine, FaShieldAlt } from "react-icons/fa";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom"; // For navigation

const LearnMore = () => {
  const navigate = useNavigate(); // Hook for navigation

  // Function to handle back button click
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <>
      {/* Navbar */}
      <AppBar position="sticky" sx={{ bgcolor: "white", color: "black", boxShadow: 2 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Back Button */}
          <IconButton onClick={handleBack} sx={{ color: "black" }}>
            <AiOutlineArrowLeft size={24} />
          </IconButton>

          {/* Brand Name */}
          <Typography variant="h6" fontWeight="bold" color="primary">
            Fleetera
          </Typography>

          {/* Empty Box to balance the layout */}
          <Box sx={{ width: 24 }} /> {/* Adjust width to match the back button */}
        </Toolbar>
      </AppBar>

      {/* Learn More Content */}
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
          Learn More About Fleetera
        </Typography>

        {/* Section 1: What We Offer */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            What We Offer
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: "800px", mx: "auto" }}>
            Fleetera is a cutting-edge fleet management solution designed to help businesses optimize their operations, reduce costs, and improve efficiency. Our platform offers real-time tracking, predictive analytics, and advanced safety features to ensure your fleet is always running at its best.
          </Typography>
        </Box>

        {/* Section 2: Key Features */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            Key Features
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {[
              {
                icon: <FaTruckMoving size={40} />,
                title: "Real-Time Tracking",
                description: "Monitor your fleet in real-time with GPS accuracy.",
              },
              {
                icon: <FaChartLine size={40} />,
                title: "Predictive Analytics",
                description: "Get insights to optimize routes and reduce costs.",
              },
              {
                icon: <FaShieldAlt size={40} />,
                title: "Safety Features",
                description: "Advanced safety tools to protect your drivers and assets.",
              },
            ].map((feature, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Box sx={{ textAlign: "center" }}>
                  {feature.icon}
                  <Typography variant="h6" fontWeight="bold" mt={2}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Section 3: Why Choose Us? */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            Why Choose Us?
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: "800px", mx: "auto" }}>
            Fleetera is trusted by businesses worldwide for its reliability, scalability, and ease of use. Our platform is designed to grow with your business, offering customizable features and 24/7 support to ensure your success.
          </Typography>
        </Box>

        {/* Section 4: Testimonials */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            What Our Customers Say
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {[
              {
                name: "John Doe",
                role: "Fleet Manager",
                quote: "Fleetera has transformed how we manage our vehicles. The real-time tracking is a game-changer!",
              },
              {
                name: "Jane Smith",
                role: "Logistics Coordinator",
                quote: "The analytics dashboard is incredibly intuitive. It’s helped us reduce costs significantly.",
              },
            ].map((testimonial, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{ p: 3, textAlign: "center", bgcolor: "#f8f9fa", borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {testimonial.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {testimonial.role}
                  </Typography>
                  <Typography variant="body1" mt={2} sx={{ fontStyle: "italic" }}>
                    "{testimonial.quote}"
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Section 5: Call to Action */}
        <Box sx={{ mt: 6, mb: 6 }}>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            Ready to Get Started?
          </Typography>
          <Button variant="contained" size="large" sx={{ bgcolor: "#007bff", mt: 2 }}>
            Sign Up Now
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: "#343a40", color: "white", mt: 8, py: 5 }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" fontWeight="bold">
                Fleetera
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
            <Typography variant="body2">© 2025 Fleetera. All Rights Reserved.</Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default LearnMore;