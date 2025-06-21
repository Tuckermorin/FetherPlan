// frontend/src/pages/EventsList.jsx (Simplified)
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
  Chip,
  Avatar,
  IconButton,
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
  Event,
  AttachMoney,
  Visibility,
  Edit,
  Delete,
  CalendarToday,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Custom hooks and components
import { useEvents, useDeleteEvent } from '../hooks/useApi';
import { EventCardSkeleton } from '../components/LoadingStates';
import { EmptyState, useNotification } from '../components/ErrorHandling';

const EventCard = ({ event, onView, onEdit, onDelete }) => {
  const { showNotification } = useNotification();
  const deleteEventMutation = useDeleteEvent({
    onSuccess: () => {
      showNotification('Event deleted successfully', 'success');
    }
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEventMutation.mutate(event._id);
    }
  };

  const getEventStatus = () => {
    if (!event.dateTimeData?.date && !event.dateTimeData?.startDate) {
      return { status: 'draft', color: 'default', label: 'Draft' };
    }
    
    const eventDate = event.dateTimeData.date || event.dateTimeData.startDate;
    const now = new Date();
    const eventDateObj = new Date(eventDate);
    
    if (eventDateObj < now) {
      return { status: 'past', color: 'default', label: 'Past' };
    } else if (eventDateObj > now) {
      return { status: 'upcoming', color: 'primary', label: 'Upcoming' };
    } else {
      return { status: 'today', color: 'success', label: 'Today' };
    }
  };

  const formatEventDate = () => {
    if (event.dateTimeData?.dateMode === 'single' && event.dateTimeData.date) {
      const date = new Date(event.dateTimeData.date).toLocaleDateString();
      const time = event.dateTimeData.time ? ` at ${event.dateTimeData.time}` : '';
      return `${date}${time}`;
    } else if (event.dateTimeData?.dateMode === 'range') {
      const start = event.dateTimeData.startDate ? new Date(event.dateTimeData.startDate).toLocaleDateString() : '';
      const end = event.dateTimeData.endDate ? new Date(event.dateTimeData.endDate).toLocaleDateString() : '';
      return start && end ? `${start} - ${end}` : 'Date range set';
    }
    return 'Date TBD';
  };

  const getTotalCost = () => {
    let total = 0;
    
    event.activities?.forEach(activity => {
      if (activity.costMode === 'fixed' && activity.cost) {
        total += parseFloat(activity.cost);
      } else if (activity.costMode === 'range' && activity.minCost) {
        total += parseFloat(activity.minCost);
      }
    });

    event.activitySupports?.forEach(support => {
      if (support.costMode === 'fixed' && support.cost) {
        total += parseFloat(support.cost);
      } else if (support.costMode === 'range' && support.minCost) {
        total += parseFloat(support.minCost);
      }
    });

    return total;
  };

  const statusInfo = getEventStatus();
  const totalCost = getTotalCost();

  return (
    <Card
      component={motion.div}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4, boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          '& .action-buttons': {
            opacity: 1,
            transform: 'translateY(0)',
          }
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="h6" component="h2" noWrap sx={{ fontWeight: 600, mb: 1 }}>
              {event.eventData?.name || 'Untitled Event'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ 
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 2
            }}>
              {event.eventData?.description || 'No description provided'}
            </Typography>
          </Box>
          <Chip 
            label={statusInfo.label} 
            color={statusInfo.color} 
            size="small" 
            sx={{ ml: 1 }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CalendarToday fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {formatEventDate()}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Event fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {event.activities?.length || 0} activities
          </Typography>
        </Box>

        {totalCost > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <AttachMoney fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Est. ${totalCost.toFixed(2)}
            </Typography>
          </Box>
        )}

        {event.eventData?.tags && event.eventData.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
            {event.eventData.tags.slice(0, 3).map((tag, index) => (
              <Chip key={index} label={tag} size="small" variant="outlined" />
            ))}
            {event.eventData.tags.length > 3 && (
              <Chip label={`+${event.eventData.tags.length - 3}`} size="small" variant="outlined" />
            )}
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', pt: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', mr: 1 }}>
            {event.eventData?.name?.charAt(0) || 'E'}
          </Avatar>
          <Typography variant="caption" color="text.secondary">
            Created recently
          </Typography>
        </Box>

        <Box 
          className="action-buttons"
          sx={{ 
            display: 'flex',
            gap: 0.5,
            opacity: 0.7,
            transform: 'translateY(4px)',
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <IconButton size="small" onClick={() => onView(event)} color="primary">
            <Visibility fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onEdit(event)} color="primary">
            <Edit fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={handleDelete} 
            color="error"
            disabled={deleteEventMutation.isLoading}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};

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