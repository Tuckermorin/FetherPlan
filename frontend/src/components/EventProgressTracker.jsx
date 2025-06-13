import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import './EventProgressTracker.css';

const EventProgressTracker = ({ activities = [] }) => {
  const first = activities[0] || {};
  const step1Complete =
    first.name && first.location && first.description && first.date && first.time;

  const status = {
    step1: { complete: !!step1Complete, active: !step1Complete },
    step2: { complete: false, active: !!step1Complete },
    step3: { complete: false, active: false },
    step4: { complete: false, active: false },
    step5: { complete: false, active: false },
  };

  const StepIcon = ({ complete, active }) => {
    if (complete) return <CheckCircle className="step-icon complete" />;
    if (active) return <RadioButtonUnchecked className="step-icon active" />;
    return <RadioButtonUnchecked className="step-icon inactive" />;
  };

  return (
    <Box className="progress-tracker">
      <Typography variant="h6" className="progress-title">
        Event Progress
      </Typography>
      <Box className="progress-steps">
        <Box className="progress-step">
          <Box className="step-indicator">
            <StepIcon {...status.step1} />
            <Box className={`step-line ${status.step1.complete ? 'complete' : ''}`} />
          </Box>
          <Box className="step-content">
            <Typography variant="subtitle1" className="step-title">
              Create Event
            </Typography>
            <Typography variant="body2" className="step-description">
              Set up the basics
            </Typography>
            {status.step1.complete && (
              <Chip label="Complete" size="small" className="status-chip complete" icon={<CheckCircle />} />
            )}
          </Box>
        </Box>

        <Box className="progress-step">
          <Box className="step-indicator">
            <StepIcon {...status.step2} />
            <Box className="step-line" />
          </Box>
          <Box className="step-content">
            <Typography variant="subtitle1" className="step-title">
              Gathering Data
            </Typography>
            <Typography variant="body2" className="step-description">
              Waiting for participant responses
            </Typography>
          </Box>
        </Box>

        <Box className="progress-step">
          <Box className="step-indicator">
            <StepIcon {...status.step3} />
            <Box className="step-line" />
          </Box>
          <Box className="step-content">
            <Typography variant="subtitle1" className="step-title">
              Confirming Details
            </Typography>
            <Typography variant="body2" className="step-description">
              Finalize the event plan
            </Typography>
          </Box>
        </Box>

        <Box className="progress-step">
          <Box className="step-indicator">
            <StepIcon {...status.step4} />
            <Box className="step-line" />
          </Box>
          <Box className="step-content">
            <Typography variant="subtitle1" className="step-title">
              Participant Confirmation
            </Typography>
            <Typography variant="body2" className="step-description">
              Awaiting final confirmations
            </Typography>
          </Box>
        </Box>

        <Box className="progress-step final">
          <Box className="step-indicator">
            <StepIcon {...status.step5} />
          </Box>
          <Box className="step-content">
            <Typography variant="subtitle1" className="step-title">
              Finish Line!
            </Typography>
            <Typography variant="body2" className="step-description">
              All set and ready to go
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EventProgressTracker;
