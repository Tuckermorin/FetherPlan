import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';

export default function CTASection({ onCreate }) {
  return (
    <Box sx={{ py: 12, background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ fontWeight: 700, color: '#1f2937', mb: 3 }}
          >
            No More Massive Text or Email Threads...
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 5, lineHeight: 1.6, fontWeight: 400 }}
          >
            Are you on your fifth attempt to plan that girls trip? That family reunion? That couples dinner date? We're all busy, it can be a burden to plan these events.
            Fether is here to change that. Our platform is designed to streamline the entire process, making it easy.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={onCreate}
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Start Planning Today
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
