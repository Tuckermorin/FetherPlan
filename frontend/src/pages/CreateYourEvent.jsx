import React, { useState, useMemo } from 'react';
import {
  Container,
  Button,
  Typography,
  Paper,
  Box,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import PreviewEvent from './PreviewEvent';
import EventDetailsSection from '../components/EventDetailsSection';
import ActivityOptionsSection from '../components/ActivityOptionsSection';
import ActivitySupportSection from '../components/ActivitySupportSection';
import UnsavedChangesGuard from '../components/UnsavedChangesGuard';
import { ArrowBack } from '@mui/icons-material';
import './CreateYourEvent.css';

const initialEventData = {
  name: '',
  description: '',
  isPublic: true,
  rsvpDeadline: '',
  maxParticipants: '',
  tags: [],
  tagsString: ''
};

const initialDateTimeData = {
  dateMode: 'single',
  date: '',
  time: '',
  startDate: '',
  endDate: '',
  allowParticipantSelection: false,
  requiredDayCount: ''
};

export default function CreateYourEvent({ onBack }) {
  const [eventData, setEventData] = useState({ ...initialEventData });

  const [dateTimeData, setDateTimeData] = useState({ ...initialDateTimeData });

  const [activities, setActivities] = useState([]);
  const [activitySupports, setActivitySupports] = useState([]);
  const [requiredActivityCount, setRequiredActivityCount] = useState('');
  const [requiredSupportCount, setRequiredSupportCount] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    severity: 'success',
    message: ''
  });

  // Activity Support Categories - when one is selected, conflicting ones get disabled
  const supportCategories = {
    transportation: {
      name: 'Transportation',
      options: ['Airfare', 'Rental Car', 'Gas', 'Public Transit', 'Rideshare'],
      conflicts: ['Airfare', 'Rental Car'] // These conflict with each other
    },
    accommodation: {
      name: 'Accommodation', 
      options: ['Hotel', 'Airbnb', 'Family/Friends', 'Camping'],
      conflicts: ['Hotel', 'Airbnb', 'Family/Friends', 'Camping'] // All conflict
    },
    meals: {
      name: 'Meals',
      options: ['Restaurant', 'Catering', 'Potluck', 'Self-Prepared'],
      conflicts: []
    }
  };

  const formIsDirty = useMemo(
    () =>
      JSON.stringify(eventData) !== JSON.stringify(initialEventData) ||
      JSON.stringify(dateTimeData) !== JSON.stringify(initialDateTimeData) ||
      activities.length > 0 ||
      activitySupports.length > 0 ||
      requiredActivityCount !== '' ||
      requiredSupportCount !== '',
    [eventData, dateTimeData, activities, activitySupports, requiredActivityCount, requiredSupportCount]
  );

  const handleEventDataChange = (field, value) => {
    setEventData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateTimeChange = (field, value) => {
    setDateTimeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateModeChange = (_, mode) => {
    if (mode) {
      setDateTimeData(prev => ({
        ...prev,
        dateMode: mode,
        allowParticipantSelection: false
      }));
    }
  };

  const addActivity = () => {
    setActivities(prev => [
      ...prev,
      {
        id: Date.now(),
        name: '',
        timeCommitment: '',
        link: '',
        costMode: 'fixed',
        cost: '',
        minCost: '',
        maxCost: '',
        isVotable: false,
        equipmentEnabled: false,
        equipmentItems: '',
        isCompleted: false
      }
    ]);
  };

  const updateActivity = (id, field, value) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === id ? { ...activity, [field]: value } : activity
      )
    );
  };

  const removeActivity = (id) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  };

  const addActivitySupport = (category, option) => {
    const newSupport = {
      id: Date.now(),
      category,
      option,
      costMode: 'fixed',
      cost: '',
      minCost: '',
      maxCost: '',
      isVotable: false,
      isCompleted: false,
      customLabel: ''
    };
    setActivitySupports(prev => [...prev, newSupport]);
  };

  const updateActivitySupport = (id, field, value) => {
    setActivitySupports(prev =>
      prev.map(support =>
        support.id === id ? { ...support, [field]: value } : support
      )
    );
  };

  const removeActivitySupport = (id) => {
    setActivitySupports(prev => prev.filter(support => support.id !== id));
  };


  const handlePreview = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const handleConfirmAndSubmit = async () => {
    const payload = {
      eventData,
      dateTimeData,
      activities,
      activitySupports,
      requiredActivityCount,
      requiredSupportCount
    };

    try {
      const res = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error();
      await res.json();
      setNotification({
        open: true,
        severity: 'success',
        message: 'Event created successfully!'
      });
    } catch {
      setNotification({
        open: true,
        severity: 'error',
        message: 'Error creating event'
      });
    }
  };

  if (showPreview) {
    return (
      <PreviewEvent
        eventData={eventData}
        dateTimeData={dateTimeData}
        activities={activities}
        activitySupports={activitySupports}
        requiredActivityCount={requiredActivityCount}
        requiredSupportCount={requiredSupportCount}
        onEdit={() => setShowPreview(false)}
        onConfirm={handleConfirmAndSubmit}
      />
    );
  }


  return (
    <UnsavedChangesGuard isDirty={formIsDirty}>
      {({ attemptNavigate }) => (
        <>
    <Container maxWidth="md" className="single-event-container">
      <Button
        variant="text"
        onClick={() => attemptNavigate(onBack)}
        sx={{
          mb: 3,
          color: '#6366f1',
          '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.04)' },
          px: 1,
          py: 4,
        }}
        startIcon={<ArrowBack />}
      >
        Back to previous page
      </Button>
      <div className="single-event-header">
        <Typography variant="h4" gutterBottom className="single-event-title">
          Create Your Event
        </Typography>
        <Typography variant="body1" color="text.secondary" className="single-event-subtitle">
          Plan meaningful adventures and create lasting memories. It can be as simple as a dinner date with friends or a multi-day vacation with multiple activities.
        </Typography>
      </div>

      <Paper elevation={2} className="single-event-paper">
        <form>
          <EventDetailsSection
            eventData={eventData}
            dateTimeData={dateTimeData}
            onEventDataChange={handleEventDataChange}
            onDateTimeChange={handleDateTimeChange}
            onDateModeChange={handleDateModeChange}
          />

          <Divider sx={{ my: 4 }} />
            <ActivityOptionsSection
              activities={activities}
              addActivity={addActivity}
              updateActivity={updateActivity}
              removeActivity={removeActivity}
            />

            <Divider sx={{ my: 4 }} />

            <ActivitySupportSection
              supportCategories={supportCategories}
              activitySupports={activitySupports}
              addActivitySupport={addActivitySupport}
              updateActivitySupport={updateActivitySupport}
              removeActivitySupport={removeActivitySupport}
            />

          {/* Preview Button */}
          <Box className="preview-button-container">
            <Button 
              variant="contained" 
              size="large"
              onClick={handlePreview}
              className="preview-button"
            >
              Preview Event
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
    <Snackbar
      open={notification.open}
      autoHideDuration={6000}
      onClose={() => setNotification({ ...notification, open: false })}
    >
      <Alert
        onClose={() => setNotification({ ...notification, open: false })}
        severity={notification.severity}
        sx={{ width: '100%' }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
        </>
      )}
    </UnsavedChangesGuard>
  );
}