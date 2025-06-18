import React from 'react';
import { Box, Stepper, Step, StepLabel } from '@mui/material';
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import './MobileProgressTracker.css';

const MobileProgressTracker = ({ activities = [] }) => {
  const first = activities[0] || {};
  const step1Complete =
    first.name && first.description &&
    ((first.dateMode === 'single' && first.date && first.time) ||
      (first.dateMode === 'range' && first.startDate && first.endDate) ||
      (first.dateMode === 'suggestions' && first.dateTimeSuggestions && first.dateTimeSuggestions.length));

  const status = {
    step1: { complete: !!step1Complete, active: !step1Complete },
    step2: { complete: false, active: !!step1Complete },
    step3: { complete: false, active: false },
    step4: { complete: false, active: false },
    step5: { complete: false, active: false },
  };

  const steps = [
    { label: 'Create', ...status.step1 },
    { label: 'Gather', ...status.step2 },
    { label: 'Confirm', ...status.step3 },
    { label: 'Participants', ...status.step4 },
    { label: 'Finish', ...status.step5 },
  ];

  const StepIconComponent = ({ active, completed }) => {
    if (completed) return <CheckCircle className="mobile-step-icon complete" />;
    if (active) return <RadioButtonUnchecked className="mobile-step-icon active" />;
    return <RadioButtonUnchecked className="mobile-step-icon inactive" />;
  };

  return (
    <Box className="mobile-progress-tracker">
      <Stepper alternativeLabel>
        {steps.map((step, index) => (
          <Step key={index} active={step.active} completed={step.complete}>
            <StepLabel StepIconComponent={StepIconComponent}>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default MobileProgressTracker;
