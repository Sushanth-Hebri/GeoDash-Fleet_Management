import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Typography,
  Card,
  CardContent,
  CardActions,
  useMediaQuery,
  useTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  List as MobileList,
  ListItemButton,
} from '@mui/material';
import { Menu, Check } from 'lucide-react';

function App() {
const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = ['Features', 'Solutions', 'Pricing', 'Contact'];

  const features = {
    trial: [
      'Full Access for 2 Months',
      'Unlimited fleet tracking & history',
      'Advanced analytics & reports',
      'Real-time alerts & notifications',
      'Full customer support access',
      'Geofencing & custom alerts'
    ],
    paid: [
      'Keep all features after trial ends',
      'Uninterrupted tracking & analytics',
      'Priority support',
      'Custom integrations & API access',
      'Advanced security features',
      'Dedicated account manager'
    ]
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1519003722824-194d4455a60c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <AppBar position="fixed" color="transparent" sx={{ backdropFilter: 'blur(10px)' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'white' }}  onClick={() => navigate('/')}>
              GeoDash
            </Typography>

            {isMobile ? (
              <IconButton onClick={() => setIsMenuOpen(true)} sx={{ color: 'white' }}>
                <Menu />
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {navigationItems.map((item) => (
                  <Button
                    key={item}
                    sx={{
                      color: 'white',
                      fontWeight: 500,
                      ...(item === 'Pricing' && {
                        borderBottom: '2px solid white',
                        borderRadius: 0,
                      }),
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    {item}
                  </Button>
                ))}
                <Button 
                  variant="contained" 
                  sx={{ 
                    px: 4,
                    backgroundColor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    }
                  }}
                >
                  Get Started
                </Button>
              </Box>
            )}
          </Box>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      >
        <MobileList sx={{ width: 250 }}>
          {navigationItems.map((item) => (
            <ListItemButton 
              key={item}
              sx={{
                ...(item === 'Pricing' && {
                  backgroundColor: 'primary.light',
                }),
              }}
            >
              <ListItemText primary={item} />
            </ListItemButton>
          ))}
        </MobileList>
      </Drawer>

      <Container maxWidth="lg" sx={{ pt: 15, pb: 8 }}>
        <Typography 
          variant="h2" 
          align="center" 
          gutterBottom
          sx={{ 
            color: 'white',
            fontWeight: 'bold',
            mb: 6
          }}
        >
          Simple, Transparent Pricing
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          justifyContent: 'center',
          alignItems: 'stretch'
        }}>
          <Card sx={{ 
            maxWidth: 400,
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-10px)'
            }
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" component="div" gutterBottom color="primary" fontWeight="bold">
                Free Trial
              </Typography>
              <Typography variant="h3" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
                2 Months
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Full access to all premium features
              </Typography>
              
              <List>
                {features.trial.map((feature) => (
                  <ListItem key={feature} disablePadding sx={{ mb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Check size={20} color={theme.palette.primary.main} />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
            <CardActions sx={{ p: 4, pt: 0 }}>
              <Button variant="outlined" fullWidth size="large"  onClick={() => navigate('/signupforowner')}>
                Start Free Trial
              </Button>
            </CardActions>
          </Card>

          <Card sx={{ 
            maxWidth: 400,
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '2px solid',
            borderColor: 'primary.main',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-10px)'
            }
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" component="div" gutterBottom color="primary" fontWeight="bold">
                Paid Plan
              </Typography>
              <Typography variant="h3" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
                $6<Typography component="span" variant="h5">/month</Typography>
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Continue your journey with full access
              </Typography>
              
              <List>
                {features.paid.map((feature) => (
                  <ListItem key={feature} disablePadding sx={{ mb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Check size={20} color={theme.palette.primary.main} />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
            <CardActions sx={{ p: 4, pt: 0 }}>
              <Button variant="contained" fullWidth size="large">
                Subscribe Now
              </Button>
            </CardActions>
          </Card>
        </Box>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
            Why Upgrade?
          </Typography>
          <Typography variant="body1" sx={{ 
            color: 'white',
            maxWidth: 800,
            margin: '0 auto',
            opacity: 0.9
          }}>
            After 2 months, users either subscribe or lose access to real-time tracking, analytics, and alerts, 
            making the transition seamless while encouraging long-term use. Don't lose the powerful features 
            that help your business grow.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default App;