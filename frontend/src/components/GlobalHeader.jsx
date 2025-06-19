import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';

export default function GlobalHeader({ onHome }) {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(229, 231, 235, 0.8)',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
            }}
            onClick={onHome}
          >
            <img
              src="/Fether_Logo_transparent.png"
              alt="Fether Logo"
              style={{ height: '100px', width: 'auto' }}
            />
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: '#6366f1', fontSize: '3.50rem' }}
            >
              Fether
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="text"
              sx={{
                color: '#6b7280',
                '&:hover': { backgroundColor: 'rgba(107, 114, 128, 0.1)' },
              }}
            >
              About
            </Button>
            <Button
              variant="text"
              sx={{
                color: '#6b7280',
                '&:hover': { backgroundColor: 'rgba(107, 114, 128, 0.1)' },
              }}
            >
              Features
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{
                ml: 1,
                borderColor: '#d1d5db',
                color: '#374151',
                '&:hover': {
                  borderColor: '#6366f1',
                  backgroundColor: 'rgba(99, 102, 241, 0.04)',
                },
              }}
            >
              Log In
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                },
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
