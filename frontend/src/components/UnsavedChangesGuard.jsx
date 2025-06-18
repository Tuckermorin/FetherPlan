import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

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
      <Dialog open={Boolean(pendingAction)} onClose={handleClose} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle>Unsaved Changes</DialogTitle>
        <DialogContent>
          <Typography>You have unsaved changes—are you sure you want to leave?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="outlined">
            Stay
          </Button>
          <Button onClick={confirmLeave} color="primary" variant="contained">
            Leave
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}