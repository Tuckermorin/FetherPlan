import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  Divider,
  Card,
  CardContent,
  CardActions,
  Chip,
  Grid,
  TextField,
  Snackbar,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Alert
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const PreviewEvent = ({ 
  eventData, 
  dateTimeData, 
  activities, 
  activitySupports, 
  requiredActivityCount,
  requiredSupportCount,
  onEdit,
  onConfirm
}) => {
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedSupports, setSelectedSupports] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishedEvent, setPublishedEvent] = useState(null);
  const [publishError, setPublishError] = useState('');
  const [shareableLink, setShareableLink] = useState('');
  const [copyOpen, setCopyOpen] = useState(false);
  const [phones, setPhones] = useState([]);
  const [phoneInput, setPhoneInput] = useState('');
  const [sendingInvites, setSendingInvites] = useState(false);
  const [inviteSnack, setInviteSnack] = useState({ open: false, message: '', severity: 'success' });

  // Separate activities into fixed and votable
  const fixedActivities = activities.filter(a => !a.isVotable);
  const votableActivities = activities.filter(a => a.isVotable);

  // Separate supports into fixed and votable
  const fixedSupports = activitySupports.filter(s => !s.isVotable);
  const votableSupports = activitySupports.filter(s => s.isVotable);

  const handleActivitySelection = (activityId) => {
    setSelectedActivities(prev => {
      if (prev.includes(activityId)) {
        return prev.filter(id => id !== activityId);
      } else {
        if (requiredActivityCount && prev.length >= parseInt(requiredActivityCount)) {
          return [...prev.slice(1), activityId]; // Replace oldest selection
        }
        return [...prev, activityId];
      }
    });
  };

  const handleSupportSelection = (supportId) => {
    setSelectedSupports(prev => {
      if (prev.includes(supportId)) {
        return prev.filter(id => id !== supportId);
      } else {
        if (requiredSupportCount && prev.length >= parseInt(requiredSupportCount)) {
          return [...prev.slice(1), supportId]; // Replace oldest selection
        }
        return [...prev, supportId];
      }
    });
  };

  const calculateTotalCost = () => {
    let total = 0;
    
    // Add all fixed activities to the total
    fixedActivities.forEach(activity => {
      if (activity.costMode === 'fixed' && activity.cost) {
        total += parseFloat(activity.cost);
      } else if (activity.costMode === 'range' && activity.minCost) {
        total += parseFloat(activity.minCost); // Use minimum for estimation
      }
    });

    // Add all fixed supports to the total
    fixedSupports.forEach(support => {
      if (support.costMode === 'fixed' && support.cost) {
        total += parseFloat(support.cost);
      } else if (support.costMode === 'range' && support.minCost) {
        total += parseFloat(support.minCost); // Use minimum for estimation
      }
    });
    
    // Calculate selected votable activity costs
    selectedActivities.forEach(activityId => {
      const activity = votableActivities.find(a => a.id === activityId);
      if (activity) {
        if (activity.costMode === 'fixed' && activity.cost) {
          total += parseFloat(activity.cost);
        } else if (activity.costMode === 'range' && activity.minCost) {
          total += parseFloat(activity.minCost); // Use minimum for estimation
        }
      }
    });

    // Calculate selected votable support costs
    selectedSupports.forEach(supportId => {
      const support = votableSupports.find(s => s.id === supportId);
      if (support) {
        if (support.costMode === 'fixed' && support.cost) {
          total += parseFloat(support.cost);
        } else if (support.costMode === 'range' && support.minCost) {
          total += parseFloat(support.minCost); // Use minimum for estimation
        }
      }
    });

    return total;
  };

  const getCostDisplay = (item) => {
    if (item.costMode === 'fixed' && item.cost) {
      return `$${item.cost}`;
    } else if (item.costMode === 'range' && item.minCost && item.maxCost) {
      return `$${item.minCost} - $${item.maxCost}`;
    }
    return 'Cost TBD';
  };

  const getDateRangeOptions = () => {
    if (!dateTimeData.allowParticipantSelection || !dateTimeData.startDate || !dateTimeData.endDate) {
      return [];
    }
    
    const start = new Date(dateTimeData.startDate);
    const end = new Date(dateTimeData.endDate);
    const dates = [];
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      dates.push(new Date(date).toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const handleDateSelection = (date) => {
    setSelectedDates(prev => {
      if (prev.includes(date)) {
        return prev.filter(d => d !== date);
      } else {
        const requiredCount = parseInt(dateTimeData.requiredDayCount) || 1;
        if (prev.length >= requiredCount) {
          return [...prev.slice(1), date]; // Replace oldest selection
        }
        return [...prev, date];
      }
    });
  };

  const renderCalendar = () => {
    const availableDates = getDateRangeOptions();
    if (availableDates.length === 0) return null;

    const startDate = new Date(dateTimeData.startDate);
    const endDate = new Date(dateTimeData.endDate);
    
    // Get the first day of the month containing the start date
    const calendarStart = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const calendarEnd = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
    
    const weeks = [];
    let currentDate = new Date(calendarStart);
    
    // Start from the Sunday before the first day of the month
    currentDate.setDate(currentDate.getDate() - currentDate.getDay());
    
    while (currentDate <= calendarEnd) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push(week);
    }

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Select Your Available Dates
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Select {dateTimeData.requiredDayCount || 1} day{(dateTimeData.requiredDayCount || 1) > 1 ? 's' : ''} from the available range
        </Typography>
        
        <Box sx={{ border: 1, borderColor: 'grey.300', borderRadius: 1, p: 2, mt: 2 }}>
          {/* Calendar Header */}
          <Grid container spacing={0} sx={{ mb: 1 }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <Grid item xs key={day}>
                <Typography variant="body2" align="center" fontWeight="bold">
                  {day}
                </Typography>
              </Grid>
            ))}
          </Grid>
          
          {/* Calendar Body */}
          {weeks.map((week, weekIndex) => (
            <Grid container spacing={0} key={weekIndex}>
              {week.map((date, dayIndex) => {
                const dateStr = date.toISOString().split('T')[0];
                const isAvailable = availableDates.includes(dateStr);
                const isSelected = selectedDates.includes(dateStr);
                const isOutOfRange = date < startDate || date > endDate;
                
                return (
                  <Grid item xs key={dayIndex}>
                    <Button
                      variant={isSelected ? "contained" : "outlined"}
                      size="small"
                      onClick={() => isAvailable && handleDateSelection(dateStr)}
                      disabled={!isAvailable}
                      sx={{
                        minWidth: 0,
                        width: '100%',
                        height: 40,
                        fontSize: '0.75rem',
                        color: isOutOfRange ? 'grey.400' : 'inherit',
                        backgroundColor: isSelected ? 'primary.main' : 'inherit',
                        '&:hover': {
                          backgroundColor: isAvailable && !isSelected ? 'primary.light' : 'inherit'
                        }
                      }}
                    >
                      {date.getDate()}
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
          ))}
        </Box>
        
        {selectedDates.length > 0 && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Selected Dates ({selectedDates.length}/{dateTimeData.requiredDayCount || 1}):
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedDates.map(date => (
                <Chip 
                  key={date} 
                  label={new Date(date).toLocaleDateString()}
                  onDelete={() => handleDateSelection(date)}
                  size="small"
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  // Publish event to backend
  const handlePublish = async () => {
    const payload = {
      eventData,
      dateTimeData,
      activities,
      activitySupports,
      requiredActivityCount,
      requiredSupportCount
    };

    setPublishing(true);
    setPublishError('');
    try {
      const res = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `HTTP error! status: ${res.status}`);
      }
      
      const saved = await res.json();
      setPublishedEvent(saved);
      const url = saved.shareableLink || `${window.location.origin}/events/${saved._id}`;
      setShareableLink(url);
    } catch (err) {
      setPublishError(`Failed to create event: ${err.message}`);
    } finally {
      setPublishing(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopyOpen(true);
    } catch {
      setCopyOpen(true);
    }
  };

  const addPhone = () => {
    const val = phoneInput.trim();
    if (val && !phones.includes(val)) {
      setPhones(prev => [...prev, val]);
    }
    setPhoneInput('');
  };

  const handlePhoneKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPhone();
    }
  };

  const removePhone = (p) => {
    setPhones(prev => prev.filter(ph => ph !== p));
  };

  const sendInvites = async () => {
    if (!publishedEvent) return;
    setSendingInvites(true);
    try {
      const res = await fetch(`/api/events/${publishedEvent._id}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: publishedEvent._id, phones })
      });
      if (!res.ok) throw new Error();
      setInviteSnack({ open: true, severity: 'success', message: 'Invites sent!' });
    } catch (err) {
      console.error(err);
      setInviteSnack({ open: true, severity: 'error', message: 'Failed to send invites' });
    } finally {
      setSendingInvites(false);
    }
  };

  if (publishedEvent) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Stepper activeStep={1} sx={{ mb: 3 }}>
          <Step completed>
            <StepLabel>Preview</StepLabel>
          </Step>
          <Step completed>
            <StepLabel>Publish</StepLabel>
          </Step>
        </Stepper>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Your event has been created!
          </Typography>
          {publishError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {publishError}
            </Alert>
          )}
          <TextField
            label="Shareable Link"
            fullWidth
            value={shareableLink}
            InputProps={{ readOnly: true }}
            sx={{ mb: 2 }}
          />
          <Button
            variant="outlined"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyLink}
            sx={{ mb: 3 }}
          >
            Copy Link
          </Button>

          <Box sx={{ mb: 2 }}>
            <TextField
              label="Add phone number"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              onKeyDown={handlePhoneKey}
              size="small"
              sx={{ mr: 1 }}
            />
            <Button onClick={addPhone}>Add</Button>
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {phones.map((p) => (
                <Chip key={p} label={p} onDelete={() => removePhone(p)} />
              ))}
            </Box>
          </Box>

          <Button
            variant="contained"
            onClick={sendInvites}
            disabled={sendingInvites || phones.length === 0}
          >
            {sendingInvites ? <CircularProgress size={24} /> : 'Send Invites'}
          </Button>
        </Paper>
        <Snackbar
          open={copyOpen}
          autoHideDuration={3000}
          onClose={() => setCopyOpen(false)}
        >
          <Alert onClose={() => setCopyOpen(false)} severity="success">
            Link copied!
          </Alert>
        </Snackbar>
        <Snackbar
          open={inviteSnack.open}
          autoHideDuration={4000}
          onClose={() => setInviteSnack({ ...inviteSnack, open: false })}
        >
          <Alert
            onClose={() => setInviteSnack({ ...inviteSnack, open: false })}
            severity={inviteSnack.severity}
          >
            {inviteSnack.message}
          </Alert>
        </Snackbar>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Participant View of Event Invite
      </Typography>

      <Typography variant="h6" align="center" gutterBottom>
        This is the view your participants will see. Feel free to click around and "explore" as someone who was sent this link.
      </Typography>

      <Paper elevation={3} style={{ padding: '2rem', marginBottom: '2rem' }}>
        {/* Event Basic Info */}
        <Typography variant="h2" gutterBottom>
          {eventData.name || 'Unnamed Event'}
        </Typography>

        <Typography variant="body1" paragraph>
          {eventData.description || 'No description provided.'}
        </Typography>

        {/* Date & Time Display */}
        {dateTimeData.dateMode === 'single' && (
          <Box display="flex" alignItems="center" mb={2}>
            <EventIcon color="action" style={{ marginRight: '8px' }} />
            <Typography variant="subtitle1">
              Date: {dateTimeData.date || 'Not set'} 
              {dateTimeData.time ? ` at ${dateTimeData.time}` : ''}
            </Typography>
          </Box>
        )}

        {dateTimeData.dateMode === 'range' && !dateTimeData.allowParticipantSelection && (
          <Box display="flex" alignItems="center" mb={2}>
            <EventIcon color="action" style={{ marginRight: '8px' }} />
            <Typography variant="subtitle1">
              From: {dateTimeData.startDate || 'Not set'} To: {dateTimeData.endDate || 'Not set'}
              {dateTimeData.time ? ` at ${dateTimeData.time}` : ''}
            </Typography>
          </Box>
        )}

        {dateTimeData.dateMode === 'range' && dateTimeData.allowParticipantSelection && (
          <>
            <Box display="flex" alignItems="center" mb={2}>
              <EventIcon color="action" style={{ marginRight: '8px' }} />
              <Typography variant="subtitle1">
                Event Period: {dateTimeData.startDate || 'Not set'} to {dateTimeData.endDate || 'Not set'}
                {dateTimeData.time ? ` at ${dateTimeData.time}` : ''}
              </Typography>
            </Box>
            
            {!showCalendar ? (
              <Box sx={{ mt: 2, p: 2, border: 1, borderColor: 'grey.300', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Date Selection Required
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Please select {dateTimeData.requiredDayCount || 1} day{(dateTimeData.requiredDayCount || 1) > 1 ? 's' : ''} that work for you within the event period.
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => setShowCalendar(true)}
                  sx={{ mt: 1 }}
                >
                  Select Available Dates
                </Button>
              </Box>
            ) : (
              <>
                {renderCalendar()}
                <Box sx={{ mt: 2 }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => setShowCalendar(false)}
                    sx={{ mr: 1 }}
                  >
                    Hide Calendar
                  </Button>
                  {selectedDates.length < (parseInt(dateTimeData.requiredDayCount) || 1) && (
                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                      Please select {(parseInt(dateTimeData.requiredDayCount) || 1) - selectedDates.length} more day{((parseInt(dateTimeData.requiredDayCount) || 1) - selectedDates.length) > 1 ? 's' : ''}.
                    </Typography>
                  )}
                </Box>
              </>
            )}
          </>
        )}

        <Divider style={{ margin: '1.5rem 0' }} />

        {/* Fixed Activities Section */}
        {fixedActivities.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              Fixed Activities
              <Chip label="Required" size="small" color="default" sx={{ ml: 2 }} />
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              These activities are automatically included in your event.
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              {fixedActivities.map((activity) => (
                <Grid item xs={12} md={6} key={activity.id}>
                  <Card sx={{ border: '2px solid #e0e0e0', backgroundColor: '#f5f5f5' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {activity.name}
                        <Chip label="Fixed" size="small" sx={{ ml: 1 }} />
                      </Typography>
                      
                      {activity.timeCommitment && (
                        <Box display="flex" alignItems="center" mb={1}>
                          <AccessTimeIcon fontSize="small" style={{ marginRight: '4px' }} />
                          <Typography variant="body2">{activity.timeCommitment}</Typography>
                        </Box>
                      )}

                      <Box display="flex" alignItems="center" mb={1}>
                        <AttachMoneyIcon fontSize="small" style={{ marginRight: '4px' }} />
                        <Typography variant="body2" color="primary">
                          {getCostDisplay(activity)}
                        </Typography>
                      </Box>

                      {activity.equipmentEnabled && activity.equipmentItems && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Equipment needed: {activity.equipmentItems}
                        </Typography>
                      )}

                      {activity.link && (
                        <CardActions>
                          <Button size="small" href={activity.link} target="_blank">
                            Learn More
                          </Button>
                        </CardActions>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Votable Activities Section */}
        {votableActivities.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              Votable Activities
              {requiredActivityCount && (
                <Chip 
                  label={`Select ${requiredActivityCount}`} 
                  size="small" 
                  color="primary" 
                  sx={{ ml: 2 }} 
                />
              )}
            </Typography>
            
            {requiredActivityCount && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Please select {requiredActivityCount} activit{requiredActivityCount > 1 ? 'ies' : 'y'} from the options below.
              </Alert>
            )}

            <Grid container spacing={2} sx={{ mb: 3 }}>
              {votableActivities.map((activity) => (
                <Grid item xs={12} md={6} key={activity.id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      border: selectedActivities.includes(activity.id) ? '2px solid #1976d2' : '1px solid #e0e0e0',
                      '&:hover': { boxShadow: 2 }
                    }}
                    onClick={() => handleActivitySelection(activity.id)}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {activity.name}
                        <Chip label="Voting" size="small" color="primary" sx={{ ml: 1 }} />
                      </Typography>
                      
                      {activity.timeCommitment && (
                        <Box display="flex" alignItems="center" mb={1}>
                          <AccessTimeIcon fontSize="small" style={{ marginRight: '4px' }} />
                          <Typography variant="body2">{activity.timeCommitment}</Typography>
                        </Box>
                      )}

                      <Box display="flex" alignItems="center" mb={1}>
                        <AttachMoneyIcon fontSize="small" style={{ marginRight: '4px' }} />
                        <Typography variant="body2" color="primary">
                          {getCostDisplay(activity)}
                        </Typography>
                      </Box>

                      {activity.equipmentEnabled && activity.equipmentItems && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Equipment needed: {activity.equipmentItems}
                        </Typography>
                      )}

                      {activity.link && (
                        <CardActions>
                          <Button size="small" href={activity.link} target="_blank">
                            Learn More
                          </Button>
                        </CardActions>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        <Divider style={{ margin: '1.5rem 0' }} />

        {/* Fixed Support Options Section */}
        {fixedSupports.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              Fixed Support Options
              <Chip label="Required" size="small" color="default" sx={{ ml: 2 }} />
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              These support options are automatically included in your event.
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              {fixedSupports.map((support) => (
                <Grid item xs={12} md={6} key={support.id}>
                  <Card sx={{ border: '2px solid #e0e0e0', backgroundColor: '#f5f5f5' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {support.customLabel || support.option}
                        <Chip label="Fixed" size="small" sx={{ ml: 1 }} />
                      </Typography>
                      
                      <Box display="flex" alignItems="center" mb={1}>
                        <AttachMoneyIcon fontSize="small" style={{ marginRight: '4px' }} />
                        <Typography variant="body2" color="primary">
                          {getCostDisplay(support)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Votable Support Options Section */}
        {votableSupports.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              Votable Support Options
              {requiredSupportCount && (
                <Chip 
                  label={`Select ${requiredSupportCount}`} 
                  size="small" 
                  color="primary" 
                  sx={{ ml: 2 }} 
                />
              )}
            </Typography>

            {requiredSupportCount && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Please select {requiredSupportCount} support option{requiredSupportCount > 1 ? 's' : ''} from the categories below.
              </Alert>
            )}

            <Grid container spacing={2} sx={{ mb: 3 }}>
              {votableSupports.map((support) => (
                <Grid item xs={12} md={6} key={support.id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      border: selectedSupports.includes(support.id) ? '2px solid #1976d2' : '1px solid #e0e0e0',
                      '&:hover': { boxShadow: 2 }
                    }}
                    onClick={() => handleSupportSelection(support.id)}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {support.customLabel || support.option}
                        <Chip label="Voting" size="small" color="primary" sx={{ ml: 1 }} />
                      </Typography>
                      
                      <Box display="flex" alignItems="center" mb={1}>
                        <AttachMoneyIcon fontSize="small" style={{ marginRight: '4px' }} />
                        <Typography variant="body2" color="primary">
                          {getCostDisplay(support)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        <Divider style={{ margin: '1.5rem 0' }} />

        {/* Selection Summary */}
        <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Cost Summary
          </Typography>
          
          {/* Fixed costs always included */}
          {(fixedActivities.length > 0 || fixedSupports.length > 0) && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Fixed Costs (Included):
              </Typography>
              {fixedActivities.map(activity => (
                <Typography variant="body2" key={activity.id} sx={{ ml: 2 }}>
                  • {activity.name}: {getCostDisplay(activity)}
                </Typography>
              ))}
              {fixedSupports.map(support => (
                <Typography variant="body2" key={support.id} sx={{ ml: 2 }}>
                  • {support.customLabel || support.option}: {getCostDisplay(support)}
                </Typography>
              ))}
            </Box>
          )}
          
          {/* Selected votable costs */}
          {(selectedActivities.length > 0 || selectedSupports.length > 0) && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Selected Options:
              </Typography>
              {selectedActivities.map(activityId => {
                const activity = votableActivities.find(a => a.id === activityId);
                return activity ? (
                  <Typography variant="body2" key={activityId} sx={{ ml: 2 }}>
                    • {activity.name}: {getCostDisplay(activity)}
                  </Typography>
                ) : null;
              })}
              {selectedSupports.map(supportId => {
                const support = votableSupports.find(s => s.id === supportId);
                return support ? (
                  <Typography variant="body2" key={supportId} sx={{ ml: 2 }}>
                    • {support.customLabel || support.option}: {getCostDisplay(support)}
                  </Typography>
                ) : null;
              })}
            </Box>
          )}
          
          <Typography variant="subtitle1" color="primary" sx={{ mt: 2, fontWeight: 600 }}>
            Estimated Total: {(() => {
              let minTotal = 0;
              let maxTotal = 0;
              let hasRanges = false;

              // Add all fixed activities
              fixedActivities.forEach(activity => {
                if (activity.costMode === 'fixed' && activity.cost) {
                  minTotal += parseFloat(activity.cost);
                  maxTotal += parseFloat(activity.cost);
                } else if (activity.costMode === 'range' && activity.minCost && activity.maxCost) {
                  minTotal += parseFloat(activity.minCost);
                  maxTotal += parseFloat(activity.maxCost);
                  hasRanges = true;
                }
              });

              // Add all fixed supports
              fixedSupports.forEach(support => {
                if (support.costMode === 'fixed' && support.cost) {
                  minTotal += parseFloat(support.cost);
                  maxTotal += parseFloat(support.cost);
                } else if (support.costMode === 'range' && support.minCost && support.maxCost) {
                  minTotal += parseFloat(support.minCost);
                  maxTotal += parseFloat(support.maxCost);
                  hasRanges = true;
                }
              });

              // Add selected votable activities
              selectedActivities.forEach(activityId => {
                const activity = votableActivities.find(a => a.id === activityId);
                if (activity) {
                  if (activity.costMode === 'fixed' && activity.cost) {
                    minTotal += parseFloat(activity.cost);
                    maxTotal += parseFloat(activity.cost);
                  } else if (activity.costMode === 'range' && activity.minCost && activity.maxCost) {
                    minTotal += parseFloat(activity.minCost);
                    maxTotal += parseFloat(activity.maxCost);
                    hasRanges = true;
                  }
                }
              });

              // Add selected votable supports
              selectedSupports.forEach(supportId => {
                const support = votableSupports.find(s => s.id === supportId);
                if (support) {
                  if (support.costMode === 'fixed' && support.cost) {
                    minTotal += parseFloat(support.cost);
                    maxTotal += parseFloat(support.cost);
                  } else if (support.costMode === 'range' && support.minCost && support.maxCost) {
                    minTotal += parseFloat(support.minCost);
                    maxTotal += parseFloat(support.maxCost);
                    hasRanges = true;
                  }
                }
              });

              // If there are any ranges OR if we have any costs at all, show as range
              if (minTotal === maxTotal && minTotal > 0) {
                // All fixed costs, but show as range for consistency
                return `$${minTotal.toFixed(2)} - $${(maxTotal * 1.1).toFixed(2)}*`;
              } else if (minTotal !== maxTotal) {
                // Mixed or range costs
                return `$${minTotal.toFixed(2)} - $${maxTotal.toFixed(2)}`;
              } else {
                return '$0.00';
              }
            })()}
          </Typography>
          
        </Box>
      </Paper>

      {/* Action Buttons */}
      <Box display="flex" justifyContent="space-between">
        <Button variant="outlined" color="primary" onClick={onEdit}>
          Edit Event (Admin View)
        </Button>
        <Button variant="contained" color="success" onClick={onConfirm || handlePublish} disabled={publishing}>
          {publishing ? <CircularProgress size={24} /> : 'Publish Event'}
        </Button>
      </Box>
    </Container>
  );
};

export default PreviewEvent;