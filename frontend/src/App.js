import React, { createContext, useContext, useState } from 'react';
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
import CreateEvent from './pages/CreateEvent';
import SingleEvent from './pages/SingleEvent';
import LivePreview from './pages/LivePreview';
import EventProgressTracker from './components/EventProgressTracker';

export const StepContext = createContext();
export const useStep = () => useContext(StepContext);

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

const EventTypeCard = ({ type, title, description, icon, isSelected, onClick }) => (
  <Paper
    elevation={isSelected ? 8 : 2}
    sx={{
      p: 3,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: isSelected ? '2px solid #6366f1' : '2px solid transparent',
      background: isSelected 
        ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)'
        : 'white',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
      },
      width: 280,
      height: 160,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}
    onClick={() => onClick(type)}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Box
        sx={{
          p: 1.5,
          borderRadius: 2,
          backgroundColor: isSelected ? '#6366f1' : '#f3f4f6',
          color: isSelected ? 'white' : '#6b7280',
          mr: 2,
        }}
      >
        {icon}
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
    </Box>
    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
      {description}
    </Typography>
    {isSelected && (
      <Chip
        label="Selected"
        size="small"
        sx={{
          alignSelf: 'flex-start',
          mt: 1,
          backgroundColor: '#6366f1',
          color: 'white',
        }}
      />
    )}
  </Paper>
);

export default function App() {
  const [page, setPage] = useState('landing');
  const [eventType, setEventType] = useState('single');
  const [activeStep, setActiveStep] = useState(0);
  const stepValue = { activeStep, setActiveStep };

  const eventTypeOptions = [
    {
      type: 'single',
      title: 'Single Event',
      description: 'A one-time event happening on a specific date and time',
      icon: <EventIcon />,
    },
    {
      type: 'day',
      title: 'Full Day',
      description: 'An all-day event lasting an entire calendar day',
      icon: <CalendarTodayIcon />,
    },
    {
      type: 'multiDay',
      title: 'Multi-Day',
      description: 'An event spanning multiple consecutive days',
      icon: <DateRangeIcon />,
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StepContext.Provider value={stepValue}>
        {page === 'landing' && (
          <Box
            sx={{
              minHeight: '100vh',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
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
                    Planning made simple. Memories made unforgettable.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => setPage('typeSelect')}
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
        )}

        {page === 'typeSelect' && (
          <Box
            sx={{
              minHeight: '100vh',
              backgroundColor: '#fafafb',
              py: 6,
            }}
          >
            <Container maxWidth="lg">
              <Box sx={{ mb: 4 }}>
                <Button 
                  variant="text" 
                  onClick={() => setPage('landing')}
                  sx={{ 
                    color: '#6b7280',
                    fontSize: '1rem',
                    '&:hover': { backgroundColor: 'rgba(107, 114, 128, 0.1)' }
                  }}
                >
                  ← Back to Home
                </Button>
              </Box>
              
              <Fade in timeout={600}>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                  <Typography 
                    variant="h3" 
                    gutterBottom
                    sx={{ 
                      color: '#1f2937',
                      mb: 2,
                    }}
                  >
                    Choose Your Event Type
                  </Typography>
                  <Typography 
                    variant="subtitle1" 
                    color="text.secondary"
                    sx={{ maxWidth: 600, mx: 'auto' }}
                  >
                    Select the type of event you'd like to create. Each type offers different planning features.
                  </Typography>
                </Box>
              </Fade>

              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 4, 
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  mb: 6,
                }}
              >
                {eventTypeOptions.map((option, index) => (
                  <Fade in timeout={800 + index * 200} key={option.type}>
                    <div>
                      <EventTypeCard
                        {...option}
                        isSelected={eventType === option.type}
                        onClick={setEventType}
                      />
                    </div>
                  </Fade>
                ))}
              </Box>

              <Fade in timeout={1200}>
                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => setPage(eventType)}
                    sx={{
                      py: 2,
                      px: 6,
                      fontSize: '1.1rem',
                    }}
                  >
                    Continue to Planning
                  </Button>
                </Box>
              </Fade>
            </Container>
          </Box>
        )}

        {(page === 'single' || page === 'day' || page === 'multiDay') && (
          <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#fafafb' }}>
            <Box 
              sx={{ 
                position: 'absolute',
                top: 0,
                left: page === 'single' ? 280 : 0, // Adjust for progress tracker width
                right: 0,
                zIndex: 10,
                backgroundColor: 'white',
                borderBottom: '1px solid #e5e7eb',
                p: 2,
              }}
            >
              <Button 
                variant="text" 
                onClick={() => setPage('typeSelect')}
                sx={{ 
                  color: '#6b7280',
                  '&:hover': { backgroundColor: 'rgba(107, 114, 128, 0.1)' }
                }}
              >
                ← Back to Event Types
              </Button>
            </Box>
            
            {page === 'single' && (
              <EventProgressTracker 
                activities={[]} // We'll need to pass actual activities from SingleEvent
                hasVotingEnabled={false} // We'll need to pass this too
              />
            )}
            
            {page !== 'single' && (
              <Box
                sx={{ 
                  width: '35%', 
                  borderRight: '2px solid #e5e7eb',
                  backgroundColor: 'white',
                  pt: 10,
                  overflow: 'auto',
                  boxShadow: '2px 0 4px rgba(0,0,0,0.05)',
                }}
              >
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#374151', fontWeight: 600 }}>
                    Live Preview
                  </Typography>
                  <LivePreview eventType={eventType} />
                </Box>
              </Box>
            )}
            
            <Box sx={{ 
              flexGrow: 1, 
              pt: 10, 
              overflow: 'auto',
              ml: page === 'single' ? '280px' : 0 // Add margin for progress tracker
            }}>
              <Container maxWidth="md" sx={{ py: 4 }}>
                {page === 'single' ? (
                  <SingleEvent />
                ) : (
                  <CreateEvent eventType={eventType} />
                )}
              </Container>
            </Box>
          </Box>
        )}

      </StepContext.Provider>
    </ThemeProvider>
  );
}