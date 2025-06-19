import React from 'react';
import { Box, Container, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{ py: 8, backgroundColor: '#1f2937', color: 'white' }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
            gap: 6,
            mb: 6,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, mb: 3, color: '#6366f1' }}
            >
              Fether
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af', lineHeight: 1.6 }}>
              Making event planning simple, collaborative, and enjoyable for everyone.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Product
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" sx={{ color: '#9ca3af', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                Features
              </Typography>
              <Typography variant="body2" sx={{ color: '#9ca3af', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                Pricing
              </Typography>
              <Typography variant="body2" sx={{ color: '#9ca3af', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                Templates
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" sx={{ color: '#9ca3af', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                About Us
              </Typography>
              <Typography variant="body2" sx={{ color: '#9ca3af', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                Contact
              </Typography>
              <Typography variant="body2" sx={{ color: '#9ca3af', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                Careers
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" sx={{ color: '#9ca3af', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                Help Center
              </Typography>
              <Typography variant="body2" sx={{ color: '#9ca3af', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                Privacy Policy
              </Typography>
              <Typography variant="body2" sx={{ color: '#9ca3af', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                Terms of Service
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ pt: 6, borderTop: '1px solid #374151', textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#9ca3af' }}>
            © 2025 Fether. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
