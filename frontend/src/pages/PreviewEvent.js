import React from 'react';
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  Divider,
  // Chip
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import PlaceIcon from '@mui/icons-material/Place';
// import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import GroupIcon from '@mui/icons-material/Group';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';

const PreviewEvent = ({ eventData, dateMode, dateTimeSuggestions, activities, onEdit, onConfirm }) => {
  // Create a default empty itinerary array if not provided
  // const itinerary = eventData.itinerary || [];

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Preview Your Event
      </Typography>

      <Paper elevation={3} style={{ padding: '2rem', marginBottom: '2rem' }}>
        {/* Event Basic Info */}
        <Typography variant="h5" gutterBottom>
          {eventData.name || 'Unnamed Event'}
        </Typography>

        <Box display="flex" alignItems="center" mb={2}>
          <PlaceIcon color="action" style={{ marginRight: '8px' }} />
          <Typography variant="subtitle1">{eventData.location || 'No location specified'}</Typography>
        </Box>

        {dateMode === 'single' && (
          <Box display="flex" alignItems="center" mb={2}>
            <EventIcon color="action" style={{ marginRight: '8px' }} />
            <Typography variant="subtitle1">Date: {eventData.date || 'Not set'} {eventData.time ? `at ${eventData.time}` : ''}</Typography>
          </Box>
        )}

        {dateMode === 'range' && (
          <Box display="flex" alignItems="center" mb={2}>
            <EventIcon color="action" style={{ marginRight: '8px' }} />
            <Typography variant="subtitle1">
              From: {eventData.startDate || 'Not set'} To: {eventData.endDate || 'Not set'} 
              {eventData.time ? ` at ${eventData.time}` : ''}
            </Typography>
          </Box>
        )}

        {dateMode === 'suggestions' && dateTimeSuggestions && (
          <>
            <Box display="flex" alignItems="flex-start" mb={2}>
              <EventIcon color="action" style={{ marginRight: '8px', marginTop: '4px' }} />
              <Box>
                <Typography variant="subtitle1">Date & Time Options:</Typography>
                <List dense>
                  {dateTimeSuggestions.map((suggestion, index) => (
                    <ListItem key={index}>
                      <ListItemText 
                        primary={`Option ${index + 1}: ${suggestion.startDate}${suggestion.endDate ? ` to ${suggestion.endDate}` : ''}`}
                        secondary={suggestion.time ? `Time: ${suggestion.time}` : 'No time specified'}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          </>
        )}

        <Divider style={{ margin: '1.5rem 0' }} />

        {/* Description */}
        <Typography variant="h6" gutterBottom>Description</Typography>
        <Typography variant="body1" paragraph>{eventData.description || 'No description provided.'}</Typography>

        <Divider style={{ margin: '1.5rem 0' }} />

        {/* RSVP / Participants */}
        {eventData.maxParticipants && (
          <Box display="flex" alignItems="center" mb={2}>
            <GroupIcon color="action" style={{ marginRight: '8px' }} />
            <Typography variant="subtitle1">Max Participants: {eventData.maxParticipants}</Typography>
          </Box>
        )}

        {eventData.rsvpDeadline && (
          <Box display="flex" alignItems="center" mb={2}>
            <EventIcon color="action" style={{ marginRight: '8px' }} />
            <Typography variant="subtitle1">RSVP Deadline: {eventData.rsvpDeadline}</Typography>
          </Box>
        )}

        <Divider style={{ margin: '1.5rem 0' }} />

        {/* Activities */}
        <Typography variant="h6" gutterBottom>Activities</Typography>
        {activities && activities.length > 0 ? (
          <List>
            {activities.map((activity, index) => (
              <ListItem key={index} divider={index < activities.length - 1}>
                <ListItemText
                  primary={activity.name || `Activity ${index + 1}`}
                  secondary={
                    <>
                      {activity.location && `Location: ${activity.location}`}
                      {activity.costMode === 'fixed' && activity.cost ? 
                        <Box mt={1}>Cost: ${activity.cost}</Box> : 
                        activity.costMode === 'range' && activity.minCost && activity.maxCost ? 
                        <Box mt={1}>Cost Range: ${activity.minCost} - ${activity.maxCost}</Box> : null
                      }
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No activities added yet.</Typography>
        )}

        <Divider style={{ margin: '1.5rem 0' }} />

        {/* Visibility */}
        <Box display="flex" alignItems="center" mb={2}>
          {eventData.isPublic ? <PublicIcon color="primary" /> : <LockIcon color="error" />}
          <Typography variant="subtitle1" style={{ marginLeft: '0.5rem' }}>
            {eventData.isPublic ? 'Public Event' : 'Private Event'}
          </Typography>
        </Box>
      </Paper>

      {/* Action Buttons */}
      <Box display="flex" justifyContent="space-between">
        <Button variant="outlined" color="primary" onClick={onEdit}>
          Edit Event
        </Button>
        <Button variant="contained" color="success" onClick={onConfirm}>
          Confirm & Publish
        </Button>
      </Box>
    </Container>
  );
};

export default PreviewEvent;