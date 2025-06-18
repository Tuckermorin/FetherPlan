import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

export default function UnsavedChangesGuard({ isDirty, children }) {
  const [pendingPath, setPendingPath] = useState(null);

  const handleClose = () => setPendingPath(null);

  const attemptNavigate = (path) => {
    if (!isDirty) {
      window.location.href = path;
      return;
    }
    setPendingPath(path);
  };

  const confirmLeave = () => {
    if (pendingPath) {
      window.location.href = pendingPath;
    }
  };

  return (
    <>
      {children({ attemptNavigate })}
      <Dialog open={Boolean(pendingPath)} onClose={handleClose}>
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