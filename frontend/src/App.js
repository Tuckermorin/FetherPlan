import React, { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Container,
  useMediaQuery,
  useTheme
} from '@mui/material';
import CreateYourEvent from './pages/CreateYourEvent';
import EventProgressTracker from './components/EventProgressTracker';
import MobileProgressTracker from './components/MobileProgressTracker';
import GlobalHeader from './components/GlobalHeader';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

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
  const isMobile = useMediaQuery('(max-width:700px)');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalHeader onHome={() => setPage('landing')} />

      {page === 'landing' && (
        <Box sx={{ minHeight: '100vh' }}>
          <HeroSection onCreate={() => setPage('create')} />
          <AboutSection />
          <CTASection onCreate={() => setPage('create')} />
          <Footer />
        </Box>
      )}

        {page === 'create' && (
          <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#fafafb', pt: 8 }}>
            {!isMobile && <EventProgressTracker activities={[]} />}
            <Box sx={{ flexGrow: 1, pt: 2, overflow: 'auto', ml: isMobile ? 0 : '280px', pb: isMobile ? '60px' : 0 }}>
              <Container maxWidth="md" sx={{ py: 4 }}>
                {/* <BackButton /> */}
                <CreateYourEvent onBack={() => setPage('landing')} />
              </Container>
            </Box>
            {isMobile && <MobileProgressTracker activities={[]} />}
          </Box>
        )}

    </ThemeProvider>
  );
}