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
  ToggleButton,
  Divider
} from '@mui/material';

import { DeleteOutline, EventNote, Schedule, AddCircle } from '@mui/icons-material';


import { DeleteOutline, EventNote, Schedule, LocationOn, AddCircle } from '@mui/icons-material';

import { motion, AnimatePresence } from 'framer-motion';
import PreviewEvent from './PreviewEvent';
import './CreateYourEvent.css';

export default function CreateYourEvent() {
  const [eventData] = useState({
    isPublic: true,
    rsvpDeadline: '',
    maxParticipants: '',
    tags: [],
    tagsString: ''
  });

  const [activities, setActivities] = useState([
    {
      name: '',
      description: '',
      location: '',
      link: '',
      dateMode: 'single',
      date: '',
      time: '',
      startDate: '',
      endDate: '',
      dateTimeSuggestions: [{ startDate: '', endDate: '', time: '' }],
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
  const [supports, setSupports] = useState([]);
  const [choiceCount, setChoiceCount] = useState('');

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

  const handleDateModeChange = (index, _, mode) => {
    if (mode) {
      const updated = [...activities];
      updated[index].dateMode = mode;
      setActivities(updated);
    }
  };

  const handleSuggestionChange = (activityIndex, suggestionIndex, field, value) => {
    const updated = [...activities];
    updated[activityIndex].dateTimeSuggestions[suggestionIndex][field] = value;
    setActivities(updated);
  };

  const handleSupportChange = (index, field, value) => {
    const updated = [...supports];
    updated[index][field] = value;
    setSupports(updated);
  };

  const addSupport = () => {
    setSupports(prev => [
      ...prev,
      { category: '', name: '', cost: '' }
    ]);
  };

  const removeSupport = (index) => {
    setSupports(prev => prev.filter((_, i) => i !== index));
  };

  const addSuggestion = (activityIndex) => {
    const updated = [...activities];
    updated[activityIndex].dateTimeSuggestions.push({ startDate: '', endDate: '', time: '' });
    setActivities(updated);
  };

  const removeSuggestion = (activityIndex, suggestionIndex) => {
    const updated = [...activities];
    updated[activityIndex].dateTimeSuggestions = updated[activityIndex].dateTimeSuggestions.filter((_, i) => i !== suggestionIndex);
    setActivities(updated);
  };

  const addActivity = () => {
    const firstActivity = activities[0];
    setActivities(prev => [
      ...prev,
      {
        name: '',
        description: '',
        location: '',
        link: '',
        dateMode: firstActivity.dateMode,
        date: firstActivity.date,
        time: firstActivity.time,
        startDate: firstActivity.startDate,
        endDate: firstActivity.endDate,
        dateTimeSuggestions: [...firstActivity.dateTimeSuggestions],
        allowSuggestions: false,
        votingEnabled: true,
        equipmentEnabled: false,
        equipmentItems: '',
        costMode: 'fixed',
        cost: '',
        minCost: '',
        maxCost: '',
        allowParticipantCostSuggestion: false
      }
    ]);
  };

  const removeActivity = (index) => {
    if (activities.length > 1) {
      setActivities(prev => prev.filter((_, i) => i !== index));
    }
  };

  const hasVotingEnabled = activities.some(activity => activity.votingEnabled);

  const handlePreview = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const handleConfirmAndSubmit = async () => {
    const firstActivity = activities[0];
    const allowDateSuggestions = firstActivity.dateMode === 'suggestions';
    const allowTimeSuggestions = firstActivity.dateMode === 'suggestions';
    
    const formattedEventData = {
      ...eventData,
      name: firstActivity.name, // Use activity name as event name
      description: firstActivity.description, // Use activity description as event description
      location: eventData.location || firstActivity.location,
      date: firstActivity.dateMode === 'single' ? firstActivity.date : '',
      time: firstActivity.dateMode === 'single' ? firstActivity.time : '',
      startDate: firstActivity.dateMode === 'range' ? firstActivity.startDate : '',
      endDate: firstActivity.dateMode === 'range' ? firstActivity.endDate : '',
      allowDateSuggestions,
      allowTimeSuggestions
    };

    const payload = {
      ...formattedEventData,
      activities: activities,
      supports: supports,
      choiceCount: choiceCount
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
    const firstActivity = activities[0];
    const formattedEventData = {
      ...eventData,
      name: firstActivity.name, // Use activity name as event name
      description: firstActivity.description, // Use activity description as event description
      location: eventData.location || firstActivity.location,
      date: firstActivity.dateMode === 'single' ? firstActivity.date : '',
      time: firstActivity.dateMode === 'single' ? firstActivity.time : '',
      startDate: firstActivity.dateMode === 'range' ? firstActivity.startDate : '',
      endDate: firstActivity.dateMode === 'range' ? firstActivity.endDate : ''
    };

    return (
      <PreviewEvent
        eventData={formattedEventData}
        dateMode={firstActivity.dateMode}
        dateTimeSuggestions={firstActivity.dateMode === 'suggestions' ? firstActivity.dateTimeSuggestions : null}
        activities={activities}
        supports={supports}
        choiceCount={choiceCount}
        onEdit={() => setShowPreview(false)}
        onConfirm={handleConfirmAndSubmit}
      />
    );
  }

  return (
    <Container maxWidth="md" className="single-event-container">
      <div className="single-event-header">
        <Typography variant="h4" gutterBottom className="single-event-title">
          Create Your Event
        </Typography>
        <Typography variant="body1" color="text.secondary" className="single-event-subtitle">
          Plan meaningful adventures and create lasting memories.
          Perfect for one-time activities like dinners, meetings, or social gatherings.

        </Typography>
      </div>

      <Paper elevation={2} className="single-event-paper">
        <form>
          {/* Craft Your Adventure */}
          <Box className="craft-adventure">
            <Typography variant="h6" className="section-title" sx={{ mb: 2 }}>
              Craft Your Adventure
            </Typography>

            {/* Activities Section */}
            <Box className="activities-header">
              <Typography variant="subtitle1" className="section-title">
                Activities
              </Typography>
              {hasVotingEnabled && (
                <Button
                  variant="outlined"
                  startIcon={<AddCircle />}
                  onClick={addActivity}
                  size="small"
                  className="add-activity-btn"
                >
                  Add Activity Option
                </Button>
              )}
            </Box>

            {activities.map((activity, activityIndex) => (
              <Card key={activityIndex} className="activity-card">
                <CardContent className="activity-card-content">
                  {activities.length > 1 && (
                    <Box className="activity-option-header">
                      <Typography variant="subtitle1" className="activity-option-title">
                        Option {activityIndex + 1}
                      </Typography>
                      <IconButton 
                        color="error" 
                        onClick={() => removeActivity(activityIndex)}
                        size="small"
                        className="delete-activity-btn"
                      >
                        <DeleteOutline />
                      </IconButton>
                    </Box>
                  )}
                  
                  <Grid container spacing={3}>
                    {/* Activity Basic Info */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Activity Name"
                        value={activity.name}
                        onChange={e => handleActivityChange(activityIndex, 'name', e.target.value)}
                        required
                        InputProps={{
                          startAdornment: <EventNote />
                        }}
                        className="form-input form-input-with-icon"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Activity Description"
                        multiline
                        rows={3}
                        value={activity.description}
                        onChange={e => handleActivityChange(activityIndex, 'description', e.target.value)}
                        className="form-input"
                      />
                    </Grid>

                    {/* Date Selection Mode */}
                    {(activityIndex === 0 || activity.dateMode !== activities[0].dateMode) && (
                      <Grid item xs={12}>
                        <Box className="date-selection-section">
                          <Typography variant="subtitle1" gutterBottom className="date-selection-title">
                            <Schedule />
                            Date & Time Selection
                          </Typography>
                          <ToggleButtonGroup
                            value={activity.dateMode}
                            exclusive
                            onChange={(event, mode) => handleDateModeChange(activityIndex, event, mode)}
                            size="small"
                            className="date-mode-toggle"
                          >
                            <ToggleButton value="single">Single Time</ToggleButton>
                            <ToggleButton value="range">Date Range</ToggleButton>
                            <ToggleButton value="suggestions">Let People Choose</ToggleButton>
                          </ToggleButtonGroup>
                        </Box>
                      </Grid>
                    )}

                    {/* Date/Time Fields based on mode */}
                    {activity.dateMode === 'single' && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Date"
                            type="date"
                            value={activity.date}
                            onChange={e => handleActivityChange(activityIndex, 'date', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            className="form-input"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Time"
                            type="time"
                            value={activity.time}
                            onChange={e => handleActivityChange(activityIndex, 'time', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            className="form-input"
                          />
                        </Grid>
                      </>
                    )}

                    {activity.dateMode === 'range' && (
                      <>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Start Date"
                            type="date"
                            value={activity.startDate}
                            onChange={e => handleActivityChange(activityIndex, 'startDate', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            className="form-input"
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="End Date"
                            type="date"
                            value={activity.endDate}
                            onChange={e => handleActivityChange(activityIndex, 'endDate', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            className="form-input"
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Time"
                            type="time"
                            value={activity.time}
                            onChange={e => handleActivityChange(activityIndex, 'time', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            className="form-input"
                          />
                        </Grid>
                      </>
                    )}

                    {activity.dateMode === 'suggestions' && (
                      <Grid item xs={12}>
                        <AnimatePresence>
                          {activity.dateTimeSuggestions.map((s, suggestionIndex) => (
                            <Card 
                              key={suggestionIndex} 
                              component={motion.div} 
                              layout 
                              initial={{ opacity: 0, y: -10 }} 
                              animate={{ opacity: 1, y: 0 }} 
                              exit={{ opacity: 0, y: -10 }} 
                              className="suggestion-card"
                            >
                              <CardContent>
                                <Grid container spacing={2} alignItems="center">
                                  <Grid item xs={4}>
                                    <TextField
                                      fullWidth
                                      label={`Start Date #${suggestionIndex + 1}`}
                                      type="date"
                                      value={s.startDate}
                                      onChange={e => handleSuggestionChange(activityIndex, suggestionIndex, 'startDate', e.target.value)}
                                      InputLabelProps={{ shrink: true }}
                                      className="form-input"
                                    />
                                  </Grid>
                                  <Grid item xs={4}>
                                    <TextField
                                      fullWidth
                                      label={`End Date #${suggestionIndex + 1} (optional)`}
                                      type="date"
                                      value={s.endDate}
                                      onChange={e => handleSuggestionChange(activityIndex, suggestionIndex, 'endDate', e.target.value)}
                                      InputLabelProps={{ shrink: true }}
                                      className="form-input"
                                    />
                                  </Grid>
                                  <Grid item xs={3}>
                                    <TextField
                                      fullWidth
                                      label="Time"
                                      type="time"
                                      value={s.time}
                                      onChange={e => handleSuggestionChange(activityIndex, suggestionIndex, 'time', e.target.value)}
                                      InputLabelProps={{ shrink: true }}
                                      className="form-input"
                                    />
                                  </Grid>
                                  <Grid item xs={1}>
                                    <IconButton 
                                      color="error" 
                                      onClick={() => removeSuggestion(activityIndex, suggestionIndex)}
                                      className="suggestion-delete-btn"
                                    >
                                      <DeleteOutline />
                                    </IconButton>
                                  </Grid>
                                </Grid>
                              </CardContent>
                            </Card>
                          ))}
                        </AnimatePresence>
                        <Button 
                          variant="outlined" 
                          onClick={() => addSuggestion(activityIndex)}
                          className="add-suggestion-btn"
                        >
                          Add Time Option
                        </Button>
                      </Grid>
                    )}

                    {/* Activity Options */}
                    <Grid item xs={12}>
                      <Divider className="activity-options-divider" />
                      <Typography variant="subtitle1" gutterBottom className="activity-options-title">
                        Activity Options
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <FormControlLabel 
                        control={
                          <Switch 
                            checked={activity.allowSuggestions} 
                            onChange={() => toggleActivityFlag(activityIndex, 'allowSuggestions')}
                            className="activity-switch"
                          />
                        } 
                        label="Allow Suggestions" 
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControlLabel 
                        control={
                          <Switch 
                            checked={activity.votingEnabled} 
                            onChange={() => toggleActivityFlag(activityIndex, 'votingEnabled')}
                            className="activity-switch"
                          />
                        } 
                        label="Enable Voting" 
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControlLabel 
                        control={
                          <Switch 
                            checked={activity.equipmentEnabled} 
                            onChange={() => toggleActivityFlag(activityIndex, 'equipmentEnabled')}
                            className="activity-switch"
                          />
                        } 
                        label="Equipment/Items" 
                      />
                    </Grid>

                    {activity.equipmentEnabled && (
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          label="Equipment/Items to Bring"
                          value={activity.equipmentItems}
                          onChange={e => handleActivityChange(activityIndex, 'equipmentItems', e.target.value)}
                          className="form-input"
                        />
                      </Grid>
                    )}

                    {/* Cost Section */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" className="cost-section-title">
                        Estimated Cost
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <ToggleButtonGroup 
                        value={activity.costMode} 
                        exclusive 
                        onChange={(_, mode) => handleActivityChange(activityIndex, 'costMode', mode)} 
                        size="small"
                        className="cost-mode-toggle"
                      >
                        <ToggleButton value="fixed">Fixed Price</ToggleButton>
                        <ToggleButton value="range">Price Range</ToggleButton>
                      </ToggleButtonGroup>
                    </Grid>

                    {activity.costMode === 'fixed' && (
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Cost ($)"
                          type="number"
                          value={activity.cost}
                          onChange={e => handleActivityChange(activityIndex, 'cost', e.target.value)}
                          InputProps={{ inputProps: { min: 0 } }}
                          className="form-input"
                        />
                      </Grid>
                    )}

                    {activity.costMode === 'range' && (
                      <>
                        <Grid item xs={6} sm={3}>
                          <TextField
                            fullWidth
                            label="Min Cost ($)"
                            type="number"
                            value={activity.minCost}
                            onChange={e => handleActivityChange(activityIndex, 'minCost', e.target.value)}
                            InputProps={{ inputProps: { min: 0 } }}
                            className="form-input"
                          />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <TextField
                            fullWidth
                            label="Max Cost ($)"
                            type="number"
                            value={activity.maxCost}
                            onChange={e => handleActivityChange(activityIndex, 'maxCost', e.target.value)}
            {/* Activity Section */}
            <Box>
              <Box className="activities-header">
                <Typography variant="h6" className="section-title">
                  Activity {activities.length > 1 ? 'Options' : 'Information'}
                </Typography>
                {hasVotingEnabled && (
                  <Button
                    variant="outlined"
                    startIcon={<AddCircle />}
                    onClick={addActivity}
                    size="small"
                    className="add-activity-btn"
                  >
                    Add Activity Option
                  </Button>
                )}
              </Box>

              {activities.map((activity, activityIndex) => (
                <Card key={activityIndex} className="activity-card">
                  <CardContent className="activity-card-content">
                    {activities.length > 1 && (
                      <Box className="activity-option-header">
                        <Typography variant="subtitle1" className="activity-option-title">
                          Option {activityIndex + 1}
                        </Typography>
                        <IconButton 
                          color="error" 
                          onClick={() => removeActivity(activityIndex)}
                          size="small"
                          className="delete-activity-btn"
                        >
                          <DeleteOutline />
                        </IconButton>
                      </Box>
                    )}
                    
                    <Grid container spacing={3}>
                      {/* Activity Basic Info */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Activity Name"
                          value={activity.name}
                          onChange={e => handleActivityChange(activityIndex, 'name', e.target.value)}
                          required
                          InputProps={{
                            startAdornment: <EventNote />
                          }}
                          className="form-input form-input-with-icon"
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Location"
                          value={activity.location}
                          onChange={e => handleActivityChange(activityIndex, 'location', e.target.value)}
                          InputProps={{
                            startAdornment: <LocationOn />
                          }}
                          className="form-input form-input-with-icon"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Activity Description"
                          multiline
                          rows={3}
                          value={activity.description}
                          onChange={e => handleActivityChange(activityIndex, 'description', e.target.value)}
                          className="form-input"
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Link (optional)"
                          value={activity.link}
                          onChange={e => handleActivityChange(activityIndex, 'link', e.target.value)}
                          className="form-input"
                        />
                      </Grid>

                      {/* Date Selection Mode */}
                      {(activityIndex === 0 || activity.dateMode !== activities[0].dateMode) && (
                        <Grid item xs={12}>
                          <Box className="date-selection-section">
                            <Typography variant="subtitle1" gutterBottom className="date-selection-title">
                              <Schedule />
                              Date & Time Selection
                            </Typography>

                            <ToggleButtonGroup
                              value={activity.dateMode}
                              exclusive
                              onChange={(event, mode) => handleDateModeChange(activityIndex, event, mode)}
                              size="small"
                              className="date-mode-toggle"
                            >
                              <ToggleButton value="single">Single Time</ToggleButton>
                              <ToggleButton value="range">Date Range</ToggleButton>
                              <ToggleButton value="suggestions">Let People Choose</ToggleButton>
                            </ToggleButtonGroup>
                          </Box>
                        </Grid>
                      )}

                      {/* Date/Time Fields based on mode */}
                      {activity.dateMode === 'single' && (
                        <>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Date"
                              type="date"
                              value={activity.date}
                              onChange={e => handleActivityChange(activityIndex, 'date', e.target.value)}
                              InputLabelProps={{ shrink: true }}
                              className="form-input"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Time"
                              type="time"
                              value={activity.time}
                              onChange={e => handleActivityChange(activityIndex, 'time', e.target.value)}
                              InputLabelProps={{ shrink: true }}
                              className="form-input"
                            />
                          </Grid>
                        </>
                      )}

                      {activity.dateMode === 'range' && (
                        <>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label="Start Date"
                              type="date"
                              value={activity.startDate}
                              onChange={e => handleActivityChange(activityIndex, 'startDate', e.target.value)}
                              InputLabelProps={{ shrink: true }}
                              className="form-input"
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label="End Date"
                              type="date"
                              value={activity.endDate}
                              onChange={e => handleActivityChange(activityIndex, 'endDate', e.target.value)}
                              InputLabelProps={{ shrink: true }}
                              className="form-input"
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label="Time"
                              type="time"
                              value={activity.time}
                              onChange={e => handleActivityChange(activityIndex, 'time', e.target.value)}
                              InputLabelProps={{ shrink: true }}
                              className="form-input"
                            />
                          </Grid>
                        </>
                      )}

                      {activity.dateMode === 'suggestions' && (
                        <Grid item xs={12}>
                          <AnimatePresence>
                            {activity.dateTimeSuggestions.map((s, suggestionIndex) => (
                              <Card 
                                key={suggestionIndex} 
                                component={motion.div} 
                                layout 
                                initial={{ opacity: 0, y: -10 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                exit={{ opacity: 0, y: -10 }} 
                                className="suggestion-card"
                              >
                                <CardContent>
                                  <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={4}>
                                      <TextField
                                        fullWidth
                                        label={`Start Date #${suggestionIndex + 1}`}
                                        type="date"
                                        value={s.startDate}
                                        onChange={e => handleSuggestionChange(activityIndex, suggestionIndex, 'startDate', e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        className="form-input"
                                      />
                                    </Grid>
                                    <Grid item xs={4}>
                                      <TextField
                                        fullWidth
                                        label={`End Date #${suggestionIndex + 1} (optional)`}
                                        type="date"
                                        value={s.endDate}
                                        onChange={e => handleSuggestionChange(activityIndex, suggestionIndex, 'endDate', e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        className="form-input"
                                      />
                                    </Grid>
                                    <Grid item xs={3}>
                                      <TextField
                                        fullWidth
                                        label="Time"
                                        type="time"
                                        value={s.time}
                                        onChange={e => handleSuggestionChange(activityIndex, suggestionIndex, 'time', e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        className="form-input"
                                      />
                                    </Grid>
                                    <Grid item xs={1}>
                                      <IconButton 
                                        color="error" 
                                        onClick={() => removeSuggestion(activityIndex, suggestionIndex)}
                                        className="suggestion-delete-btn"
                                      >
                                        <DeleteOutline />
                                      </IconButton>
                                    </Grid>
                                  </Grid>
                                </CardContent>
                              </Card>
                            ))}
                          </AnimatePresence>
                          <Button 
                            variant="outlined" 
                            onClick={() => addSuggestion(activityIndex)}
                            className="add-suggestion-btn"
                          >
                            Add Time Option
                          </Button>
                        </Grid>
                      )}

                      {/* Activity Options */}
                      <Grid item xs={12}>
                        <Divider className="activity-options-divider" />
                        <Typography variant="subtitle1" gutterBottom className="activity-options-title">
                          Activity Options
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} sm={4}>
                        <FormControlLabel 
                          control={
                            <Switch 
                              checked={activity.allowSuggestions} 
                              onChange={() => toggleActivityFlag(activityIndex, 'allowSuggestions')}
                              className="activity-switch"
                            />
                          } 
                          label="Allow Suggestions" 
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormControlLabel 
                          control={
                            <Switch 
                              checked={activity.votingEnabled} 
                              onChange={() => toggleActivityFlag(activityIndex, 'votingEnabled')}
                              className="activity-switch"
                            />
                          } 
                          label="Enable Voting" 
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormControlLabel 
                          control={
                            <Switch 
                              checked={activity.equipmentEnabled} 
                              onChange={() => toggleActivityFlag(activityIndex, 'equipmentEnabled')}
                              className="activity-switch"
                            />
                          } 
                          label="Equipment/Items" 
                        />
                      </Grid>

                      {activity.equipmentEnabled && (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            label="Equipment/Items to Bring"
                            value={activity.equipmentItems}
                            onChange={e => handleActivityChange(activityIndex, 'equipmentItems', e.target.value)}
                            className="form-input"
                          />
                        </Grid>
                      )}

                      {/* Cost Section */}
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" className="cost-section-title">
                          Estimated Cost
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <ToggleButtonGroup 
                          value={activity.costMode} 
                          exclusive 
                          onChange={(_, mode) => handleActivityChange(activityIndex, 'costMode', mode)} 
                          size="small"
                          className="cost-mode-toggle"
                        >
                          <ToggleButton value="fixed">Fixed Price</ToggleButton>
                          <ToggleButton value="range">Price Range</ToggleButton>
                        </ToggleButtonGroup>
                      </Grid>

                      {activity.costMode === 'fixed' && (
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Cost ($)"
                            type="number"
                            value={activity.cost}
                            onChange={e => handleActivityChange(activityIndex, 'cost', e.target.value)}
                            InputProps={{ inputProps: { min: 0 } }}
                            className="form-input"
                          />
                        </Grid>
                      </>
                    )}

                    <Grid item xs={12}>
                      <FormControlLabel 
                        control={
                          <Switch 
                            checked={activity.allowParticipantCostSuggestion} 
                            onChange={() => toggleActivityFlag(activityIndex, 'allowParticipantCostSuggestion')}
                            className="activity-switch"
                          />
                        } 
                        label="Allow Participant Budget Suggestions" 
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
            
            {hasVotingEnabled && activities.length === 1 && (
              <Box className="voting-helper-text">
                <Typography variant="body2" color="text.secondary">
                  Enable voting to let participants choose between multiple activity options
                </Typography>
              </Box>
            )}

            {/* Participants must select X */}
            {activities.length > 1 && (
              <Box sx={{ my: 2 }}>
                <TextField
                  label="Participants must select"
                  type="number"
                  value={choiceCount}
                  onChange={e => setChoiceCount(e.target.value)}
                  InputProps={{ inputProps: { min: 1, max: activities.length } }}
                />
              </Box>
            )}

            {/* Activity Support Section */}
            <Box sx={{ mt: 4 }}>
              <Box className="activities-header">
                <Typography variant="subtitle1" className="section-title">
                  Activity Support
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddCircle />}
                  onClick={addSupport}
                  size="small"
                  className="add-activity-btn"
                >
                  Add Support Option
                </Button>
              </Box>

              {supports.map((s, i) => (
                <Card key={i} className="activity-card">
                  <CardContent className="activity-card-content">
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Category"
                          value={s.category}
                          onChange={e => handleSupportChange(i, 'category', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Name"
                          value={s.name}
                          onChange={e => handleSupportChange(i, 'name', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="Cost ($)"
                          type="number"
                          value={s.cost}
                          onChange={e => handleSupportChange(i, 'cost', e.target.value)}
                          InputProps={{ inputProps: { min: 0 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <IconButton color="error" onClick={() => removeSupport(i)}>
                          <DeleteOutline />
                        </IconButton>
                      </Grid>
                      )}

                      {activity.costMode === 'range' && (
                        <>
                          <Grid item xs={6} sm={3}>
                            <TextField
                              fullWidth
                              label="Min Cost ($)"
                              type="number"
                              value={activity.minCost}
                              onChange={e => handleActivityChange(activityIndex, 'minCost', e.target.value)}
                              InputProps={{ inputProps: { min: 0 } }}
                              className="form-input"
                            />
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <TextField
                              fullWidth
                              label="Max Cost ($)"
                              type="number"
                              value={activity.maxCost}
                              onChange={e => handleActivityChange(activityIndex, 'maxCost', e.target.value)}
                              InputProps={{ inputProps: { min: 0 } }}
                              className="form-input"
                            />
                          </Grid>
                        </>
                      )}

                      <Grid item xs={12}>
                        <FormControlLabel 
                          control={
                            <Switch 
                              checked={activity.allowParticipantCostSuggestion} 
                              onChange={() => toggleActivityFlag(activityIndex, 'allowParticipantCostSuggestion')}
                              className="activity-switch"
                            />
                          } 
                          label="Allow Participant Budget Suggestions" 
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
           
              {hasVotingEnabled && activities.length === 1 && (
                <Box className="voting-helper-text">
                  <Typography variant="body2" color="text.secondary">
                    Enable voting to let participants choose between multiple activity options
                  </Typography>
                </Box>
              )}

              {/* Participants must select X */}
              {activities.length > 1 && (
                <Box sx={{ my: 2 }}>
                  <TextField
                    label="Participants must select"
                    type="number"
                    value={choiceCount}
                    onChange={e => setChoiceCount(e.target.value)}
                    InputProps={{ inputProps: { min: 1, max: activities.length } }}
                  />
                </Box>
              )}

              {/* Activity Support Section */}
              <Box sx={{ mt: 4 }}>
                <Box className="activities-header">
                  <Typography variant="subtitle1" className="section-title">
                    Activity Support
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddCircle />}
                    onClick={addSupport}
                    size="small"
                    className="add-activity-btn"
                  >
                    Add Support Option
                  </Button>
                </Box>

                {supports.map((s, i) => (
                  <Card key={i} className="activity-card">
                    <CardContent className="activity-card-content">
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Category"
                            value={s.category}
                            onChange={e => handleSupportChange(i, 'category', e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Name"
                            value={s.name}
                            onChange={e => handleSupportChange(i, 'name', e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            fullWidth
                            label="Cost ($)"
                            type="number"
                            value={s.cost}
                            onChange={e => handleSupportChange(i, 'cost', e.target.value)}
                            InputProps={{ inputProps: { min: 0 } }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <IconButton color="error" onClick={() => removeSupport(i)}>
                            <DeleteOutline />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Preview Button */}
          <Box className="preview-button-container">
            <Button 
              variant="contained" 
              size="large"
              onClick={handlePreview}
              className="preview-button"
            >
              Preview Event
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}