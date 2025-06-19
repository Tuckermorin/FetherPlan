import React from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  FormControlLabel,
  Switch
} from '@mui/material';
import { EventNote, Schedule } from '@mui/icons-material';

export default function EventDetailsSection({ eventData, dateTimeData, onEventDataChange, onDateTimeChange, onDateModeChange }) {
  return (
    <Box className="craft-adventure">
      <Grid container columnSpacing={3} rowSpacing={0}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Event Name"
            value={eventData.name}
            onChange={e => onEventDataChange('name', e.target.value)}
            required
            InputProps={{ startAdornment: <EventNote /> }}
            className="form-input form-input-with-icon"
          />
        </Grid>

        <Grid item xs={12} mt={2}>
          <TextField
            fullWidth
            label="Event Description"
            multiline
            rows={3}
            value={eventData.description}
            onChange={e => onEventDataChange('description', e.target.value)}
            className="form-input"
          />
        </Grid>

        {/* Date & Time Selection */}
        <Grid item xs={12} mt={2.5}>
          <Box className="date-selection-section">
            <Typography variant="subtitle1" gutterBottom className="date-selection-title">
              <Schedule />
              Date & Time Selection
            </Typography>

            <ToggleButtonGroup
              value={dateTimeData.dateMode}
              exclusive
              onChange={onDateModeChange}
              size="small"
              className="date-mode-toggle"
            >
              <ToggleButton value="single">Set Date</ToggleButton>
              <ToggleButton value="range">Date Range</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Grid>

        {/* Date/Time Fields based on mode */}
        {dateTimeData.dateMode === 'single' && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={dateTimeData.date}
                onChange={e => onDateTimeChange('date', e.target.value)}
                InputLabelProps={{ shrink: true }}
                className="form-input"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Time"
                type="time"
                value={dateTimeData.time}
                onChange={e => onDateTimeChange('time', e.target.value)}
                InputLabelProps={{ shrink: true }}
                className="form-input"
              />
            </Grid>
          </>
        )}

        {dateTimeData.dateMode === 'range' && (
          <>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={dateTimeData.startDate}
                onChange={e => onDateTimeChange('startDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                className="form-input"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={dateTimeData.endDate}
                onChange={e => onDateTimeChange('endDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                className="form-input"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={dateTimeData.allowParticipantSelection}
                    onChange={e => onDateTimeChange('allowParticipantSelection', e.target.checked)}
                    className="activity-switch"
                  />
                }
                label="Ask participants to select a number of days within this range?"
              />
            </Grid>
            {dateTimeData.allowParticipantSelection && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="How many days must participants select?"
                  type="number"
                  value={dateTimeData.requiredDayCount}
                  onChange={e => onDateTimeChange('requiredDayCount', e.target.value)}
                  InputProps={{ inputProps: { min: 1 } }}
                  className="form-input"
                  required
                />
              </Grid>
            )}
          </>
        )}
      </Grid>
    </Box>
  );
}
