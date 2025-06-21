// frontend/src/pages/CreateYourEvent.jsx (Enhanced Version)
import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  Container,
  Button,
  Typography,
  Paper,
  Box,
  Grid,
  CircularProgress,
  Chip,
} from '@mui/material';
import { ArrowBack, Save, CalendarToday, Event, AttachMoney } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Enhanced components
import { FormTextField, FormDatePicker, FormTimePicker, FormToggleGroup, FormSwitch, validationRules } from '../components/FormComponents';
import { StepProgress, PulseLoader } from '../components/LoadingStates';
import { useNotification, ErrorBoundary } from '../components/ErrorHandling';
import { useCreateEvent } from '../hooks/useApi';
import UnsavedChangesGuard from '../components/UnsavedChangesGuard';
import PreviewEvent from './PreviewEvent';
import ActivityOptionsSection from '../components/ActivityOptionsSection';
import ActivitySupportSection from '../components/ActivitySupportSection';

import './CreateYourEvent.css';

const FORM_STEPS = [
  'Event Details',
  'Activities',
  'Support Options',
  'Review & Publish'
];

export default function CreateYourEvent({ onBack, editEvent = null }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [activities, setActivities] = useState(editEvent?.activities || []);
  const [activitySupports, setActivitySupports] = useState(editEvent?.activitySupports || []);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [publishedEvent, setPublishedEvent] = useState(null);
  
  const { showNotification, NotificationComponent } = useNotification();
  const createEventMutation = useCreateEvent({
    onSuccess: (data) => {
      setIsSubmitting(false);
      setIsPublished(true);
      setPublishedEvent(data);
      showNotification('Event created successfully!', 'success');
    },
    onError: () => {
      setIsSubmitting(false);
    }
  });

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    watch,
    formState: { isDirty },
    reset,
  } = useForm({
    defaultValues: {
      name: editEvent?.eventData?.name || '',
      description: editEvent?.eventData?.description || '',
      dateMode: editEvent?.dateTimeData?.dateMode || 'single',
      date: editEvent?.dateTimeData?.date || '',
      time: editEvent?.dateTimeData?.time || '',
      startDate: editEvent?.dateTimeData?.startDate || '',
      endDate: editEvent?.dateTimeData?.endDate || '',
      allowParticipantSelection: editEvent?.dateTimeData?.allowParticipantSelection || false,
      requiredDayCount: editEvent?.dateTimeData?.requiredDayCount || 1,
      isPublic: editEvent?.eventData?.isPublic || true,
      maxParticipants: editEvent?.eventData?.maxParticipants || '',
      rsvpDeadline: editEvent?.eventData?.rsvpDeadline || '',
      tags: editEvent?.eventData?.tags || [],
    },
    mode: 'onChange',
  });

  const watchedValues = watch();

  // Activity Support Categories
  const supportCategories = {
    transportation: {
      name: 'Transportation',
      options: ['Airfare', 'Rental Car', 'Gas', 'Public Transit', 'Rideshare'],
      conflicts: ['Airfare', 'Rental Car']
    },
    accommodation: {
      name: 'Accommodation', 
      options: ['Hotel', 'Airbnb', 'Family/Friends', 'Camping'],
      conflicts: ['Hotel', 'Airbnb', 'Family/Friends', 'Camping']
    },
    meals: {
      name: 'Meals',
      options: ['Restaurant', 'Catering', 'Potluck', 'Self-Prepared'],
      conflicts: []
    }
  };

  const formIsDirty = useMemo(
    () => isDirty || activities.length > 0 || activitySupports.length > 0,
    [isDirty, activities.length, activitySupports.length]
  );

  // Activity management functions
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

  // Step validation
  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return watchedValues.name && 
               ((watchedValues.dateMode === 'single' && watchedValues.date) ||
                (watchedValues.dateMode === 'range' && watchedValues.startDate && watchedValues.endDate));
      case 2:
        return true; // Activities are optional
      case 3:
        return true; // Support options are optional
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < 4 && isStepValid(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handlePreview = () => {
    if (isStepValid(1)) {
      setShowPreview(true);
    }
  };

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    
    const payload = {
      eventData: {
        name: formData.name,
        description: formData.description,
        isPublic: formData.isPublic,
        maxParticipants: formData.maxParticipants,
        rsvpDeadline: formData.rsvpDeadline,
        tags: formData.tags,
      },
      dateTimeData: {
        dateMode: formData.dateMode,
        date: formData.date,
        time: formData.time,
        startDate: formData.startDate,
        endDate: formData.endDate,
        allowParticipantSelection: formData.allowParticipantSelection,
        requiredDayCount: formData.requiredDayCount,
      },
      activities,
      activitySupports,
      requiredActivityCount: '',
      requiredSupportCount: ''
    };

    try {
      await createEventMutation.mutateAsync(payload);
      // Success is handled in the mutation onSuccess callback
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  // Success/Published state
  if (isPublished && publishedEvent) {
    return (
      <Container maxWidth="md" className="single-event-container">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            py: 8,
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              mx: 'auto',
              mb: 4,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <Box sx={{ fontSize: 60 }}>🎉</Box>
          </Box>
          
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: 'success.main' }}>
            Event Published!
          </Typography>
          
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            "{publishedEvent.eventData?.name || 'Your Event'}"
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600 }}>
            Your event has been successfully created and published. You can now share it with participants 
            and start collecting their responses. The event link and management options are ready for you.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                // Navigate to events list or event view
                setIsPublished(false);
                setPublishedEvent(null);
                setCurrentStep(1);
                reset();
                setActivities([]);
                setActivitySupports([]);
                onBack(); // Go back to previous page or events list
              }}
              sx={{
                py: 2,
                px: 4,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                },
              }}
            >
              View All Events
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              onClick={() => {
                // Create another event
                setIsPublished(false);
                setPublishedEvent(null);
                setCurrentStep(1);
                reset();
                setActivities([]);
                setActivitySupports([]);
              }}
              sx={{ py: 2, px: 4 }}
            >
              Create Another Event
            </Button>
          </Box>

          <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Event Summary
            </Typography>
            <Grid container spacing={2} sx={{ textAlign: 'left' }}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Activities: {activities.length}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Support Options: {activitySupports.length}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Event Type: {watchedValues.dateMode === 'single' ? 'Single Day' : 'Multi-Day'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Status: Published
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
        
        <NotificationComponent />
      </Container>
    );
  }

  if (showPreview) {
    return (
      <PreviewEvent
        eventData={{
          name: watchedValues.name,
          description: watchedValues.description,
          isPublic: watchedValues.isPublic,
          maxParticipants: watchedValues.maxParticipants,
          rsvpDeadline: watchedValues.rsvpDeadline,
          tags: watchedValues.tags,
        }}
        dateTimeData={{
          dateMode: watchedValues.dateMode,
          date: watchedValues.date,
          time: watchedValues.time,
          startDate: watchedValues.startDate,
          endDate: watchedValues.endDate,
          allowParticipantSelection: watchedValues.allowParticipantSelection,
          requiredDayCount: watchedValues.requiredDayCount,
        }}
        activities={activities}
        activitySupports={activitySupports}
        requiredActivityCount=""
        requiredSupportCount=""
        onEdit={() => setShowPreview(false)}
        onConfirm={handleSubmit(onSubmit)}
      />
    );
  }

  return (
    <ErrorBoundary>
      <UnsavedChangesGuard isDirty={formIsDirty}>
        {({ attemptNavigate }) => (
          <Container maxWidth="md" className="single-event-container">
            <Button
              variant="text"
              onClick={() => attemptNavigate(onBack)}
              sx={{
                mb: 3,
                color: 'primary.main',
                '&:hover': { backgroundColor: 'action.hover' },
                px: 1,
                py: 1,
              }}
              startIcon={<ArrowBack />}
            >
              Back to previous page
            </Button>

            <div className="single-event-header">
              <Typography variant="h4" gutterBottom className="single-event-title">
                {editEvent ? 'Edit Event' : 'Create Your Event'}
              </Typography>
              <Typography variant="body1" color="text.secondary" className="single-event-subtitle">
                Plan meaningful adventures and create lasting memories. It can be as simple as a dinner date with friends or a multi-day vacation with multiple activities.
              </Typography>
            </div>

            <StepProgress 
              currentStep={currentStep} 
              totalSteps={4} 
              stepNames={FORM_STEPS}
            />

            <Paper elevation={2} className="single-event-paper">
              <form onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                        Event Details
                      </Typography>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <FormTextField
                            name="name"
                            control={control}
                            label="Event Name"
                            required
                            rules={validationRules.required('Event name')}
                            placeholder="e.g., Weekend Getaway, Birthday Celebration"
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <FormTextField
                            name="description"
                            control={control}
                            label="Event Description"
                            multiline
                            rows={3}
                            placeholder="Describe your event..."
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Typography variant="subtitle1" gutterBottom>
                            Date & Time Selection
                          </Typography>
                          
                          <FormToggleGroup
                            name="dateMode"
                            control={control}
                            options={[
                              { value: 'single', label: 'Set Date' },
                              { value: 'range', label: 'Date Range' }
                            ]}
                            required
                            sx={{ mb: 2 }}
                          />
                        </Grid>

                        {watchedValues.dateMode === 'single' && (
                          <>
                            <Grid item xs={12} sm={6}>
                              <FormDatePicker
                                name="date"
                                control={control}
                                label="Date"
                                required
                                rules={validationRules.required('Date')}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <FormTimePicker
                                name="time"
                                control={control}
                                label="Time"
                              />
                            </Grid>
                          </>
                        )}

                        {watchedValues.dateMode === 'range' && (
                          <>
                            <Grid item xs={12} sm={6}>
                              <FormDatePicker
                                name="startDate"
                                control={control}
                                label="Start Date"
                                required
                                rules={validationRules.required('Start date')}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <FormDatePicker
                                name="endDate"
                                control={control}
                                label="End Date"
                                required
                                rules={validationRules.required('End date')}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <FormSwitch
                                name="allowParticipantSelection"
                                control={control}
                                label="Ask participants to select a number of days within this range?"
                              />
                            </Grid>
                            {watchedValues.allowParticipantSelection && (
                              <Grid item xs={12} sm={6}>
                                <FormTextField
                                  name="requiredDayCount"
                                  control={control}
                                  label="Required Days"
                                  type="number"
                                  required
                                  rules={{
                                    ...validationRules.required('Required days'),
                                    ...validationRules.positiveNumber,
                                  }}
                                />
                              </Grid>
                            )}
                          </>
                        )}
                      </Grid>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <PulseLoader loading={false}>
                        <ActivityOptionsSection
                          activities={activities}
                          addActivity={addActivity}
                          updateActivity={updateActivity}
                          removeActivity={removeActivity}
                        />
                      </PulseLoader>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ActivitySupportSection
                        supportCategories={supportCategories}
                        activitySupports={activitySupports}
                        addActivitySupport={addActivitySupport}
                        updateActivitySupport={updateActivitySupport}
                        removeActivitySupport={removeActivitySupport}
                      />
                    </motion.div>
                  )}

                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Typography variant="h5" gutterBottom>
                        Review & Publish
                      </Typography>
                      
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Review your event details below. Once published, participants will be able to view and respond to your event.
                      </Typography>

                      {/* Event Summary Card */}
                      <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                          {watchedValues.name || 'Unnamed Event'}
                        </Typography>
                        
                        {watchedValues.description && (
                          <Typography variant="body1" color="text.secondary" paragraph>
                            {watchedValues.description}
                          </Typography>
                        )}

                        <Grid container spacing={3} sx={{ mt: 2 }}>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <CalendarToday sx={{ mr: 2, color: 'primary.main' }} />
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                  Date & Time
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {watchedValues.dateMode === 'single' 
                                    ? `${watchedValues.date || 'Not set'}${watchedValues.time ? ` at ${watchedValues.time}` : ''}`
                                    : `${watchedValues.startDate || 'Start not set'} to ${watchedValues.endDate || 'End not set'}`
                                  }
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Event sx={{ mr: 2, color: 'primary.main' }} />
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                  Activities
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {activities.length} activities configured
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Box sx={{ mr: 2, color: 'primary.main' }}>🎯</Box>
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                  Support Options
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {activitySupports.length} support options added
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <AttachMoney sx={{ mr: 2, color: 'primary.main' }} />
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                  Estimated Cost
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {(() => {
                                    let total = 0;
                                    activities.forEach(a => {
                                      if (a.costMode === 'fixed' && a.cost) total += parseFloat(a.cost);
                                      else if (a.costMode === 'range' && a.minCost) total += parseFloat(a.minCost);
                                    });
                                    activitySupports.forEach(s => {
                                      if (s.costMode === 'fixed' && s.cost) total += parseFloat(s.cost);
                                      else if (s.costMode === 'range' && s.minCost) total += parseFloat(s.minCost);
                                    });
                                    return total > 0 ? `${total.toFixed(2)}` : 'Free';
                                  })()}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>

                      {/* Activity Details */}
                      {activities.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            Activities ({activities.length})
                          </Typography>
                          <Grid container spacing={2}>
                            {activities.map((activity, index) => (
                              <Grid item xs={12} sm={6} key={activity.id}>
                                <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    {activity.name || `Activity ${index + 1}`}
                                  </Typography>
                                  {activity.timeCommitment && (
                                    <Typography variant="body2" color="text.secondary">
                                      Time: {activity.timeCommitment}
                                    </Typography>
                                  )}
                                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                    <Chip 
                                      label={activity.isVotable ? 'Votable' : 'Fixed'} 
                                      size="small" 
                                      color={activity.isVotable ? 'primary' : 'default'}
                                    />
                                    {activity.cost && (
                                      <Chip label={`${activity.cost}`} size="small" variant="outlined" />
                                    )}
                                  </Box>
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      )}

                      {/* Support Options Details */}
                      {activitySupports.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            Support Options ({activitySupports.length})
                          </Typography>
                          <Grid container spacing={2}>
                            {activitySupports.map((support, index) => (
                              <Grid item xs={12} sm={6} key={support.id}>
                                <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    {support.customLabel || support.option}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Category: {support.category}
                                  </Typography>
                                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                    <Chip 
                                      label={support.isVotable ? 'Votable' : 'Fixed'} 
                                      size="small" 
                                      color={support.isVotable ? 'primary' : 'default'}
                                    />
                                    {support.cost && (
                                      <Chip label={`${support.cost}`} size="small" variant="outlined" />
                                    )}
                                  </Box>
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      )}

                      {/* Ready to Publish */}
                      <Box sx={{ 
                        p: 3, 
                        bgcolor: 'primary.light', 
                        color: 'primary.contrastText',
                        borderRadius: 2, 
                        textAlign: 'center',
                        mb: 2
                      }}>
                        <Typography variant="h6" gutterBottom>
                          Ready to Publish! 🚀
                        </Typography>
                        <Typography variant="body2">
                          Your event is complete and ready to share with participants. 
                          Click "Publish Event" to make it live.
                        </Typography>
                      </Box>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mt: 4, 
                  pt: 3, 
                  borderTop: '1px solid',
                  borderColor: 'divider'
                }}>
                  <Button
                    variant="outlined"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={handlePreview}
                      disabled={!isStepValid(1)}
                    >
                      Preview Event
                    </Button>

                    {currentStep < 4 ? (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={!isStepValid(currentStep)}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting || !isStepValid(1)}
                        startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
                      >
                        {isSubmitting ? 'Creating...' : editEvent ? 'Update Event' : 'Create Event'}
                      </Button>
                    )}
                  </Box>
                </Box>
              </form>
            </Paper>

            <NotificationComponent />
          </Container>
        )}
      </UnsavedChangesGuard>
    </ErrorBoundary>
  );
}