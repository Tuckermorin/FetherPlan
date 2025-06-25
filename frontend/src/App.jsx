// frontend/src/App.jsx
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CssBaseline } from '@mui/material';

// Import your components
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary, useNotification } from './components/ErrorHandling';
import GlobalHeader from './components/GlobalHeader';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import CreateYourEvent from './pages/CreateYourEvent';
import EventsList from './pages/EventsList';
import JoinEvent from './pages/JoinEvent';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { NotificationComponent } = useNotification();

  const navigateToHome = () => setCurrentPage('home');
  const navigateToCreate = () => setCurrentPage('create');
  const navigateToEvents = () => setCurrentPage('events');
  const navigateToJoin = () => setCurrentPage('join');
  const navigateToEdit = (event) => {
    setSelectedEvent(event);
    setCurrentPage('edit');
  };
  const navigateToView = (event) => {
    setSelectedEvent(event);
    setCurrentPage('view');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'create':
        return <CreateYourEvent onBack={navigateToHome} />;
      
      case 'edit':
        return (
          <CreateYourEvent 
            onBack={navigateToEvents} 
            editEvent={selectedEvent}
          />
        );
      
      case 'events':
        return (
          <EventsList
            onCreateNew={navigateToCreate}
            onViewEvent={navigateToView}
            onEditEvent={navigateToEdit}
          />
        );
      
      case 'join':
        return <JoinEvent onBack={navigateToHome} />;
      
      case 'view':
        return (
          <div>
            <h1>Event Details</h1>
            <p>Viewing: {selectedEvent?.eventData?.name}</p>
            <button onClick={navigateToEvents}>Back to Events</button>
          </div>
        );
      
      case 'home':
      default:
        return (
          <>
            <HeroSection 
              onCreate={navigateToCreate}
              onJoin={navigateToJoin}
            />
            <AboutSection />
            <CTASection onCreate={navigateToCreate} />
            <Footer />
          </>
        );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ErrorBoundary>
          <CssBaseline />
          
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            
            {/* Main app route */}
            <Route path="/*" element={
              <div style={{ minHeight: '100vh' }}>
                <GlobalHeader
                  onHome={navigateToHome}
                  onViewEvents={navigateToEvents}
                  currentPage={currentPage}
                />
                <main style={{ paddingTop: '100px' }}>
                  {renderCurrentPage()}
                </main>
              </div>
            } />
          </Routes>

          <NotificationComponent />
          <ReactQueryDevtools initialIsOpen={false} />
        </ErrorBoundary>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;