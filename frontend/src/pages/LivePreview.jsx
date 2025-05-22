import React, { useContext } from 'react';
import { Box, Typography, Paper, Card, CardContent, Divider } from '@mui/material';
import { StepContext } from '../App';

const LivePreview = () => {
  const { activeStep } = useContext(StepContext);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Live Preview
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="body1" paragraph>
          As you create your event, a live preview will be displayed here.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Card sx={{ bgcolor: '#f5f5f5', mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Current Stage
            </Typography>
            <Typography variant="h6">
              {activeStep === 0 ? 'Basic Information' : 
               activeStep === 1 ? 'Date & Time' : 
               activeStep === 2 ? 'Activities' : 'Review'}
            </Typography>
          </CardContent>
        </Card>
        <Typography variant="body2" color="text.secondary">
          Fill out the form on the right to see your event details here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default LivePreview;