import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography,
  Box,
  IconButton
} from '@mui/material';
import { Warning, Close } from '@mui/icons-material';

export default function UnsavedChangesGuard({ isDirty, children }) {
  const [pendingAction, setPendingAction] = useState(null);

  const handleClose = () => setPendingAction(null);

  const attemptNavigate = (action) => {
    if (!isDirty) {
      if (typeof action === 'function') {
        action();
      } else if (typeof action === 'string') {
        window.location.href = action;
      }
      return;
    }
    if (typeof action === 'function') {
      setPendingAction(() => action);
    } else if (typeof action === 'string') {
      setPendingAction(() => () => {
        window.location.href = action;
      });
    }
  };

  const confirmLeave = () => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  return (
    <>
      {children({ attemptNavigate })}
      <Dialog 
        open={Boolean(pendingAction)} 
        onClose={handleClose} 
        PaperProps={{ 
          sx: { 
            borderRadius: 3,
            maxWidth: 480,
            background: 'white',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          } 
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: '#6b7280',
              '&:hover': {
                backgroundColor: 'rgba(107, 114, 128, 0.1)',
              },
            }}
          >
            <Close />
          </IconButton>
          
          <DialogTitle sx={{ 
            textAlign: 'center', 
            pt: 4,
            pb: 2,
            px: 4,
          }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: 2,
            }}>
              <Box sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Warning sx={{ fontSize: 30, color: '#92400e' }} />
              </Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  color: '#1f2937',
                  letterSpacing: '-0.025em',
                }}
              >
                Unsaved Changes
              </Typography>
            </Box>
          </DialogTitle>
          
          <DialogContent sx={{ px: 4, pb: 3 }}>
            <Typography 
              sx={{ 
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '1rem',
                lineHeight: 1.6,
              }}
            >
              You have unsaved changes that will be lost if you leave this page. Are you sure you want to continue?
            </Typography>
          </DialogContent>
          
          <DialogActions sx={{ 
            px: 4, 
            pb: 4, 
            pt: 2,
            gap: 2,
            justifyContent: 'center',
          }}>
            <Button 
              onClick={handleClose} 
              variant="outlined"
              size="large"
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                borderWidth: 2,
                borderColor: '#d1d5db',
                color: '#374151',
                fontSize: '1rem',
                fontWeight: 500,
                '&:hover': {
                  borderWidth: 2,
                  borderColor: '#6366f1',
                  backgroundColor: 'rgba(99, 102, 241, 0.04)',
                },
              }}
            >
              Stay on Page
            </Button>
            <Button 
              onClick={confirmLeave} 
              variant="contained"
              size="large"
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 500,
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                boxShadow: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Leave Page
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}