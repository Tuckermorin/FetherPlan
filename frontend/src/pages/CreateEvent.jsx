import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  IconButton,
  Switch,
  FormControlLabel,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { AddCircle, DeleteOutline } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import PreviewEvent from './PreviewEvent';

export default function CreateEvent() {
  const [eventData, setEventData] = useState({
    name: '',
    location: '',
    date: '',
    startDate: '',
    endDate: '',
    time: '',
    description: '',
    rsvpDeadline: '',
    maxParticipants: '',
    tags: [],
    tagsString: '',
    isPublic: true,
    allowDateSuggestions: false,
    allowTimeSuggestions: false,
    dateProposals: [],
    timeProposals: []
  });

  const [dateMode, setDateMode] = useState('single');
  const [dateTimeSuggestions, setDateTimeSuggestions] = useState([
    { startDate: '', endDate: '', time: '' }
  ]);
  const [activities, setActivities] = useState([
    {
      name: '',
      location: '',
      link: '',
      allowSuggestions: false,
      votingEnabled: false,
      equipmentEnabled: false,
      equipmentItems: '',
      costMode: 'fixed',
      cost: '',
      minCost: '',
      maxCost: '',
      allowParticipantCostSuggestion: false
    }
  ]);
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleModeChange = (_, mode) => {
    if (mode) setDateMode(mode);
  };

  const handleSuggestionChange = (index, field, value) => {
    const updated = [...dateTimeSuggestions];
    updated[index][field] = value;
    setDateTimeSuggestions(updated);
  };

  const addSuggestion = () =>
    setDateTimeSuggestions(prev => [...prev, { startDate: '', endDate: '', time: '' }]);

  const removeSuggestion = (index) =>
    setDateTimeSuggestions(prev => prev.filter((_, i) => i !== index));

  const handleActivityChange = (index, field, value) => {
    const updated = [...activities];
    updated[index][field] = value;
    setActivities(updated);
  };

  const toggleActivityFlag = (index, field) => {
    const updated = [...activities];
    updated[index][field] = !updated[index][field];
    setActivities(updated);
  };

  const addActivity = () =>
    setActivities(prev => [
      ...prev,
      {
        name: '',
        location: '',
        link: '',
        allowSuggestions: false,
        votingEnabled: false,
        equipmentEnabled: false,
        equipmentItems: '',
        costMode: 'fixed',
        cost: '',
        minCost: '',
        maxCost: '',
        allowParticipantCostSuggestion: false
      }
    ]);

  const removeActivity = (index) =>
    setActivities(prev => prev.filter((_, i) => i !== index));

  const handlePreview = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const handleConfirmAndSubmit = async () => {
    const allowDateSuggestions = dateMode === 'suggestions';
    const allowTimeSuggestions = dateMode === 'suggestions';
    const dateProposals = allowDateSuggestions
      ? dateTimeSuggestions.map(s => ({ startDate: s.startDate, endDate: s.endDate }))
      : [];
    const timeProposals = allowTimeSuggestions
      ? dateTimeSuggestions.map(s => s.time)
      : [];

    const payload = {
      ...eventData,
      allowDateSuggestions,
      allowTimeSuggestions,
      dateProposals,
      timeProposals,
      activities
    };

    try {
      const res = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error();
      await res.json();
      alert('Event created successfully!');
    } catch {
      alert('Error creating event');
    }
  };

  if (showPreview) {
    return (
      <PreviewEvent
        eventData={eventData}
        dateMode={dateMode}
        dateTimeSuggestions={dateMode === 'suggestions' ? dateTimeSuggestions : null}
        activities={activities}
        onEdit={() => setShowPreview(false)}
        onConfirm={handleConfirmAndSubmit}
      />
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Create a New Event</Typography>
      <Paper elevation={3} sx={{ p: 4 }}>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Name"
                name="name"
                value={eventData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                value={eventData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Date Selection Mode</Typography>
              <ToggleButtonGroup value={dateMode} exclusive onChange={handleModeChange} size="small">
                <ToggleButton value="single">Single Day</ToggleButton>
                <ToggleButton value="range">Date Range</ToggleButton>
                <ToggleButton value="suggestions">Suggestions</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            {dateMode === 'single' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date"
                    name="date"
                    type="date"
                    value={eventData.date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Time"
                    name="time"
                    type="time"
                    value={eventData.time}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </>
            )}
            {dateMode === 'range' && (
              <>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    name="startDate"
                    type="date"
                    value={eventData.startDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="End Date"
                    name="endDate"
                    type="date"
                    value={eventData.endDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Time"
                    name="time"
                    type="time"
                    value={eventData.time}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </>
            )}
            {dateMode === 'suggestions' && (
              <Grid item xs={12}>
                <AnimatePresence>
                  {dateTimeSuggestions.map((s, i) => (
                    <Card key={i} component={motion.div} layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} sx={{ mb: 2, borderRadius: 2, boxShadow: 3 }}>
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={4}>
                            <TextField
                              fullWidth
                              label={`Start Date #${i + 1}`}
                              type="date"
                              value={s.startDate}
                              onChange={e => handleSuggestionChange(i, 'startDate', e.target.value)}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <TextField
                              fullWidth
                              label={`End Date #${i + 1} (optional)`}
                              type="date"
                              value={s.endDate}
                              onChange={e => handleSuggestionChange(i, 'endDate', e.target.value)}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <TextField
                              fullWidth
                              label="Time"
                              type="time"
                              value={s.time}
                              onChange={e => handleSuggestionChange(i, 'time', e.target.value)}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item xs={1}>
                            <IconButton color="error" onClick={() => removeSuggestion(i)}>
                              <DeleteOutline />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </AnimatePresence>
                <Box mt={2}>
                  <Button variant="outlined" startIcon={<AddCircle />} onClick={addSuggestion}>
                    Add Range Suggestion
                  </Button>
                </Box>
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography variant="h6">Activities</Typography>
            </Grid>
            {activities.map((a, i) => (
              <Grid item xs={12} key={i}>
                <Card component={motion.div} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} sx={{ mb: 2, p: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1">Activity #{i + 1}</Typography>
                    <IconButton color="error" onClick={() => removeActivity(i)}>
                      <DeleteOutline />
                    </IconButton>
                  </Box>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Name" value={a.name} onChange={e => handleActivityChange(i, 'name', e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Location" value={a.location} onChange={e => handleActivityChange(i, 'location', e.target.value)} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Link (optional)" value={a.link} onChange={e => handleActivityChange(i, 'link', e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControlLabel control={<Switch checked={a.allowSuggestions} onChange={() => toggleActivityFlag(i, 'allowSuggestions')} />} label="Allow Suggestions" />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControlLabel control={<Switch checked={a.votingEnabled} onChange={() => toggleActivityFlag(i, 'votingEnabled')} />} label="Enable Voting" />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControlLabel control={<Switch checked={a.equipmentEnabled} onChange={() => toggleActivityFlag(i, 'equipmentEnabled')} />} label="Equipment/Items" />
                    </Grid>
                    {a.equipmentEnabled && (
                      <Grid item xs={12}>
                        <TextField fullWidth multiline rows={2} label="Equipment/Items to Bring" value={a.equipmentItems} onChange={e => handleActivityChange(i, 'equipmentItems', e.target.value)} />
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">Estimated Cost</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <ToggleButtonGroup value={a.costMode} exclusive onChange={(_, mode) => handleActivityChange(i, 'costMode', mode)} size="small">
                        <ToggleButton value="fixed">Fixed</ToggleButton>
                        <ToggleButton value="range">Range</ToggleButton>
                      </ToggleButtonGroup>
                    </Grid>
                    {a.costMode === 'fixed' && (
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Cost" type="number" value={a.cost} onChange={e => handleActivityChange(i, 'cost', e.target.value)} InputProps={{ inputProps: { min: 0 } }} />
                      </Grid>
                    )}
                    {a.costMode === 'range' && (
                      <>
                        <Grid item xs={6} sm={3}>
                          <TextField fullWidth label="Min Cost" type="number" value={a.minCost} onChange={e => handleActivityChange(i, 'minCost', e.target.value)} InputProps={{ inputProps: { min: 0 } }} />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <TextField fullWidth label="Max Cost" type="number" value={a.maxCost} onChange={e => handleActivityChange(i, 'maxCost', e.target.value)} InputProps={{ inputProps: { min: 0 } }} />
                        </Grid>
                      </>
                    )}
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel control={<Switch checked={a.allowParticipantCostSuggestion} onChange={() => toggleActivityFlag(i, 'allowParticipantCostSuggestion')} />} label="Allow Participant Budget Suggestions" />
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button variant="outlined" startIcon={<AddCircle />} onClick={addActivity}>
                Add Activity
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Box mt={2}>
                <Button variant="contained" color="primary" onClick={handlePreview}>
                  Preview Event
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
