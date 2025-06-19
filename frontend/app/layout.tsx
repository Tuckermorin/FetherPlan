'use client';
import React from 'react';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import '../src/index.css';

const theme = createTheme();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
