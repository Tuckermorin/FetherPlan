// frontend/src/components/FormComponents.jsx (Simplified Version)
import React from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Switch,
  FormControlLabel,
  Chip,
  Box,
  Button,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

// Enhanced TextField with form validation
export const FormTextField = ({
  name,
  control,
  rules = {},
  label,
  required = false,
  multiline = false,
  rows = 1,
  type = 'text',
  startAdornment,
  endAdornment,
  placeholder,
  ...props
}) => (
  <Controller
    name={name}
    control={control}
    rules={{
      required: required ? `${label} is required` : false,
      ...rules,
    }}
    render={({ field, fieldState: { error } }) => (
      <TextField
        {...field}
        {...props}
        label={label}
        error={!!error}
        helperText={error?.message}
        fullWidth
        multiline={multiline}
        rows={multiline ? rows : undefined}
        type={type}
        required={required}
        placeholder={placeholder}
        InputProps={{
          startAdornment,
          endAdornment,
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          },
        }}
      />
    )}
  />
);

// Enhanced Select with form validation
export const FormSelect = ({
  name,
  control,
  rules = {},
  label,
  required = false,
  options = [],
  ...props
}) => (
  <Controller
    name={name}
    control={control}
    rules={{
      required: required ? `${label} is required` : false,
      ...rules,
    }}
    render={({ field, fieldState: { error } }) => (
      <FormControl fullWidth error={!!error}>
        <InputLabel required={required}>{label}</InputLabel>
        <Select
          {...field}
          {...props}
          label={label}
          sx={{
            borderRadius: 2,
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText>{error.message}</FormHelperText>}
      </FormControl>
    )}
  />
);

// Simple date picker using HTML5 date input
export const FormDatePicker = ({
  name,
  control,
  rules = {},
  label,
  required = false,
  ...props
}) => (
  <Controller
    name={name}
    control={control}
    rules={{
      required: required ? `${label} is required` : false,
      ...rules,
    }}
    render={({ field, fieldState: { error } }) => (
      <TextField
        {...field}
        {...props}
        label={label}
        type="date"
        fullWidth
        error={!!error}
        helperText={error?.message}
        required={required}
        InputLabelProps={{ shrink: true }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          },
        }}
      />
    )}
  />
);

// Simple time picker using HTML5 time input
export const FormTimePicker = ({
  name,
  control,
  rules = {},
  label,
  required = false,
  ...props
}) => (
  <Controller
    name={name}
    control={control}
    rules={{
      required: required ? `${label} is required` : false,
      ...rules,
    }}
    render={({ field, fieldState: { error } }) => (
      <TextField
        {...field}
        {...props}
        label={label}
        type="time"
        fullWidth
        error={!!error}
        helperText={error?.message}
        required={required}
        InputLabelProps={{ shrink: true }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          },
        }}
      />
    )}
  />
);

// Switch with form integration
export const FormSwitch = ({
  name,
  control,
  label,
  ...props
}) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <FormControlLabel
        control={
          <Switch
            {...field}
            checked={field.value || false}
            {...props}
          />
        }
        label={label}
      />
    )}
  />
);

// Toggle Button Group with form integration
export const FormToggleGroup = ({
  name,
  control,
  options = [],
  rules = {},
  required = false,
  ...props
}) => (
  <Controller
    name={name}
    control={control}
    rules={{
      required: required ? 'Please select an option' : false,
      ...rules,
    }}
    render={({ field, fieldState: { error } }) => (
      <Box>
        <ToggleButtonGroup
          {...field}
          {...props}
          exclusive
          onChange={(_, value) => field.onChange(value)}
          sx={{
            '& .MuiToggleButton-root': {
              borderRadius: 2,
              px: 3,
              py: 1,
            },
          }}
        >
          {options.map((option) => (
            <ToggleButton key={option.value} value={option.value}>
              {option.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        {error && (
          <FormHelperText error sx={{ mt: 1 }}>
            {error.message}
          </FormHelperText>
        )}
      </Box>
    )}
  />
);

// Tags input with form integration
export const FormTagsInput = ({
  name,
  control,
  label,
  placeholder = 'Add tag and press Enter',
  ...props
}) => {
  const [inputValue, setInputValue] = React.useState('');

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({ field }) => (
        <Box>
          <TextField
            fullWidth
            label={label}
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputValue.trim()) {
                e.preventDefault();
                const newTag = inputValue.trim();
                if (!field.value.includes(newTag)) {
                  field.onChange([...field.value, newTag]);
                }
                setInputValue('');
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
            {...props}
          />
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {field.value.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => {
                  const newTags = field.value.filter((_, i) => i !== index);
                  field.onChange(newTags);
                }}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}
    />
  );
};

// Dynamic array field component
export const FormArrayField = ({
  name,
  control,
  renderField,
  addButtonText = 'Add Item',
  defaultValue = {},
  minItems = 0,
  maxItems = 10,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <Box>
      {fields.map((field, index) => (
        <Box key={field.id} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <Box sx={{ flexGrow: 1 }}>
              {renderField(field, index)}
            </Box>
            {fields.length > minItems && (
              <IconButton
                color="error"
                onClick={() => remove(index)}
                sx={{ mt: 1 }}
              >
                <Delete />
              </IconButton>
            )}
          </Box>
        </Box>
      ))}
      
      {fields.length < maxItems && (
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={() => append(defaultValue)}
          sx={{ mt: 1 }}
        >
          {addButtonText}
        </Button>
      )}
    </Box>
  );
};

// Form validation schemas
export const validationRules = {
  required: (fieldName) => ({
    required: `${fieldName} is required`,
  }),
  
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address',
    },
  },
  
  phone: {
    pattern: {
      value: /^[+]?[1-9][\d]{0,15}$/,
      message: 'Invalid phone number',
    },
  },
  
  url: {
    pattern: {
      value: /^https?:\/\/.+\..+/,
      message: 'Invalid URL format',
    },
  },
  
  minLength: (length) => ({
    minLength: {
      value: length,
      message: `Minimum ${length} characters required`,
    },
  }),
  
  maxLength: (length) => ({
    maxLength: {
      value: length,
      message: `Maximum ${length} characters allowed`,
    },
  }),
  
  number: {
    pattern: {
      value: /^\d+$/,
      message: 'Must be a number',
    },
  },
  
  positiveNumber: {
    pattern: {
      value: /^[1-9]\d*$/,
      message: 'Must be a positive number',
    },
  },
  
  currency: {
    pattern: {
      value: /^\d+(\.\d{1,2})?$/,
      message: 'Invalid currency format',
    },
  },
};