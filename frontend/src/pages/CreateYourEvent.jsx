import React, { useState } from 'react';
import {
  Container,
  TextField,
  Tooltip,
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
  Divider,
  Chip
} from '@mui/material';

import { DeleteOutline, EventNote, Schedule, AddCircle, AccessTime, AttachMoney, Edit, InfoOutlined } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import PreviewEvent from './PreviewEvent';
import './CreateYourEvent.css';

export default function CreateYourEvent() {
  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    isPublic: true,
    rsvpDeadline: '',
    maxParticipants: '',
    tags: [],
    tagsString: ''
  });

  const [dateTimeData, setDateTimeData] = useState({
    dateMode: 'single',
    date: '',
    time: '',
    startDate: '',
    endDate: '',
    allowParticipantSelection: false,
    requiredDayCount: ''
  });

  const [activities, setActivities] = useState([]);
  const [activitySupports, setActivitySupports] = useState([]);
  const [requiredActivityCount, setRequiredActivityCount] = useState('');
  const [requiredSupportCount, setRequiredSupportCount] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Activity Support Categories - when one is selected, conflicting ones get disabled
  const supportCategories = {
    transportation: {
      name: 'Transportation',
      options: ['Airfare', 'Rental Car', 'Gas', 'Public Transit', 'Rideshare'],
      conflicts: ['Airfare', 'Rental Car'] // These conflict with each other
    },
    accommodation: {
      name: 'Accommodation', 
      options: ['Hotel', 'Airbnb', 'Family/Friends', 'Camping'],
      conflicts: ['Hotel', 'Airbnb', 'Family/Friends', 'Camping'] // All conflict
    },
    meals: {
      name: 'Meals',
      options: ['Restaurant', 'Catering', 'Potluck', 'Self-Prepared'],
      conflicts: []
    }
  };

  const handleEventDataChange = (field, value) => {
    setEventData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateTimeChange = (field, value) => {
    setDateTimeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateModeChange = (_, mode) => {
    if (mode) {
      setDateTimeData(prev => ({
        ...prev,
        dateMode: mode,
        allowParticipantSelection: false
      }));
    }
  };

  const addActivity = () => {
    setActivities(prev => [
      ...prev,
      {
        id: Date.now(),
        name: '',
        timeCommitment: '',
        link: '',
        costMode: 'fixed',
        cost: '',
        minCost: '',
        maxCost: '',
        isVotable: false,
        equipmentEnabled: false,
        equipmentItems: '',
        isCompleted: false
      }
    ]);
  };

  const updateActivity = (id, field, value) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === id ? { ...activity, [field]: value } : activity
      )
    );
  };

  const removeActivity = (id) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  };

  const addActivitySupport = (category, option) => {
    const newSupport = {
      id: Date.now(),
      category,
      option,
      costMode: 'fixed',
      cost: '',
      minCost: '',
      maxCost: '',
      isVotable: false,
      isCompleted: false,
      customLabel: ''
    };
    setActivitySupports(prev => [...prev, newSupport]);
  };

  const updateActivitySupport = (id, field, value) => {
    setActivitySupports(prev =>
      prev.map(support =>
        support.id === id ? { ...support, [field]: value } : support
      )
    );
  };

  const removeActivitySupport = (id) => {
    setActivitySupports(prev => prev.filter(support => support.id !== id));
  };


  const handlePreview = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const handleConfirmAndSubmit = async () => {
    const payload = {
      eventData,
      dateTimeData,
      activities,
      activitySupports,
      requiredActivityCount,
      requiredSupportCount
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
        dateTimeData={dateTimeData}
        activities={activities}
        activitySupports={activitySupports}
        requiredActivityCount={requiredActivityCount}
        requiredSupportCount={requiredSupportCount}
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
          Plan meaningful adventures and create lasting memories. It can be as simple as a dinner date with friends or a multi-day vacation with multiple activities.
        </Typography>
      </div>

      <Paper elevation={2} className="single-event-paper">
        <form>
          {/* Basic Event Information */}
          <Box className="craft-adventure">
            {/* <Typography variant="h4" className="section-title" sx={{ mb: 2 }}>
              Event Details
            </Typography> */}
            <Grid 
              container 
              columnSpacing={3}
              rowSpacing={0} 
            >
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Event Name"
                  value={eventData.name}
                  onChange={e => handleEventDataChange('name', e.target.value)}
                  required
                  InputProps={{
                    startAdornment: <EventNote />
                  }}
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
                  onChange={e => handleEventDataChange('description', e.target.value)}
                  className="form-input"
                />
              </Grid>

              {/* Date & Time Selection */}
              <Grid item xs={12} mt ={2.5}>
                <Box className="date-selection-section">
                  <Typography variant="subtitle1" gutterBottom className="date-selection-title">
                    <Schedule />
                    Date & Time Selection
                  </Typography>

                  <ToggleButtonGroup
                    value={dateTimeData.dateMode}
                    exclusive
                    onChange={handleDateModeChange}
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
                      onChange={e => handleDateTimeChange('date', e.target.value)}
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
                      onChange={e => handleDateTimeChange('time', e.target.value)}
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
                      onChange={e => handleDateTimeChange('startDate', e.target.value)}
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
                      onChange={e => handleDateTimeChange('endDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      className="form-input"
                    />
                  </Grid>
                  {/* <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Time"
                      type="time"
                      value={dateTimeData.time}
                      onChange={e => handleDateTimeChange('time', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      className="form-input"
                    />
                  </Grid> */}
                  <Grid item xs={12}>
                    <FormControlLabel 
                      control={
                        <Switch 
                          checked={dateTimeData.allowParticipantSelection} 
                          onChange={(e) => handleDateTimeChange('allowParticipantSelection', e.target.checked)}
                          className="activity-switch"
                        />
                      } 
                      label="Ask participants to select a number of days within this range" 
                    />
                  </Grid>
                  {dateTimeData.allowParticipantSelection && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="How many days must participants select?"
                        type="number"
                        value={dateTimeData.requiredDayCount}
                        onChange={e => handleDateTimeChange('requiredDayCount', e.target.value)}
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

          <Divider sx={{ my: 4 }} />

          {/* Activity Options Section */}
          <Box>
            <Box className="activities-header">
              <Typography variant="h4" className="section-title">
                Activity Options
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddCircle />}
                onClick={addActivity}
                size="small"
                className="add-activity-btn"
              >
                Add Activity
              </Button>
            </Box>

            {activities.length > 0 && (
              <AnimatePresence>
                {/* Votable Activities */}
                {activities.filter(a => a.isVotable).length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>Votable Activities</Typography>
                    <AnimatePresence>
                      {activities.filter(a => a.isVotable).map((activity) => (
                        <Card 
                          key={activity.id} 
                          component={motion.div}
                          layout
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="activity-card"
                        >
                          <CardContent className="activity-card-content" sx={{ position: 'relative', paddingBottom: '60px' }}>
                            {activity.isCompleted ? (
                              <Card className="completed-activity-card">
                                <div className="completed-activity-header">
                                  <a onClick={() => updateActivity(activity.id, 'isCompleted', false)}>Edit Event</a>
                                  <IconButton size="small" onClick={() => updateActivity(activity.id, 'isCompleted', false)}>
                                    <Edit fontSize="small" />
                                  </IconButton>
                                </div>
                                <Typography align="center" className="completed-activity-detail">
                                  {activity.name}
                                </Typography>
                                <Typography className="completed-activity-detail">
                                  Estimated Time: {activity.timeCommitment}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                                  <Chip
                                    label={activity.isVotable ? 'Voting' : 'Fixed'}
                                    size="small"
                                    color={activity.isVotable ? 'primary' : 'default'}
                                  />
                                </Box>
                                <Typography className="completed-activity-detail" sx={{ mt: 0.5 }}>
                                  Cost: ${activity.cost}
                                </Typography>
                              </Card>
                            ) : (
                              <Box>
                                <Box className="activity-option-header">
                                  <Typography variant="subtitle1" className="activity-option-title">Activity</Typography>
                                  <Chip
                                    label={activity.isVotable ? 'Voting' : 'Fixed'}
                                    size="small"
                                    color={activity.isVotable ? 'primary' : 'default'}
                                    sx={{ ml: 1 }}
                                  />
                                  <IconButton 
                                    color="error" 
                                    onClick={() => removeActivity(activity.id)}
                                    size="small"
                                    className="delete-activity-btn"
                                  >
                                    <DeleteOutline />
                                  </IconButton>
                                </Box>

                                <Grid container columnSpacing={3} rowSpacing={0}>
                                  <Grid item xs={12} sm={6}>
                                    <TextField
                                      fullWidth
                                      label="Activity Name"
                                      value={activity.name}
                                      onChange={e => updateActivity(activity.id, 'name', e.target.value)}
                                      required
                                      InputProps={{ startAdornment: <EventNote /> }}
                                      className="form-input form-input-with-icon"
                                    />
                                  </Grid>

                                  <Grid item xs={12} sm={6}>
                                    <TextField
                                      fullWidth
                                      label="Estimated Time Commitment"
                                      value={activity.timeCommitment}
                                      onChange={e => updateActivity(activity.id, 'timeCommitment', e.target.value)}
                                      placeholder="e.g., 2 hours, Half day"
                                      InputProps={{ startAdornment: <AccessTime /> }}
                                      className="form-input form-input-with-icon"
                                    />
                                  </Grid>

                                  <Grid item xs={12}>
                                    <TextField
                                      fullWidth
                                      label="Link (optional)"
                                      value={activity.link}
                                      onChange={e => updateActivity(activity.id, 'link', e.target.value)}
                                      className="linkField"
                                    />
                                  </Grid>

                                  <Grid item xs={12} sm={6}>
                                    <FormControlLabel 
                                      control={
                                        <Switch 
                                          checked={activity.isVotable} 
                                          onChange={(e) => updateActivity(activity.id, 'isVotable', e.target.checked)}
                                          className="activity-switch"
                                        />
                                      } 
                                      label="Make this activity votable" 
                                    />
                                  </Grid>

                                  <Grid item xs={12} sm={6}>
                                    <FormControlLabel 
                                      control={
                                        <Switch 
                                          checked={activity.equipmentEnabled} 
                                          onChange={(e) => updateActivity(activity.id, 'equipmentEnabled', e.target.checked)}
                                          className="activity-switch"
                                        />
                                      } 
                                      label="Equipment/Items needed" 
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
                                        onChange={e => updateActivity(activity.id, 'equipmentItems', e.target.value)}
                                        className="form-input"
                                      />
                                    </Grid>
                                  )}

                                  <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 5 }}>
                                      <AttachMoney sx={{ mr: 1, color: 'text.secondary' }} />
                                      <Typography variant="subtitle2" className="cost-section-title">
                                        Cost Information
                                      </Typography>
                                    </Box>
                                  </Grid>

                                  <Grid item xs={12} sm={6}>
                                    <ToggleButtonGroup 
                                      value={activity.costMode} 
                                      exclusive 
                                      onChange={(_, mode) => updateActivity(activity.id, 'costMode', mode)} 
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
                                        onChange={e => updateActivity(activity.id, 'cost', e.target.value)}
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
                                          onChange={e => updateActivity(activity.id, 'minCost', e.target.value)}
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
                                          onChange={e => updateActivity(activity.id, 'maxCost', e.target.value)}
                                          InputProps={{ inputProps: { min: 0 } }}
                                          className="form-input"
                                        />
                                      </Grid>
                                    </>
                                  )}

                                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                    <Button 
                                      variant="outlined"
                                      size="small"
                                      onClick={() => updateActivity(activity.id, 'isCompleted', true)}
                                      disabled={!activity.name}
                                    >
                                      Complete
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </AnimatePresence>
                  </Box>
                )}

                {/* Fixed Activities */}
                {activities.filter(a => !a.isVotable).length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>Fixed Activities</Typography>
                    <AnimatePresence>
                      {activities.filter(a => !a.isVotable).map((activity) => (
                        <Card 
                          key={activity.id} 
                          component={motion.div}
                          layout
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="activity-card"
                        >
                          <CardContent className="activity-card-content" sx={{ position: 'relative', paddingBottom: '60px' }}>
                            {activity.isCompleted ? (
                              <Card className="completed-activity-card">
                                <div className="completed-activity-header">
                                  <a onClick={() => updateActivity(activity.id, 'isCompleted', false)}>Edit Event</a>
                                  <IconButton size="small" onClick={() => updateActivity(activity.id, 'isCompleted', false)}>
                                    <Edit fontSize="small" />
                                  </IconButton>
                                </div>
                                <Typography align="center" className="completed-activity-detail">
                                  {activity.name}
                                </Typography>
                                <Typography className="completed-activity-detail">
                                  Estimated Time: {activity.timeCommitment}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                                  <Chip
                                    label={activity.isVotable ? 'Voting' : 'Fixed'}
                                    size="small"
                                    color={activity.isVotable ? 'primary' : 'default'}
                                  />
                                </Box>
                                <Typography className="completed-activity-detail" sx={{ mt: 0.5 }}>
                                  Cost: ${activity.cost}
                                </Typography>
                              </Card>
                            ) : (
                              <Box>
                                <Box className="activity-option-header">
                                  <Typography variant="subtitle1" className="activity-option-title">Activity</Typography>
                                  <Chip
                                    label={activity.isVotable ? 'Voting' : 'Fixed'}
                                    size="small"
                                    color={activity.isVotable ? 'primary' : 'default'}
                                    sx={{ ml: 1 }}
                                  />
                                  <IconButton 
                                    color="error" 
                                    onClick={() => removeActivity(activity.id)}
                                    size="small"
                                    className="delete-activity-btn"
                                  >
                                    <DeleteOutline />
                                  </IconButton>
                                </Box>

                                <Grid container columnSpacing={3} rowSpacing={0}>
                                  <Grid item xs={12} sm={6}>
                                    <TextField
                                      fullWidth
                                      label="Activity Name"
                                      value={activity.name}
                                      onChange={e => updateActivity(activity.id, 'name', e.target.value)}
                                      required
                                      InputProps={{ startAdornment: <EventNote /> }}
                                      className="form-input form-input-with-icon"
                                    />
                                  </Grid>

                                  <Grid item xs={12} sm={6}>
                                    <TextField
                                      fullWidth
                                      label="Estimated Time Commitment"
                                      value={activity.timeCommitment}
                                      onChange={e => updateActivity(activity.id, 'timeCommitment', e.target.value)}
                                      placeholder="e.g., 2 hours, Half day"
                                      InputProps={{ startAdornment: <AccessTime /> }}
                                      className="form-input form-input-with-icon"
                                    />
                                  </Grid>

                                  <Grid item xs={12}>
                                    <TextField
                                      fullWidth
                                      label="Link (optional)"
                                      value={activity.link}
                                      onChange={e => updateActivity(activity.id, 'link', e.target.value)}
                                      className="linkField"
                                    />
                                  </Grid>

                                  <Grid item xs={12} sm={6}>
                                    <FormControlLabel 
                                      control={
                                        <Switch 
                                          checked={activity.isVotable} 
                                          onChange={(e) => updateActivity(activity.id, 'isVotable', e.target.checked)}
                                          className="activity-switch"
                                        />
                                      } 
                                      label="Make this activity votable" 
                                    />
                                  </Grid>

                                  <Grid item xs={12} sm={6}>
                                    <FormControlLabel 
                                      control={
                                        <Switch 
                                          checked={activity.equipmentEnabled} 
                                          onChange={(e) => updateActivity(activity.id, 'equipmentEnabled', e.target.checked)}
                                          className="activity-switch"
                                        />
                                      } 
                                      label="Equipment/Items needed" 
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
                                        onChange={e => updateActivity(activity.id, 'equipmentItems', e.target.value)}
                                        className="form-input"
                                      />
                                    </Grid>
                                  )}

                                  <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 5 }}>
                                      <AttachMoney sx={{ mr: 1, color: 'text.secondary' }} />
                                      <Typography variant="subtitle2" className="cost-section-title">
                                        Cost Information
                                      </Typography>
                                    </Box>
                                  </Grid>

                                  <Grid item xs={12} sm={6}>
                                    <ToggleButtonGroup 
                                      value={activity.costMode} 
                                      exclusive 
                                      onChange={(_, mode) => updateActivity(activity.id, 'costMode', mode)} 
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
                                        onChange={e => updateActivity(activity.id, 'cost', e.target.value)}
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
                                          onChange={e => updateActivity(activity.id, 'minCost', e.target.value)}
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
                                          onChange={e => updateActivity(activity.id, 'maxCost', e.target.value)}
                                          InputProps={{ inputProps: { min: 0 } }}
                                          className="form-input"
                                        />
                                      </Grid>
                                    </>
                                  )}

                                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                    <Button 
                                      variant="outlined"
                                      size="small"
                                      onClick={() => updateActivity(activity.id, 'isCompleted', true)}
                                      disabled={!activity.name}
                                    >
                                      Complete
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </AnimatePresence>
                  </Box>
                )}
              </AnimatePresence>
            )}

          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Activity Support Section */}
          <Box>
            <Typography variant="h4" className="section-title" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              Activity Support
              <Tooltip title="Pick the items that may be required to make your activity happen or select the options for your friends and family to vote on.">
                <InfoOutlined fontSize="small" />
              </Tooltip>
            </Typography>

            {Object.entries(supportCategories).map(([categoryKey, category]) => (
              <Box key={categoryKey} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" className="section-title" sx={{ mb: 2 }}>
                  {category.name}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {category.options.map((option) => (
                    <Chip
                      key={option}
                      label={option}
                      onClick={() => addActivitySupport(categoryKey, option)}
                      color={activitySupports.some(s => s.option === option) ? "primary" : "default"}
                      variant={activitySupports.some(s => s.option === option) ? "filled" : "outlined"}
                    />
                  ))}
                </Box>
              </Box>
            ))}

          {/* Selected Support Options */}
          {activitySupports.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" className="section-title" sx={{ mb: 2 }}>
                Selected Support Options
              </Typography>
              {activitySupports.map((support) => (
                <Card key={support.id} className="activity-card" sx={{ mb: 2 }}>
                  <CardContent>

                    {support.isCompleted ? (
                      // — Collapsed summary view —
                      <Box>
                        <Box className="activity-option-header">
                          <Typography variant="subtitle2">
                            {support.customLabel || support.option} ({supportCategories[support.category].name})
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => updateActivitySupport(support.id, 'isCompleted', false)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Box>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Cost:{' '}
                          {support.costMode === 'fixed'
                            ? `$${support.cost}`
                            : `$${support.minCost} – $${support.maxCost}`}
                        </Typography>
                        {support.isVotable && (
                          <Chip label="Voting" size="small" sx={{ mt: 1 }} />
                        )}
                      </Box>

                    ) : (
                      // — Full edit form view —
                      <>
                        <Box className="activity-option-header">
                          <Typography variant="subtitle2">
                            {support.option} ({supportCategories[support.category].name})
                          </Typography>
                          <IconButton
                            color="error"
                            onClick={() => removeActivitySupport(support.id)}
                            size="small"
                          >
                            <DeleteOutline />
                          </IconButton>
                        </Box>

                        <Box sx={{ mt: 2 }}>
                          <TextField
                            fullWidth
                            label="Custom Label or Note"
                            value={support.customLabel || ''}
                            onChange={e => updateActivitySupport(support.id, 'customLabel', e.target.value)}
                            placeholder="e.g., Delta from SLC"
                          />
                        </Box>

                        <Grid container spacing={2} sx={{ mt: 1 }}>
                          <Grid item xs={12} sm={4}>
                            <ToggleButtonGroup
                              value={support.costMode}
                              exclusive
                              onChange={(_, mode) => updateActivitySupport(support.id, 'costMode', mode)}
                              size="small"
                            >
                              <ToggleButton value="fixed">Fixed</ToggleButton>
                              <ToggleButton value="range">Range</ToggleButton>
                            </ToggleButtonGroup>
                          </Grid>

                          {support.costMode === 'fixed' && (
                            <Grid item xs={12} sm={4}>
                              <TextField
                                fullWidth
                                label="Cost ($)"
                                type="number"
                                value={support.cost}
                                onChange={e => updateActivitySupport(support.id, 'cost', e.target.value)}
                                InputProps={{ inputProps: { min: 0 } }}
                              />
                            </Grid>
                          )}

                          {support.costMode === 'range' && (
                            <>
                              <Grid item xs={6} sm={2}>
                                <TextField
                                  fullWidth
                                  label="Min ($)"
                                  type="number"
                                  value={support.minCost}
                                  onChange={e => updateActivitySupport(support.id, 'minCost', e.target.value)}
                                  InputProps={{ inputProps: { min: 0 } }}
                                />
                              </Grid>
                              <Grid item xs={6} sm={2}>
                                <TextField
                                  fullWidth
                                  label="Max ($)"
                                  type="number"
                                  value={support.maxCost}
                                  onChange={e => updateActivitySupport(support.id, 'maxCost', e.target.value)}
                                  InputProps={{ inputProps: { min: 0 } }}
                                />
                              </Grid>
                            </>
                          )}

                          <Grid item xs={12} sm={4}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={support.isVotable}
                                  onChange={e => updateActivitySupport(support.id, 'isVotable', e.target.checked)}
                                />
                              }
                              label="Votable option"
                            />
                          </Grid>

                          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => updateActivitySupport(support.id, 'isCompleted', true)}
                              disabled={
                                support.costMode === 'fixed'
                                  ? support.cost === ''
                                  : support.minCost === '' || support.maxCost === ''
                              }
                            >
                              Complete
                            </Button>
                          </Grid>
                        </Grid>
                      </>
                    )}

                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

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