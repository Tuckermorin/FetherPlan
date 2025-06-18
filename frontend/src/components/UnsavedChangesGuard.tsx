import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface UnsavedChangesGuardProps {
  isDirty: boolean;
  children: (props: { attemptNavigate: (path: string) => void }) => React.ReactNode;
}

const UnsavedChangesGuard: React.FC<UnsavedChangesGuardProps> = ({ isDirty, children }) => {
  const navigate = useNavigate();
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const handleClose = () => setPendingPath(null);

  const attemptNavigate = (path: string) => {
    if (!isDirty) {
      navigate(path);
      return;
    }
    setPendingPath(path);
  };

  const confirmLeave = () => {
    if (pendingPath) {
      navigate(pendingPath);
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
};

export default UnsavedChangesGuard;
