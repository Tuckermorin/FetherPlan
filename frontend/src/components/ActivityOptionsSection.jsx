import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  FormControlLabel,
  Switch,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Chip
} from '@mui/material';
import { AddCircle, DeleteOutline, EventNote, AccessTime, AttachMoney, Edit } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

export default function ActivityOptionsSection({ activities, addActivity, updateActivity, removeActivity }) {
  return (
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
                                    onChange={e => updateActivity(activity.id, 'isVotable', e.target.checked)}
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
                                    onChange={e => updateActivity(activity.id, 'equipmentEnabled', e.target.checked)}
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
                                    onChange={e => updateActivity(activity.id, 'isVotable', e.target.checked)}
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
                                    onChange={e => updateActivity(activity.id, 'equipmentEnabled', e.target.checked)}
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
  );
}
