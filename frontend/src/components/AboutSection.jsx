import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DateRangeIcon from '@mui/icons-material/DateRange';

export default function AboutSection() {
  return (
    <Box sx={{ py: 12, backgroundColor: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ fontWeight: 700, color: '#1f2937', mb: 3 }}
          >
            Group Planning Made Simple
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: 'auto', lineHeight: 1.6, fontWeight: 400 }}
          >
            Consolidate details, gather input, finalize your itinerary and costs, and schedule everything in one place.
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 6,
            mt: 8,
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 3,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <EventIcon sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#1f2937' }}>
              Easy Setup
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
              Create events in minutes with our intuitive interface. No complex forms or confusing steps.
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 3,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <CalendarTodayIcon sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#1f2937' }}>
              Smart Scheduling
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
              Coordinate with attendees and find the perfect time that works for everyone.
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 3,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <DateRangeIcon sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#1f2937' }}>
              Flexible Planning
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
              Handle single events, all-day activities, or multi-day experiences with equal ease.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
