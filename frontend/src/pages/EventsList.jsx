// frontend/src/pages/EventsList.jsx (Simplified)
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab,
} from '@mui/material';
import {
  Search,
  Add,
} from '@mui/icons-material';
import { AnimatePresence } from 'framer-motion';

// Custom hooks and components
import { useEvents } from '../hooks/useApi';
import { EventCardSkeleton } from '../components/LoadingStates';
import { EmptyState, useNotification } from '../components/ErrorHandling';
import EventCard from '../components/EventCard';


export default function EventsList({ onCreateNew, onViewEvent, onEditEvent }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const { data: events = [], isLoading, error, refetch } = useEvents();
  const { NotificationComponent } = useNotification();

  const filteredAndSortedEvents = React.useMemo(() => {
    let filtered = events.filter(event => {
      const matchesSearch = event.eventData?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.eventData?.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
      
      if (statusFilter === 'all') return true;
      
      // Add status filtering logic here based on dates
      return true;
    });

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'oldest':
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case 'name':
          return (a.eventData?.name || '').localeCompare(b.eventData?.name || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [events, searchTerm, statusFilter, sortBy]);

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>Your Events</Typography>
        </Box>
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <EventCardSkeleton />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <EmptyState
          title="Failed to load events"
          description="There was an error loading your events. Please try again."
          action={() => refetch()}
          actionText="Retry"
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Your Events
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and track all your planned events in one place
        </Typography>
      </Box>

      {/* Filters and Search */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="all">All Events</MenuItem>
                <MenuItem value="upcoming">Upcoming</MenuItem>
                <MenuItem value="past">Past</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
                <MenuItem value="name">Name A-Z</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Events Grid */}
      {filteredAndSortedEvents.length === 0 ? (
        <EmptyState
          title={searchTerm ? "No events found" : "No events yet"}
          description={
            searchTerm 
              ? "Try adjusting your search terms or filters"
              : "Start planning your first event and bring people together!"
          }
          action={onCreateNew}
          actionText="Create Your First Event"
        />
      ) : (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Showing {filteredAndSortedEvents.length} of {events.length} events
          </Typography>
          
          <Grid container spacing={3}>
            <AnimatePresence>
              {filteredAndSortedEvents.map((event) => (
                <Grid item xs={12} sm={6} lg={4} key={event._id}>
                  <EventCard
                    event={event}
                    onView={onViewEvent}
                    onEdit={onEditEvent}
                  />
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        </Box>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="create event"
        onClick={onCreateNew}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <Add />
      </Fab>

      <NotificationComponent />
    </Container>
  );
}