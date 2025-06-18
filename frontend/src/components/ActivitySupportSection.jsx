import React from 'react';
import {
  Box,
  Typography,
  Tooltip,
  Chip,
  Card,
  CardContent,
  IconButton,
  TextField,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  FormControlLabel,
  Switch,
  Button
} from '@mui/material';
import { InfoOutlined, DeleteOutline, Edit } from '@mui/icons-material';

export default function ActivitySupportSection({ supportCategories, activitySupports, addActivitySupport, updateActivitySupport, removeActivitySupport }) {
  return (
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
                color={activitySupports.some(s => s.option === option) ? 'primary' : 'default'}
                variant={activitySupports.some(s => s.option === option) ? 'filled' : 'outlined'}
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
                  <Box>
                    <Box className="activity-option-header">
                      <Typography variant="subtitle2">
                        {support.customLabel || support.option} ({supportCategories[support.category].name})
                      </Typography>
                      <IconButton size="small" onClick={() => updateActivitySupport(support.id, 'isCompleted', false)}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Cost: {support.costMode === 'fixed' ? `$${support.cost}` : `$${support.minCost} – $${support.maxCost}`}
                    </Typography>
                    {support.isVotable && (
                      <Chip label="Voting" size="small" sx={{ mt: 1 }} />
                    )}
                  </Box>
                ) : (
                  <>
                    <Box className="activity-option-header">
                      <Typography variant="subtitle2">
                        {support.option} ({supportCategories[support.category].name})
                      </Typography>
                      <IconButton color="error" onClick={() => removeActivitySupport(support.id)} size="small">
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
                          disabled={support.costMode === 'fixed' ? support.cost === '' : support.minCost === '' || support.maxCost === ''}
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
  );
}
