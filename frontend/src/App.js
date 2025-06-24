// frontend/src/App.js
import React, { useState } from 'react';
import {
  CssBaseline,
  Box,
  Container,
  useMediaQuery,
} from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/ErrorHandling';
import CreateYourEvent from './pages/CreateYourEvent';
import EventsList from './pages/EventsList';
import EventProgressTracker from './components/EventProgressTracker';
import MobileProgressTracker from './components/MobileProgressTracker';
import GlobalHeader from './components/GlobalHeader';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import JoinEvent from './pages/JoinEvent';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

function AppContent() {
  const params = new URLSearchParams(window.location.search);
  const startCode = params.get('code') || '';
  const [page, setPage] = useState(startCode ? 'join' : 'landing');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [joinCode] = useState(startCode);
  const isMobile = useMediaQuery('(max-width:700px)');

  const handleCreateEvent = () => setPage('create');
  const handleViewEvents = () => setPage('events');
  const handleJoinEvent = () => setPage('join');
  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setPage('view');
  };
  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setPage('edit');
  };

  return (
    <ErrorBoundary>
      <CssBaseline />
      <GlobalHeader 
        onHome={() => setPage('landing')}
        onViewEvents={handleViewEvents}
        currentPage={page}
      />

      {page === 'landing' && (
        <Box sx={{ minHeight: '100vh' }}>
          <HeroSection
            onCreate={handleCreateEvent}
            onViewEvents={handleViewEvents}
            onJoin={handleJoinEvent}
          />
          <AboutSection />
          <CTASection onCreate={handleCreateEvent} />
          <Footer />
        </Box>
      )}

      {page === 'events' && (
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', pt: 8 }}>
          <EventsList
            onCreateNew={handleCreateEvent}
            onViewEvent={handleViewEvent}
            onEditEvent={handleEditEvent}
          />
        </Box>
      )}

      {(page === 'create' || page === 'edit') && (
        <Box sx={{
          display: 'flex', 
          height: '100vh', 
          backgroundColor: 'background.default', 
          pt: 8 
        }}>
          {!isMobile && <EventProgressTracker activities={[]} />}
          <Box sx={{ 
            flexGrow: 1, 
            pt: 2, 
            overflow: 'auto', 
            ml: isMobile ? 0 : '280px', 
            pb: isMobile ? '60px' : 0 
          }}>
            <Container maxWidth="md" sx={{ py: 4 }}>
              <CreateYourEvent 
                onBack={() => setPage(page === 'edit' ? 'events' : 'landing')}
                editEvent={page === 'edit' ? selectedEvent : null}
              />
            </Container>
          </Box>
          {isMobile && <MobileProgressTracker activities={[]} />}
        </Box>
      )}

      {page === 'join' && (
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', pt: 8 }}>
          <JoinEvent onBack={() => setPage('landing')} defaultCode={joinCode} />
        </Box>
      )}
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppContent />
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </ThemeProvider>
    </QueryClientProvider>
  );
}