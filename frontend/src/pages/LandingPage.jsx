import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Box, Button, Card, CardContent, Container, Grid, IconButton,
  Typography, useTheme, useMediaQuery, Drawer, List, ListItem, ListItemText,
  Avatar, Paper, Fade, Grow, Stack, Divider
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  MapPin, Activity, Shield, Radar, MessageSquare, AlertTriangle,
  Fuel, BarChart3, Menu, X, Facebook, Twitter, Linkedin, Play, Pause, ChevronRight
} from 'lucide-react';

// --- Data ---
const features = [
  { icon: MapPin, title: 'Real-Time GPS Tracking', description: 'Track your fleet in real-time with precision GPS technology and turn-by-turn history.' },
  { icon: Activity, title: 'Speed Monitoring', description: 'Get instant alerts for speed violations and predictive unsafe driving patterns.' },
  { icon: Shield, title: 'Fatigue Monitoring', description: 'AI-powered biometric systems to detect and prevent driver drowsiness in real-time.' },
  { icon: MessageSquare, title: 'Fleet Communication', description: 'Seamless, encrypted real-time chat between dispatchers and drivers.' },
  { icon: Radar, title: 'Smart Proximity', description: 'Radar details for fleets appearing within specified geographic ranges.' },
  { icon: AlertTriangle, title: 'Incident Detection', description: 'Automated emergency response triggers and detailed crash analysis.' },
  { icon: Fuel, title: 'Fuel Optimization', description: 'Monitor consumption patterns and identify inefficient routes to save costs.' },
  { icon: BarChart3, title: 'Advanced Analytics', description: 'Enterprise-grade reporting with customizable KPI dashboards.' }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Fleet Manager',
    company: 'Global Logistics Inc.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    quote: 'GeoDash revolutionized our logistics. We saw a 15% reduction in fuel costs within the first quarter.'
  },
  {
    name: 'Michael Chen',
    role: 'Operations Director',
    company: 'FastTrack Delivery',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    quote: 'The AI fatigue detection is a lifesaver. Our safety record has never been better.'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Safety Coordinator',
    company: 'Express Transport',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    quote: 'User-friendly interface with incredibly deep data insights. Highly recommended.'
  }
];

// --- Sub-Components ---
const FadeInSection = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  );
};

const FloatingStats = () => (
  <motion.div
    animate={{ y: [0, -15, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
  >
    <Paper elevation={10} sx={{ p: 2, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(5px)' }}>
      <Avatar sx={{ bgcolor: 'success.main' }}><Activity size={20} /></Avatar>
      <Box>
        <Typography variant="caption" color="text.secondary" fontWeight="bold">LIVE UPDATES</Typography>
        <Typography variant="h6" fontWeight="bold">98.4% Efficiency</Typography>
      </Box>
    </Paper>
  </motion.div>
);

// --- Main Page ---
const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const videoRef = useRef(null);
  const featuresRef = useRef(null);
  const contactRef = useRef(null);
  const demoRef = useRef(null);

  // Scroll Listener
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handlePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  const scrollToSection = (ref, offset = -80) => {
    if (ref.current) {
      const y = ref.current.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <Box sx={{ bgcolor: '#fcfcfc', overflowX: 'hidden' }}>
      {/* Navigation */}
      <AppBar 
        position="fixed" 
        elevation={scrolled ? 4 : 0} 
        sx={{ 
          bgcolor: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
          backdropFilter: 'blur(12px)',
          transition: 'all 0.3s ease-in-out',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.1)' : 'none'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: scrolled ? 1.5 : 2.5 }}>
            <Typography 
              variant="h5" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              sx={{ fontWeight: 800, color: 'primary.main', cursor: 'pointer', letterSpacing: -1 }}
            >
              GEODASH
            </Typography>

            {isMobile ? (
              <IconButton onClick={() => setIsMenuOpen(true)} color="primary"><Menu /></IconButton>
            ) : (
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Button color="inherit" onClick={() => scrollToSection(featuresRef)} sx={{ color: scrolled ? 'text.primary' : 'white' }}>Features</Button>
                <Button color="inherit" onClick={() => navigate('/pricing')} sx={{ color: scrolled ? 'text.primary' : 'white' }}>Pricing</Button>
                <Button color="inherit" onClick={() => scrollToSection(contactRef)} sx={{ color: scrolled ? 'text.primary' : 'white' }}>Contact</Button>
                <Button variant="contained" onClick={() => navigate('/login')} sx={{ borderRadius: 2, px: 3, boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)' }}>
                  Sign In
                </Button>
              </Box>
            )}
          </Box>
        </Container>
      </AppBar>

      {/* Drawer */}
      <Drawer anchor="right" open={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        <Box sx={{ width: 280, p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h6" fontWeight="bold">Menu</Typography>
            <IconButton onClick={() => setIsMenuOpen(false)}><X /></IconButton>
          </Stack>
          <List spacing={2}>
            {['Features', 'Pricing', 'Contact'].map((text) => (
              <ListItem button key={text} onClick={() => text === 'Pricing' ? navigate('/pricing') : scrollToSection(text === 'Features' ? featuresRef : contactRef)}>
                <ListItemText primary={text} primaryTypographyProps={{ fontWeight: 500 }} />
              </ListItem>
            ))}
          </List>
          <Button variant="contained" fullWidth sx={{ mt: 4 }} onClick={() => navigate('/login')}>Get Started</Button>
        </Box>
      </Drawer>

      {/* Hero Section */}
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center',
          position: 'relative',
          background: `linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 58, 138, 0.8) 100%), url(https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=2000)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          clipPath: 'ellipse(150% 100% at 50% 0%)'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={7}>
              <Fade in timeout={1000}>
                <Box>
                  <Chip label="New: AI-Powered Fatigue Detection" color="primary" sx={{ mb: 2, bgcolor: 'rgba(25, 118, 210, 0.2)', backdropFilter: 'blur(5px)', border: '1px solid rgba(255,255,255,0.2)' }} />
                  <Typography variant="h1" sx={{ fontWeight: 900, mb: 2, fontSize: { xs: '3rem', md: '4.5rem' }, letterSpacing: -2, lineHeight: 1.1 }}>
                    Intelligence for every <br />
                    <Typography component="span" variant="inherit" color="primary.main">Mile Traveled.</Typography>
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 5, color: 'rgba(255,255,255,0.8)', maxWidth: 600, fontWeight: 300 }}>
                    Enterprise fleet management that combines real-time IoT tracking with advanced safety analytics.
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button variant="contained" size="large" onClick={() => navigate('/login')} sx={{ px: 5, py: 2, borderRadius: 2, fontSize: '1.1rem' }}>
                      Start Free Trial
                    </Button>
                    <Button variant="outlined" size="large" onClick={() => scrollToSection(demoRef)} sx={{ px: 5, py: 2, color: 'white', borderColor: 'white', borderRadius: 2 }}>
                      Watch Demo
                    </Button>
                  </Stack>
                </Box>
              </Fade>
            </Grid>
            {!isMobile && (
              <Grid item xs={12} md={5} sx={{ position: 'relative' }}>
                <Grow in timeout={1500}>
                  <Box sx={{ position: 'relative' }}>
                    <Box 
                      component="img" 
                      src="https://images.unsplash.com/photo-1509099652299-30938b0aeb63?auto=format&fit=crop&w=1000"
                      sx={{ width: '100%', borderRadius: 8, transform: 'perspective(1000px) rotateY(-10deg)', boxShadow: 24 }}
                    />
                    <Box sx={{ position: 'absolute', top: -40, right: -20 }}><FloatingStats /></Box>
                  </Box>
                </Grow>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>

      {/* Features Grid */}
      <Box ref={featuresRef} sx={{ py: 15 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={10}>
            <Typography variant="overline" color="primary" fontWeight="bold" letterSpacing={2}>CAPABILITIES</Typography>
            <Typography variant="h2" fontWeight="800" gutterBottom letterSpacing={-1}>One Platform, Endless Control</Typography>
            <Typography variant="h6" color="text.secondary" maxWidth={700} mx="auto">Everything you need to manage drivers, vehicles, and fuel from a single interface.</Typography>
          </Box>
          <Grid container spacing={4}>
            {features.map((f, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <FadeInSection delay={i * 0.1}>
                  <Card sx={{ height: '100%', borderRadius: 4, transition: '0.3s', '&:hover': { transform: 'translateY(-10px)', boxShadow: 6 } }}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ bgcolor: 'primary.light', width: 60, height: 60, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3, color: 'primary.main' }}>
                        <f.icon size={32} />
                      </Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>{f.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{f.description}</Typography>
                    </CardContent>
                  </Card>
                </FadeInSection>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Video Demo Section */}
      <Box ref={demoRef} sx={{ py: 12, bgcolor: '#111', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', borderRadius: 6, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                <video ref={videoRef} poster="https://plus.unsplash.com/premium_photo-1661637686969-7fbcea8789ad?auto=format&fit=crop&w=1000" style={{ width: '100%', display: 'block' }}>
                  <source src="https://videos.pond5.com/logistics-and-transportation-truck-lorry-footage-291971416_main_xxl.mp4" type="video/mp4" />
                </video>
                <IconButton 
                  onClick={handlePlayPause}
                  sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'primary.main', width: 80, height: 80, '&:hover': { bgcolor: 'primary.dark' } }}
                >
                  {isVideoPlaying ? <Pause color="white" fill="white" /> : <Play color="white" fill="white" />}
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h3" fontWeight="800" gutterBottom>Real-time visual data at your fingertips.</Typography>
              <Typography variant="h6" sx={{ opacity: 0.7, mb: 4, fontWeight: 300 }}>Experience how our 3D visualization and radar systems detect incidents before they occur.</Typography>
              <Stack spacing={2}>
                {['Live telemetry sync', '3D Vehicle projection', 'Predictive alerts'].map(text => (
                  <Stack direction="row" spacing={2} alignItems="center" key={text}>
                    <Box sx={{ width: 10, height: 10, bgcolor: 'primary.main', borderRadius: '50%' }} />
                    <Typography fontWeight="500">{text}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box sx={{ py: 15 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" fontWeight="800" mb={8}>What Fleet Owners Say</Typography>
          <Grid container spacing={4}>
            {testimonials.map((t, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Paper sx={{ p: 4, borderRadius: 5, height: '100%', bgcolor: 'background.default', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <Typography variant="body1" sx={{ mb: 4, fontStyle: 'italic', fontSize: '1.1rem' }}>"{t.quote}"</Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar src={t.image} sx={{ width: 50, height: 50 }} />
                    <Box>
                      <Typography fontWeight="bold">{t.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{t.role} • {t.company}</Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" ref={contactRef} sx={{ pb: 10 }}>
        <Box sx={{ bgcolor: 'primary.main', borderRadius: 8, p: { xs: 6, md: 10 }, textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
          <Typography variant="h2" fontWeight="800" gutterBottom>Join the future of fleet safety.</Typography>
          <Typography variant="h6" sx={{ mb: 6, opacity: 0.9 }}>Get started with a 14-day free trial. No credit card required.</Typography>
          <Button variant="contained" size="large" onClick={() => navigate('/pricing')} sx={{ bgcolor: 'white', color: 'primary.main', px: 6, py: 2, fontSize: '1.2rem', fontWeight: 'bold', '&:hover': { bgcolor: '#eee' } }}>
            Get Started Now <ChevronRight style={{ marginLeft: 8 }} />
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'white', borderTop: '1px solid rgba(0,0,0,0.08)', py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={8}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" fontWeight="900" color="primary" gutterBottom>GEODASH</Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Next-generation fleet management solution combining GPS, AI, and Big Data to keep your fleet safe and efficient.
              </Typography>
              <Stack direction="row" spacing={1}>
                {[Facebook, Twitter, Linkedin].map((Icon, i) => (
                  <IconButton key={i} color="primary" sx={{ border: '1px solid rgba(0,0,0,0.05)' }}><Icon size={20} /></IconButton>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={4}>
                {['Product', 'Company', 'Support'].map((cat) => (
                  <Grid item xs={6} sm={4} key={cat}>
                    <Typography variant="subtitle2" fontWeight="bold" mb={3}>{cat}</Typography>
                    <Stack spacing={1}>
                      {['About Us', 'Features', 'Pricing', 'Documentation'].map(link => (
                        <Typography key={link} variant="body2" sx={{ cursor: 'pointer', color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>{link}</Typography>
                      ))}
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
          <Divider sx={{ my: 6 }} />
          <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
            © 2026 GeoDash Technologies. Built for global fleet excellence.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;