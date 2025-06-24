import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import { useEventByCode } from '../hooks/useApi';

export default function JoinEvent({ onBack, defaultCode = '' }) {
  const [code, setCode] = useState(defaultCode);
  const [submitted, setSubmitted] = useState(defaultCode);
  const { data: event, error, isLoading } = useEventByCode(submitted, { enabled: !!submitted });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim()) setSubmitted(code.trim());
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom align="center">
        Join Event
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4, textAlign: 'center' }}>
        <TextField
          label="Event Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" disabled={!code}>
          Join
        </Button>
      </Box>
      {isLoading && <Typography align="center">Loading...</Typography>}
      {error && <Typography color="error" align="center">Event not found</Typography>}
      {event && (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>{event.eventData?.name}</Typography>
          <Typography variant="body1" gutterBottom>{event.eventData?.description}</Typography>
        </Box>
      )}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button onClick={onBack}>Back</Button>
      </Box>
    </Container>
  );
}
