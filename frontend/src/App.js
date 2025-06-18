import React, { useState } from 'react';
import EventIcon from '@mui/icons-material/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DateRangeIcon from '@mui/icons-material/DateRange';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Button,
  Typography,
  Container,
  Paper,
  Fade,
  Chip
} from '@mui/material';
import CreateYourEvent from './pages/CreateYourEvent';
import EventProgressTracker from './components/EventProgressTracker';
import { ArrowBack } from '@mui/icons-material';


const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1', // Modern indigo
      light: '#8b5cf6', // Purple accent
      dark: '#4f46e5',
    },
    secondary: {
      main: '#ec4899', // Pink accent
      light: '#f472b6',
    },
    background: {
      default: '#fafafb',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
    success: {
      main: '#10b981',
    },
    warning: {
      main: '#f59e0b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    subtitle1: {
      fontSize: '1.125rem',
      fontWeight: 400,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          fontSize: '1rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            backgroundColor: 'rgba(99, 102, 241, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid rgba(229, 231, 235, 0.8)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '14px',
          backgroundColor: '#374151',
          borderRadius: 8,
        },
      },
    },
  },
});

export default function App() {
  const [page, setPage] = useState('landing');

const BackButton = () => (
    <Button
      variant="text"
      onClick={() => {
        if (window.confirm('Are you sure you want to leave?')) {
          setPage('landing');
        }
      }}
      sx={{
        mb: 3,
        color: '#6366f1',
        '&:hover': {
          backgroundColor: 'rgba(99, 102, 241, 0.04)',
        },
        px: 1,
        py: 4,
      }}
      startIcon={<ArrowBack />}
    >
      Back to previous page
    </Button>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        {/* Global Header */}
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(229, 231, 235, 0.8)',
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 2,
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5,
                  cursor: 'pointer',
                }}
                onClick={() => setPage('landing')}
              >
                <img
                  src="/Fether_Logo_transparent.png"
                  alt="Fether Logo"
                  style={{
                    height: '100px',
                    width: 'auto',
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: '#6366f1',
                    fontSize: '3.50rem',
                  }}
                >
                  Fether
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="text"
                  sx={{
                    color: '#6b7280',
                    '&:hover': { backgroundColor: 'rgba(107, 114, 128, 0.1)' },
                  }}
                >
                  About
                </Button>
                <Button
                  variant="text"
                  sx={{
                    color: '#6b7280',
                    '&:hover': { backgroundColor: 'rgba(107, 114, 128, 0.1)' },
                  }}
                >
                  Features
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    ml: 1,
                    borderColor: '#d1d5db',
                    color: '#374151',
                    '&:hover': {
                      borderColor: '#6366f1',
                      backgroundColor: 'rgba(99, 102, 241, 0.04)',
                    },
                  }}
                >
                  Log In
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    },
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>

        {page === 'landing' && (
          <Box sx={{ minHeight: '100vh' }}>
            {/* Hero Section */}
            <Box
              sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                pt: 8,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                },
              }}
            >
              <Container maxWidth="md">
                <Fade in timeout={800}>
                  <Box sx={{ textAlign: 'center', color: 'white' }}>
                    <Typography 
                      variant="h2" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 800,
                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                        mb: 3,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      }}
                    >
                      Welcome to Fether
                    </Typography>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        mb: 5, 
                        opacity: 0.95,
                        fontWeight: 300,
                        maxWidth: 600,
                        mx: 'auto',
                        lineHeight: 1.4,
                      }}
                    >
                      Planning made simple.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => setPage('create')}
                        sx={{
                          py: 2,
                          px: 4,
                          fontSize: '1.1rem',
                          background: 'rgba(255,255,255,0.9)',
                          color: '#6366f1',
                          '&:hover': {
                            background: 'white',
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        Create an Event
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="large"
                        sx={{
                          py: 2,
                          px: 4,
                          fontSize: '1.1rem',
                          borderColor: 'rgba(255,255,255,0.8)',
                          color: 'white',
                          '&:hover': {
                            borderColor: 'white',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                          },
                        }}
                      >
                        Join Event
                      </Button>
                    </Box>
                  </Box>
                </Fade>
              </Container>
            </Box>

            {/* About Section */}
            <Box sx={{ py: 12, backgroundColor: 'white' }}>
              <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                  <Typography
                    variant="h3"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      color: '#1f2937',
                      mb: 3,
                    }}
                  >
                    Group Planning Made Simple
                  </Typography>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{
                      maxWidth: 700,
                      mx: 'auto',
                      lineHeight: 1.6,
                      fontWeight: 400,
                    }}
                  >
                    Consolidate details, gather input, finalize your itinerary and costs, and schedule everything in one place.
                  </Typography>
                </Box>
                
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                    gap: 6,
                    mt: 8,
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 3,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                      }}
                    >
                      <EventIcon sx={{ fontSize: 40 }} />
                    </Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#1f2937' }}>
                      Easy Setup
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Create events in minutes with our intuitive interface. No complex forms or confusing steps.
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 3,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                      }}
                    >
                      <CalendarTodayIcon sx={{ fontSize: 40 }} />
                    </Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#1f2937' }}>
                      Smart Scheduling
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Coordinate with attendees and find the perfect time that works for everyone.
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 3,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                      }}
                    >
                      <DateRangeIcon sx={{ fontSize: 40 }} />
                    </Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#1f2937' }}>
                      Flexible Planning
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Handle single events, all-day activities, or multi-day experiences with equal ease.
                    </Typography>
                  </Box>
                </Box>
              </Container>
            </Box>

            {/* CTA Section */}
            <Box
              sx={{
                py: 12,
                background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
              }}
            >
              <Container maxWidth="md">
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h3"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      color: '#1f2937',
                      mb: 3,
                    }}
                  >
                    No More Massive Text or Email Threads...
                  </Typography>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{
                      mb: 5,
                      lineHeight: 1.6,
                      fontWeight: 400,
                    }}
                  >
                    Are you on your fifth attempt to plan that girls trip? That family reunion? That couples dinner date? We're all busy, it can be a burden to plan these events.
                    Fether is here to change that. Our platform is designed to streamline the entire process, making it easy.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => setPage('typeSelect')}
                    sx={{
                      py: 2,
                      px: 6,
                      fontSize: '1.1rem',
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Start Planning Today
                  </Button>
                </Box>
              </Container>
            </Box>

            {/* Footer */}
            <Box
              sx={{
                py: 8,
                backgroundColor: '#1f2937',
                color: 'white',
              }}
            >
              <Container maxWidth="lg">
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
                    gap: 6,
                    mb: 6,
                  }}
                >
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        mb: 3,
                        color: '#6366f1',
                      }}
                    >
                      Fether
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#9ca3af',
                        lineHeight: 1.6,
                      }}
                    >
                      Making event planning simple, collaborative, and enjoyable for everyone.
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Product
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="body2" sx={{ color: '#9ca3af', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                        Features
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#9ca3af', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                        Pricing
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#9ca3af', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                        Templates
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Company
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="body2" sx={{ color: '#9ca3af', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                        About Us
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#9ca3af', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                        Contact
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#9ca3af', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                        Careers
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Support
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="body2" sx={{ color: '#9ca3af', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                        Help Center
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#9ca3af', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                        Privacy Policy
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#9ca3af', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                        Terms of Service
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Box
                  sx={{
                    pt: 6,
                    borderTop: '1px solid #374151',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                    © 2025 Fether. All rights reserved.
                  </Typography>
                </Box>
              </Container>
            </Box>
          </Box>
        )}

        {page === 'create' && (
          <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#fafafb', pt: 8 }}>
            <EventProgressTracker activities={[]} />
            <Box sx={{ flexGrow: 1, pt: 2, overflow: 'auto', ml: '280px' }}>
              <Container maxWidth="md" sx={{ py: 4 }}>
                <BackButton />
                <CreateYourEvent />
              </Container>
            </Box>
          </Box>
        )}

    </ThemeProvider>
  );
}