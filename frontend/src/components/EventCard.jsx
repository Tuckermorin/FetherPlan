import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Chip,
  Avatar,
  IconButton,
  Typography,
} from '@mui/material';
import {
  Event,
  AttachMoney,
  Visibility,
  Edit,
  Delete,
  CalendarToday,
  ContentCopy,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useDeleteEvent, useCreateEvent } from '../hooks/useApi';
import { useNotification } from '../components/ErrorHandling';
import { calculateEventCost } from '../utils/costUtils';
import MiniEventProgress from './MiniEventProgress';

const EventCard = ({ event, onView, onEdit }) => {
  const { showNotification } = useNotification();
  const deleteEventMutation = useDeleteEvent({
    onSuccess: () => {
      showNotification('Event deleted successfully', 'success');
    },
  });
  const cloneEventMutation = useCreateEvent({
    onSuccess: () => {
      showNotification('Event cloned successfully', 'success');
    },
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEventMutation.mutate(event._id);
    }
  };

  const handleClone = () => {
    const { _id, eventCode, adminCode, createdAt, updatedAt, __v, ...data } = event;
    cloneEventMutation.mutate({ ...data, eventData: { ...event.eventData, name: `${event.eventData?.name || 'Event'} (Copy)` } });
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
      const start = event.dateTimeData.startDate
        ? new Date(event.dateTimeData.startDate).toLocaleDateString()
        : '';
      const end = event.dateTimeData.endDate
        ? new Date(event.dateTimeData.endDate).toLocaleDateString()
        : '';
      return start && end ? `${start} - ${end}` : 'Date range set';
    }
    return 'Date TBD';
  };

  const totalCost = calculateEventCost({
    activities: event.activities,
    supports: event.activitySupports,
  });

  const statusInfo = getEventStatus();

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
          },
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="h6" component="h2" noWrap sx={{ fontWeight: 600, mb: 1 }}>
              {event.eventData?.name || 'Untitled Event'}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                mb: 2,
              }}
            >
              {event.eventData?.description || 'No description provided'}
            </Typography>
          </Box>
          <Chip label={statusInfo.label} color={statusInfo.color} size="small" sx={{ ml: 1 }} />
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
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <IconButton size="small" onClick={() => onView(event)} color="primary">
            <Visibility fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onEdit(event)} color="primary">
            <Edit fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={handleClone} color="primary" disabled={cloneEventMutation.isLoading}>
            <ContentCopy fontSize="small" />
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
      <Box sx={{ px: 2, pb: 2 }}>
        <MiniEventProgress event={event} />
      </Box>
    </Card>
  );
};

export default EventCard;
