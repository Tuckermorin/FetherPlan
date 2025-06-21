// frontend/src/components/LoadingStates.jsx
import React from 'react';
import {
  Box,
  CircularProgress,
  Skeleton,
  Card,
  CardContent,
  Typography,
  LinearProgress,
} from '@mui/material';
import { motion } from 'framer-motion';

// General loading spinner
export const LoadingSpinner = ({ size = 40, message = 'Loading...' }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      py: 4,
    }}
  >
    <CircularProgress size={size} />
    <Typography variant="body2" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

// Button loading state
export const LoadingButton = ({ children, loading, ...props }) => (
  <Box sx={{ position: 'relative', display: 'inline-block' }}>
    <props.component
      {...props}
      disabled={loading || props.disabled}
      sx={{
        ...props.sx,
        ...(loading && {
          color: 'transparent',
        }),
      }}
    >
      {children}
    </props.component>
    {loading && (
      <CircularProgress
        size={24}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          marginTop: '-12px',
          marginLeft: '-12px',
          color: 'primary.main',
        }}
      />
    )}
  </Box>
);

// Skeleton for event cards
export const EventCardSkeleton = () => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Skeleton variant="text" width="60%" height={32} />
      <Skeleton variant="text" width="100%" height={20} sx={{ mt: 1 }} />
      <Skeleton variant="text" width="80%" height={20} />
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <Skeleton variant="rectangular" width={80} height={32} />
        <Skeleton variant="rectangular" width={120} height={32} />
      </Box>
    </CardContent>
  </Card>
);

// Form field skeleton
export const FormFieldSkeleton = () => (
  <Box sx={{ mb: 2 }}>
    <Skeleton variant="text" width="30%" height={20} />
    <Skeleton variant="rectangular" width="100%" height={56} sx={{ mt: 1 }} />
  </Box>
);

// Activity card skeleton
export const ActivityCardSkeleton = () => (
  <Card sx={{ mb: 2, p: 2 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
      <Skeleton variant="text" width="40%" height={24} />
      <Skeleton variant="circular" width={24} height={24} />
    </Box>
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
      <FormFieldSkeleton />
      <FormFieldSkeleton />
    </Box>
    <FormFieldSkeleton />
  </Card>
);

// Page loading overlay
export const PageLoadingOverlay = ({ message = 'Loading page...' }) => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}
  >
    <Card
      component={motion.div}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      sx={{
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        minWidth: 200,
      }}
    >
      <CircularProgress size={48} />
      <Typography variant="h6" color="text.primary">
        {message}
      </Typography>
    </Card>
  </Box>
);

// Progress bar for multi-step processes
export const StepProgress = ({ currentStep, totalSteps, stepNames = [] }) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Step {currentStep} of {totalSteps}
          {stepNames[currentStep - 1] && `: ${stepNames[currentStep - 1]}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {Math.round(progress)}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: 'action.hover',
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          },
        }}
      />
    </Box>
  );
};

// Pulse animation for loading states
export const PulseLoader = ({ children, loading }) => {
  if (!loading) return children;
  
  return (
    <Box
      component={motion.div}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </Box>
  );
};

// Typing indicator
export const TypingIndicator = () => (
  <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', py: 1 }}>
    <Typography variant="body2" color="text.secondary">
      Processing
    </Typography>
    {[0, 1, 2].map((i) => (
      <Box
        key={i}
        component={motion.div}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: i * 0.2,
        }}
        sx={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          backgroundColor: 'primary.main',
        }}
      />
    ))}
  </Box>
);