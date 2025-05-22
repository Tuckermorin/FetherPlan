
import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { CheckCircle, RadioButtonUnchecked, Send, CalendarToday } from '@mui/icons-material';
import './EventProgressTracker.css';

const EventProgressTracker = ({ activities = [], hasVotingEnabled = false }) => {
  // Calculate progress based on form completion
  const getStepStatus = () => {
    // Handle empty activities array
    if (!activities || activities.length === 0) {
      return {
        step1: { complete: false, active: true },
        step2: { complete: false, active: false, skip: true },
        step3: { complete: false, active: false, ready: false }
      };
    }

    const firstActivity = activities[0];
    
    // Step 1: Event Setup
    const hasBasicInfo = firstActivity.name && firstActivity.location && firstActivity.description;
    const hasDateTime = firstActivity.dateMode === 'single' 
      ? firstActivity.date && firstActivity.time
      : firstActivity.dateMode === 'range'
      ? firstActivity.startDate && firstActivity.endDate
      : firstActivity.dateMode === 'suggestions'
      ? firstActivity.dateTimeSuggestions && firstActivity.dateTimeSuggestions.some(s => s.startDate)
      : false;
    
    const step1Complete = hasBasicInfo && hasDateTime;
    
    // Step 2: Only relevant if voting/suggestions are enabled
    const needsUserInput = hasVotingEnabled || firstActivity.allowSuggestions || firstActivity.dateMode === 'suggestions';
    const step2Complete = false; // This would be updated when we have user responses
    
    // Step 3: Ready to finalize
    const step3Complete = false; // This would be true when admin confirms final details
    
    return {
      step1: { complete: step1Complete, active: !step1Complete },
      step2: { 
        complete: step2Complete, 
        active: step1Complete && needsUserInput && !step2Complete,
        skip: !needsUserInput 
      },
      step3: { 
        complete: step3Complete, 
        active: (step1Complete && !needsUserInput) || (step1Complete && step2Complete),
        ready: step1Complete && (!needsUserInput || step2Complete)
      }
    };
  };

  const stepStatus = getStepStatus();

  const StepIcon = ({ complete, active }) => {
    if (complete) {
      return <CheckCircle className="step-icon complete" />;
    } else if (active) {
      return <RadioButtonUnchecked className="step-icon active" />;
    } else {
      return <RadioButtonUnchecked className="step-icon inactive" />;
    }
  };

  const getStepDetails = () => {
    // Handle empty activities array
    if (!activities || activities.length === 0) {
      return { 
        missingFields: ['Activity name', 'Location', 'Description', 'Date & time'] 
      };
    }

    const firstActivity = activities[0];
    const missingFields = [];
    
    if (!firstActivity.name) missingFields.push('Activity name');
    if (!firstActivity.location) missingFields.push('Location');
    if (!firstActivity.description) missingFields.push('Description');
    
    if (firstActivity.dateMode === 'single' && (!firstActivity.date || !firstActivity.time)) {
      missingFields.push('Date & time');
    } else if (firstActivity.dateMode === 'range' && (!firstActivity.startDate || !firstActivity.endDate)) {
      missingFields.push('Date range');
    } else if (firstActivity.dateMode === 'suggestions' && (!firstActivity.dateTimeSuggestions || !firstActivity.dateTimeSuggestions.some(s => s.startDate))) {
      missingFields.push('Date options');
    }

    return { missingFields };
  };

  const { missingFields } = getStepDetails();

  return (
    <Box className="progress-tracker">
      <Typography variant="h6" className="progress-title">
        Event Progress
      </Typography>
      
      <Box className="progress-steps">
        {/* Step 1: Event Setup */}
        <Box className="progress-step">
          <Box className="step-indicator">
            <StepIcon complete={stepStatus.step1.complete} active={stepStatus.step1.active} />
            <Box className={`step-line ${stepStatus.step1.complete ? 'complete' : ''}`} />
          </Box>
          <Box className="step-content">
            <Typography variant="subtitle1" className="step-title">
              Event Setup
            </Typography>
            <Typography variant="body2" className="step-description">
              Add activity details and timing
            </Typography>
            {stepStatus.step1.active && missingFields.length > 0 && (
              <Box className="step-status">
                <Typography variant="caption" color="text.secondary">
                  Still needed: {missingFields.join(', ')}
                </Typography>
              </Box>
            )}
            {stepStatus.step1.complete && (
              <Chip 
                label="Complete" 
                size="small" 
                className="status-chip complete"
                icon={<CheckCircle />}
              />
            )}
          </Box>
        </Box>

        {/* Step 2: Gather Input (conditional) */}
        {!stepStatus.step2.skip && (
          <Box className="progress-step">
            <Box className="step-indicator">
              <StepIcon complete={stepStatus.step2.complete} active={stepStatus.step2.active} />
              <Box className={`step-line ${stepStatus.step2.complete ? 'complete' : ''}`} />
            </Box>
            <Box className="step-content">
              <Typography variant="subtitle1" className="step-title">
                Gather User Input
              </Typography>
              <Typography variant="body2" className="step-description">
                Collect responses from participants
              </Typography>
              {stepStatus.step2.active && (
                <Box className="step-status">
                  <Chip 
                    label="Ready to Send" 
                    size="small" 
                    className="status-chip ready"
                    icon={<Send />}
                  />
                </Box>
              )}
              {!stepStatus.step2.active && !stepStatus.step2.complete && (
                <Typography variant="caption" color="text.secondary">
                  Complete event setup first
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Step 3: Finalize Event */}
        <Box className="progress-step final">
          <Box className="step-indicator">
            <StepIcon complete={stepStatus.step3.complete} active={stepStatus.step3.active} />
          </Box>
          <Box className="step-content">
            <Typography variant="subtitle1" className="step-title">
              Finalize & Send Invites
            </Typography>
            <Typography variant="body2" className="step-description">
              Confirm details and send calendar invites
            </Typography>
            {stepStatus.step3.ready && (
              <Box className="step-status">
                <Chip 
                  label="Ready to Confirm" 
                  size="small" 
                  className="status-chip ready"
                  icon={<CalendarToday />}
                />
              </Box>
            )}
            {!stepStatus.step3.ready && (
              <Typography variant="caption" color="text.secondary">
                {stepStatus.step2.skip ? 'Complete event setup' : 'Waiting for user responses'}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Summary */}
      <Box className="progress-summary">
        <Typography variant="body2" color="text.secondary">
          {stepStatus.step1.complete && stepStatus.step3.ready
            ? '🎉 Ready to finalize your event!'
            : stepStatus.step1.complete
            ? '✨ Great progress! Keep going.'
            : '📝 Fill out the event details to get started.'
          }
        </Typography>
      </Box>
    </Box>
  );
};

export default EventProgressTracker;