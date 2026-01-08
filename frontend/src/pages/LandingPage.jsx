import React, { useState, useEffect, useRef } from 'react'; // Import useState, useEffect, and useRef
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Paper,
  Fade,
  Grow,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  MapPin,
  Activity,
  Shield,
  Radar,
  MessageSquare,
  AlertTriangle,
  Fuel,
  BarChart3,
  Menu,
  X,
  Facebook,
  Twitter,
  Linkedin,
  Play,
  Pause,
} from 'lucide-react';

// Data
const features = [
  { icon: MapPin, title: 'Real-Time GPS Tracking', description: 'Track your fleet in real-time with precision GPS technology' },
  { icon: Activity, title: 'Speed Monitoring', description: 'Get instant alerts for speed violations and unsafe driving' },
  { icon: Shield, title: 'Driver Fatigue Monitoring', description: 'AI-powered system to detect and prevent driver fatigue' },
  { icon: MessageSquare, title: 'Real-Time Communication', description: 'Realtime chat between driver and Owner' },
  { icon: Radar, title: 'Fleet Radar', description: 'Get details of fleets appearing in the radar of a specified location and range.' },
  { icon: AlertTriangle, title: 'Incident Detection', description: 'Automatic detection and reporting of incidents' },
  { icon: Fuel, title: 'Fuel Monitoring', description: 'Track and optimize fuel consumption across your fleet' },
  { icon: BarChart3, title: 'Advanced Analytics', description: 'Comprehensive reporting and performance analytics' }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Fleet Manager',
    company: 'Global Logistics Inc.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    quote: 'This platform has revolutionized how we manage our fleet. The real-time tracking and analytics are invaluable.'
  },
  {
    name: 'Michael Chen',
    role: 'Operations Director',
    company: 'FastTrack Delivery',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    quote: 'The driver fatigue monitoring system has significantly improved our safety metrics.'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Safety Coordinator',
    company: 'Express Transport',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    quote: 'Incident detection and real-time alerts have helped us respond faster to situations.'
  }
];

// Animation Component
const FadeInSection = ({ children }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false); // Track video play state
  const [isHovered, setIsHovered] = useState(false); // Track hover state

  // Create a reference to the video element
  const videoRef = useRef(null);
// Creating refs for each section
const featuresRef = useRef(null);
const contactRef = useRef(null);
const watchdemo = useRef(null);
  // Function to handle play/pause
  const handlePlayPause = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsVideoPlaying(true);
    } else {
      video.pause();
      setIsVideoPlaying(false);
    }
  };

  // Handle video end
  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
  };

  // Handle hover
  const handleHover = (hoverState) => {
    setIsHovered(hoverState);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (item) => {
    const scrollOptions = { behavior: 'smooth' };
  
    if (item.toLowerCase() === 'features' && featuresRef.current) {
      const yOffset = -100; // Adjust this value for extra margin
      const y = featuresRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else if (item.toLowerCase() === 'contact' && contactRef.current) {
      contactRef.current.scrollIntoView(scrollOptions);
    } 
    else if(item.toLowerCase() === 'watchdemo' && watchdemo.current){
      const yOffset = -100; // Adjust this value for extra margin
      const y = watchdemo.current.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    else if (item.toLowerCase() === 'pricing') {
      navigate('/pricing');
    } else if (item.toLowerCase() === 'solutions') {
      navigate('/solutions');
    }
  };
  

  return (
<Box
  sx={{
    background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), #f5f5f5`, // Default light mode paper color
    minHeight: '100vh',
  }}
>      {/* Navigation */}
      <AppBar position="fixed" color="transparent" sx={{ backdropFilter: 'blur(10px)' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              GeoDash
            </Typography>

            <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {['Features', 'Solutions', 'Pricing', 'Contact'].map((item) => (
                <Button
                  key={item}
                  color="primary"
                  onClick={() => handleClick(item)}
                  sx={{
                    fontWeight: 500,
                    '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' },
                  }}
                >
                  {item}
                </Button>
              ))}
              <Button   onClick={() => navigate('/login')} variant="contained" color="primary" sx={{ px: 4 }}>
                Get Started
              </Button>
            </Box>
          </Box>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        <Box sx={{ width: 250, pt: 2 }}>
          <IconButton sx={{ ml: 2, mb: 2 }} onClick={() => setIsMenuOpen(false)}>
            <X />
          </IconButton>
          <List>
            {['Features', 'Solutions', 'Pricing', 'Contact'].map((text) => (
              <ListItem button key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
            <ListItem>
              <Button variant="contained" fullWidth color="primary">
                Get Started
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=2000)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          pt: 8,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                    Next-Generation
                    <Typography component="span" variant="h2" color="primary.main" fontWeight="bold">
                      {' '}Fleet Management
                    </Typography>
                  </Typography>
                  <Typography variant="h5" paragraph sx={{ mb: 4, color: 'grey.300' }}>
                    Transform your fleet operations with real-time tracking, advanced analytics, and AI-powered insights
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{ px: 4, py: 1.5 }}
                      onClick={() => navigate('/pricing')}
                    >
                      Start Free Trial
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="large"
                      sx={{ px: 4, py: 1.5 }}
                      onClick={() => handleClick('watchdemo')}
                    >
                      Watch Demo
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grow in timeout={1500}>
                <Box
                  component={Paper}
                  elevation={24}
                  sx={{
                    p: 2,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1509099652299-30938b0aeb63?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&w=1000"
                    sx={{
                      width: '20%',
                      borderRadius: 2,
                      transform: 'scale(1.02)',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                </Box>
              </Grow>
            </Grid>
          </Grid>
        </Container>
      </Box>



      {/* Features Section */}
      <Box sx={{ py: 12, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg" ref={featuresRef} id="features" >
          <FadeInSection>
            <Typography variant="h3" component="h2" align="center" gutterBottom fontWeight="bold">
              Powerful Features for Modern Fleet Management
            </Typography>
          </FadeInSection>
          
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <FadeInSection>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                      },
                    }}
                  >
                    <CardContent>
                      <feature.icon size={48} color={theme.palette.primary.main} />
                      <Typography variant="h6" component="h3" sx={{ mt: 2, mb: 1 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </FadeInSection>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
{/* GeoDash Model Section */}
<Box sx={{ py: 12, bgcolor: 'grey.100' }}>
  <Container maxWidth="lg">
    <Grid container spacing={6} alignItems="center">
      {/* Image Section */}
      <Grid item xs={12} md={6}>
        <FadeInSection>
          <Box
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: theme.shadows[20],
            }}
          >
            <Box
              component="img"
              src="https://plus.unsplash.com/premium_photo-1682144324433-ae1ee89a0238?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Replace with your model image URL
              sx={{
                width: '100%',
                display: 'block',
                borderRadius: 4,
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            />
          </Box>
        </FadeInSection>
      </Grid>

      {/* Know More Section */}
      <Grid item xs={12} md={6}>
        <FadeInSection>
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
              GeoDash Model
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              Discover how our innovative model revolutionizes fleet management with cutting-edge technology and AI-driven solutions.
            </Typography>
            <Button onClick={() => navigate('/learnmore')}
              variant="contained"
              size="large"
              sx={{
                px: 6,
                py: 2,
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              Know More
            </Button>
          </Box>
        </FadeInSection>
      </Grid>
    </Grid>
  </Container>
</Box>


      {/* Interactive Demo Section */}
      <Box sx={{ py: 12, bgcolor: 'grey.100' }}>
        <Container maxWidth="lg" ref={watchdemo} id="watchdemo">
          <FadeInSection>
            <Typography variant="h3" component="h2" align="center" gutterBottom fontWeight="bold">
              See GeoDash in Action
            </Typography>
          </FadeInSection>

          <Grid container spacing={6} alignItems="center" sx={{ mt: 4 }}>
            {/* Video Section */}
            <Grid item xs={12} md={6}>
              <FadeInSection>
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: theme.shadows[20],
                  }}
                  onMouseEnter={() => handleHover(true)} // Handle hover in
                  onMouseLeave={() => handleHover(false)} // Handle hover out
                >
                  {/* Embedded Video */}
                  <Box
                    component="video"
                    controls={true} // Disable default controls
                    poster="https://plus.unsplash.com/premium_photo-1661637686969-7fbcea8789ad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Thumbnail for the video
                    sx={{
                      width: '100%',
                      display: 'block',
                      borderRadius: 4,
                    }}
                    ref={videoRef} // Ref to control the video
                    onEnded={handleVideoEnd} // Handle video end
                  >
                    <source
                      src="https://videos.pond5.com/logistics-and-transportation-truck-lorry-footage-291971416_main_xxl.mp4" // Replace with your demo video URL
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </Box>

                  {/* Play/Pause Button */}
                  {(isHovered || !isVideoPlaying) && (
                    <IconButton
                      className="play-button"
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'primary.main',
                        width: 80,
                        height: 80,
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translate(-50%, -50%) scale(1.1)', // Scale up on hover
                          bgcolor: 'primary.dark',
                        },
                      }}
                      onClick={handlePlayPause} // Toggle play/pause
                    >
                      {isVideoPlaying ? (
                        <Pause size={40} color="white" /> // Show pause icon if video is playing
                      ) : (
                        <Play size={40} color="white" /> // Show play icon if video is paused
                      )}
                    </IconButton>
                  )}
                </Box>
              </FadeInSection>
            </Grid>

            {/* Feature Description Section */}
            <Grid item xs={12} md={6}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
                    {features[activeFeature].title}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {features[activeFeature].description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                    {features.map((_, index) => (
                      <Box
                        key={index}
                        onClick={() => setActiveFeature(index)}
                        sx={{
                          width: index === activeFeature ? 32 : 8,
                          height: 8,
                          borderRadius: 4,
                          bgcolor: index === activeFeature ? 'primary.main' : 'grey.300',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease-in-out',
                        }}
                      />
                    ))}
                  </Box>
                </motion.div>
              </AnimatePresence>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 12, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <FadeInSection>
            <Typography variant="h3" component="h2" align="center" gutterBottom fontWeight="bold">
              Trusted by Industry Leaders
            </Typography>
          </FadeInSection>

          <Grid container spacing={4} sx={{ mt: 4 }}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <FadeInSection>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      p: 3,
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar
                        src={testimonial.image}
                        sx={{ width: 64, height: 64, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h6" component="h3">
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.company}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                      "{testimonial.quote}"
                    </Typography>
                  </Card>
                </FadeInSection>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 12,
          bgcolor: 'primary.main',
          color: 'white',
        }}
      >
        <Container maxWidth="lg" ref={contactRef} id="contact">
          <FadeInSection>
            <Box textAlign="center">
              <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
                Ready to Transform Your Fleet Operations?
              </Typography>
              <Typography variant="h6" paragraph sx={{ mb: 4 }}>
                Join thousands of companies already using GeoDash to optimize their operations
              </Typography>
              <Button
      variant="contained"
      size="large"
      sx={{
        px: 6,
        py: 2,
        bgcolor: 'white',
        color: 'primary.main',
        '&:hover': {
          bgcolor: 'grey.100',
        },
      }}
      onClick={() => navigate('/pricing')}
    >
      Start Your Free Trial
    </Button>
            </Box>
          </FadeInSection>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
  <Container maxWidth="lg">
    <Grid container spacing={4}>
      {/* Company Info */}
      <Grid item xs={12} md={4}>
        <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
          GeoDash
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Next-generation fleet management solution for modern businesses
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Bangalore, India
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Contact: +91 123 456 7890
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Email: support@GeoDash.com
          </Typography>
        </Box>
      </Grid>

      {/* Quick Links */}
      <Grid item xs={12} md={8}>
        <Grid container spacing={4}>
          {/* Product Links */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Product
            </Typography>
            <Typography variant="body2" component="div">
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                {['Features', 'Solutions', 'Pricing', 'Updates'].map((item) => (
                  <Box component="li" key={item} sx={{ mb: 1 }}>
                    <Button color="inherit" sx={{ p: 0 }}>
                      {item}
                    </Button>
                  </Box>
                ))}
              </Box>
            </Typography>
          </Grid>

          {/* Company Links */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Company
            </Typography>
            <Typography variant="body2" component="div">
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                {['About', 'Careers', 'Blog', 'Contact'].map((item) => (
                  <Box component="li" key={item} sx={{ mb: 1 }}>
                    <Button color="inherit" sx={{ p: 0 }}>
                      {item}
                    </Button>
                  </Box>
                ))}
              </Box>
            </Typography>
          </Grid>

          {/* Connect Links */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Connect
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <IconButton color="primary">
                <Facebook />
              </IconButton>
              <IconButton color="primary">
                <Twitter />
              </IconButton>
              <IconButton color="primary">
                <Linkedin />
              </IconButton>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Follow us on social media for updates.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>

    {/* Copyright Notice */}
    <Box sx={{ mt: 8, pt: 4, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
      <Typography variant="body2" color="text.secondary">
        © 2025 GeoDash. All rights reserved.
      </Typography>
    </Box>
  </Container>
</Box>
    </Box>
  );
};

export default LandingPage;