// frontend/src/hooks/useApi.js
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { handleApiError } from '../components/ErrorHandling';
import { useNotification } from '../components/ErrorHandling';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Axios instance with interceptors
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add loading state or auth tokens here
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Event API functions
export const eventApi = {
  // Get all events
  getEvents: () => apiClient.get('/events').then(res => res.data),
  
  // Get single event
  getEvent: (id) => apiClient.get(`/events/${id}`).then(res => res.data),
  
  // Create event
  createEvent: (eventData) => apiClient.post('/events', eventData).then(res => res.data),
  
  // Update event
  updateEvent: (id, eventData) => apiClient.put(`/events/${id}`, eventData).then(res => res.data),
  
  // Delete event
  deleteEvent: (id) => apiClient.delete(`/events/${id}`).then(res => res.data),
  
  // Add suggestions
  addSuggestions: (id, suggestions) => 
    apiClient.put(`/events/${id}/suggestions`, suggestions).then(res => res.data),
  
  // Vote on activity
  voteOnActivity: (eventId, activityId, vote) =>
    apiClient.put(`/events/${eventId}/activities/${activityId}/vote`, vote).then(res => res.data),
};

// Custom hooks using React Query
export const useEvents = (options = {}) => {
  const { showNotification } = useNotification();
  
  return useQuery({
    queryKey: ['events'],
    queryFn: eventApi.getEvents,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    onError: (error) => handleApiError(error, showNotification),
    ...options,
  });
};

export const useEvent = (id, options = {}) => {
  const { showNotification } = useNotification();
  
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => eventApi.getEvent(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    onError: (error) => handleApiError(error, showNotification),
    ...options,
  });
};

export const useCreateEvent = (options = {}) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  
  return useMutation({
    mutationFn: eventApi.createEvent,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['events']);
      showNotification('Event created successfully!', 'success');
      options.onSuccess?.(data);
    },
    onError: (error) => {
      handleApiError(error, showNotification);
      options.onError?.(error);
    },
  });
};

export const useUpdateEvent = (options = {}) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  
  return useMutation({
    mutationFn: ({ id, data }) => eventApi.updateEvent(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['events']);
      queryClient.invalidateQueries(['events', variables.id]);
      showNotification('Event updated successfully!', 'success');
      options.onSuccess?.(data);
    },
    onError: (error) => {
      handleApiError(error, showNotification);
      options.onError?.(error);
    },
  });
};

export const useDeleteEvent = (options = {}) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  
  return useMutation({
    mutationFn: eventApi.deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      showNotification('Event deleted successfully!', 'success');
      options.onSuccess?.();
    },
    onError: (error) => {
      handleApiError(error, showNotification);
      options.onError?.(error);
    },
  });
};

export const useVoteOnActivity = (options = {}) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  
  return useMutation({
    mutationFn: ({ eventId, activityId, vote }) => 
      eventApi.voteOnActivity(eventId, activityId, vote),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['events', variables.eventId]);
      showNotification('Vote recorded successfully!', 'success');
      options.onSuccess?.(data);
    },
    onError: (error) => {
      handleApiError(error, showNotification);
      options.onError?.(error);
    },
  });
};

// Utility hooks for common patterns
export const useDebounceQuery = (queryKey, queryFn, searchTerm, delay = 500) => {
  const [debouncedTerm, setDebouncedTerm] = React.useState(searchTerm);
  
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(searchTerm), delay);
    return () => clearTimeout(timer);
  }, [searchTerm, delay]);
  
  return useQuery({
    queryKey: [...queryKey, debouncedTerm],
    queryFn: () => queryFn(debouncedTerm),
    enabled: !!debouncedTerm && debouncedTerm.length > 2,
  });
};

// Optimistic updates helper
export const useOptimisticUpdate = (queryKey, updateFn) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateFn,
    onMutate: async (newData) => {
      await queryClient.cancelQueries(queryKey);
      const previousData = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, newData);
      return { previousData };
    },
    onError: (err, newData, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });
};