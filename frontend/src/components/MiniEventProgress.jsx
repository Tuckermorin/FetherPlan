import React from 'react';
import { Box } from '@mui/material';
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';

export default function MiniEventProgress({ event }) {
  const steps = [
    !!event.eventData?.name,
    event.activities?.length > 0,
    event.activitySupports?.length > 0,
    false,
    false,
  ];
  return (
    <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
      {steps.map((complete, idx) =>
        complete ? (
          <CheckCircle key={idx} fontSize="small" color="primary" />
        ) : (
          <RadioButtonUnchecked key={idx} fontSize="small" color="disabled" />
        )
      )}
    </Box>
  );
}
