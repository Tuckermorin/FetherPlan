// frontend/src/components/ErrorHandling.jsx
import React from 'react';
import {
  Box,
  Alert,
  AlertTitle,
  Button,
  Card,
  CardContent,
  Typography,
  Snackbar,
  IconButton,
} from '@mui/material';
import {
  ErrorOutline,
  Refresh,
  Home,
  Close,
  Warning,
  Info,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Generic error boundary component
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          resetError={() => this.setState({ hasError: false })}
          showDetails={process.env.NODE_ENV === 'development'}
        />
      );
    }

    return this.props.children;
  }
}

// Fallback UI for errors
export const ErrorFallback = ({ 
  error, 
  resetError, 
  showDetails = false,
  title = "Something went wrong",
  message = "We're sorry, but something unexpected happened. Please try again."
}) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh',
      p: 3,
    }}
  >
    <Card
      component={motion.div}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      sx={{ maxWidth: 500, textAlign: 'center' }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 3,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ErrorOutline sx={{ fontSize: 40, color: '#92400e' }} />
        </Box>
        
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {message}
        </Typography>

        {showDetails && error && (
          <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
            <AlertTitle>Error Details</AlertTitle>
            <Typography variant="body2" component="pre" sx={{ fontSize: '0.75rem' }}>
              {error.toString()}
            </Typography>
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={resetError}
          >
            Try Again
          </Button>
          <Button
            variant="outlined"
            startIcon={<Home />}
            onClick={() => window.location.href = '/'}
          >
            Go Home
          </Button>
        </Box>
      </CardContent>
    </Card>
  </Box>
);

// Network error component
export const NetworkError = ({ onRetry, message }) => (
  <Alert 
    severity="error" 
    action={
      onRetry && (
        <Button color="inherit" size="small" onClick={onRetry}>
          Retry
        </Button>
      )
    }
    sx={{ mb: 2 }}
  >
    <AlertTitle>Connection Error</AlertTitle>
    {message || "Unable to connect to the server. Please check your internet connection and try again."}
  </Alert>
);

// Form validation error
export const FormError = ({ message, field }) => (
  <Alert severity="error" sx={{ mb: 2 }}>
    {field && <AlertTitle>Error in {field}</AlertTitle>}
    {message}
  </Alert>
);

// Toast notification system
export const useNotification = () => {
  const [notification, setNotification] = React.useState({
    open: false,
    message: '',
    severity: 'info',
    autoHideDuration: 6000,
  });

  const showNotification = (message, severity = 'info', autoHideDuration = 6000) => {
    setNotification({
      open: true,
      message,
      severity,
      autoHideDuration,
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const NotificationComponent = () => (
    <Snackbar
      open={notification.open}
      autoHideDuration={notification.autoHideDuration}
      onClose={hideNotification}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={hideNotification}
        severity={notification.severity}
        sx={{ width: '100%' }}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={hideNotification}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );

  return {
    showNotification,
    hideNotification,
    NotificationComponent,
    showSuccess: (message) => showNotification(message, 'success'),
    showError: (message) => showNotification(message, 'error'),
    showWarning: (message) => showNotification(message, 'warning'),
    showInfo: (message) => showNotification(message, 'info'),
  };
};

// API error handler utility
export const handleApiError = (error, showNotification) => {
  console.error('API Error:', error);
  
  if (!navigator.onLine) {
    showNotification('You appear to be offline. Please check your connection.', 'error');
    return;
  }

  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const data = error.response.data;
    
    switch (status) {
      case 400:
        showNotification(data.message || 'Invalid request. Please check your input.', 'error');
        break;
      case 401:
        showNotification('You are not authorized. Please log in again.', 'error');
        break;
      case 403:
        showNotification('Access denied. You do not have permission for this action.', 'error');
        break;
      case 404:
        showNotification('The requested resource was not found.', 'error');
        break;
      case 429:
        showNotification('Too many requests. Please wait a moment and try again.', 'warning');
        break;
      case 500:
        showNotification('Server error. Please try again later.', 'error');
        break;
      default:
        showNotification(data.message || 'Something went wrong. Please try again.', 'error');
    }
  } else if (error.request) {
    // Network error
    showNotification('Unable to connect to the server. Please check your internet connection.', 'error');
  } else {
    // Other error
    showNotification('An unexpected error occurred. Please try again.', 'error');
  }
};

// Inline error message
export const InlineError = ({ message, icon: Icon = Warning }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      p: 2,
      bgcolor: 'error.light',
      color: 'error.contrastText',
      borderRadius: 1,
      mb: 2,
    }}
  >
    <Icon fontSize="small" />
    <Typography variant="body2">{message}</Typography>
  </Box>
);

// Empty state component
export const EmptyState = ({ 
  title = "No data found",
  description = "There's nothing here yet.",
  icon: Icon = Info,
  action,
  actionText = "Get Started"
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 8,
      textAlign: 'center',
    }}
  >
    <Box
      sx={{
        width: 80,
        height: 80,
        mx: 'auto',
        mb: 3,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon sx={{ fontSize: 40, color: 'primary.main' }} />
    </Box>
    
    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
      {title}
    </Typography>
    
    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
      {description}
    </Typography>

    {action && (
      <Button variant="contained" onClick={action}>
        {actionText}
      </Button>
    )}
  </Box>
);