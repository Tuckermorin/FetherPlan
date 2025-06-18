import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface UnsavedChangesGuardProps {
  isDirty: boolean;
  children: (props: { attemptNavigate: (navigateFn: () => void) => void }) => React.ReactNode;
}

const UnsavedChangesGuard: React.FC<UnsavedChangesGuardProps> = ({ isDirty, children }) => {
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const handleClose = () => setPendingAction(null);

  const attemptNavigate = (action: () => void) => {
    if (!isDirty) {
      action();
      return;
    }
    setPendingAction(() => action);
  };

  const confirmLeave = () => {
    if (pendingAction) {
      pendingAction();
    }
  };

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
};

export default UnsavedChangesGuard;
