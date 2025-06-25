// frontend/src/components/GlobalHeader.jsx
import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { Event } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

export default function GlobalHeader({ onHome, onViewEvents, currentPage }) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: 'background.paper',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
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
              sx={{ 
                fontWeight: 700, 
                color: 'primary.main', 
                fontSize: '3.50rem' 
              }}
            >
              Fether
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="text"
              sx={{
                color: 'text.secondary',
                '&:hover': { backgroundColor: 'action.hover' },
              }}
            >
              About
            </Button>
            <Button
              variant="text"
              sx={{
                color: 'text.secondary',
                '&:hover': { backgroundColor: 'action.hover' },
              }}
            >
              Features
            </Button>
            {user && onViewEvents && (
              <Button
                variant={currentPage === 'events' ? 'contained' : 'outlined'}
                startIcon={<Event />}
                onClick={onViewEvents}
                size="small"
                sx={{
                  ml: 1,
                  ...(currentPage !== 'events' && {
                    borderColor: 'divider',
                    color: 'text.primary',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'action.hover',
                    },
                  })
                }}
              >
                My Events
              </Button>
            )}
            <ThemeToggle />
            {!user && (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/login')}
                  sx={{
                    ml: 1,
                    borderColor: 'divider',
                    color: 'text.primary',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  Log In
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate('/login')}
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    },
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
            {user && (
              <Button
                variant="outlined"
                size="small"
                onClick={handleSignOut}
                sx={{
                  ml: 1,
                  borderColor: 'divider',
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                Sign Out
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}