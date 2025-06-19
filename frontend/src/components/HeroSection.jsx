import React from 'react';
import { Box, Container, Typography, Fade, Button } from '@mui/material';

export default function HeroSection({ onCreate }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        pt: 8,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        },
      }}
    >
      <Container maxWidth="md">
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <Typography
              variant="h2"
              gutterBottom
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                mb: 3,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              Welcome to Fether
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 5,
                opacity: 0.95,
                fontWeight: 300,
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.4,
              }}
            >
              Planning made simple.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={onCreate}
                sx={{
                  py: 2,
                  px: 4,
                  fontSize: '1.1rem',
                  background: 'rgba(255,255,255,0.9)',
                  color: '#6366f1',
                  '&:hover': {
                    background: 'white',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Create an Event
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  py: 2,
                  px: 4,
                  fontSize: '1.1rem',
                  borderColor: 'rgba(255,255,255,0.8)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Join Event
              </Button>
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}
