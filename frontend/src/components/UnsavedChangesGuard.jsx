import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

export default function UnsavedChangesGuard({ isDirty, children }) {
  const [pendingPath, setPendingPath] = useState(null);

  const handleClose = () => setPendingAction(null);

  const attemptNavigate = (path) => {
    if (!isDirty) {
      window.location.href = path;
      return;
    }
    setPendingAction(() => action);
  };

  const confirmLeave = () => {
    if (pendingPath) {
      window.location.href = pendingPath;
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
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