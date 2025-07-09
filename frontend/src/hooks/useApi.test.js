import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { eventApi, useEvents, useEvent, useCreateEvent, useUpdateEvent, useDeleteEvent } from './useApi';
import * as ErrorHandling from '../components/ErrorHandling';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  }))
}));

const axios = require('axios');

// Mock error handling
jest.mock('../components/ErrorHandling', () => ({
  handleApiError: jest.fn(),
  useNotification: () => ({
    showNotification: jest.fn()
  })
}));

// Mock console.log and console.error
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeEach(() => {
  console.log = jest.fn();
  console.error = jest.fn();
  jest.clearAllMocks();
});

afterEach(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});

// Helper function to create a wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
  
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('eventApi', () => {
  let mockApiClient;

  beforeEach(() => {
    mockApiClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    };
    
    axios.create.mockReturnValue(mockApiClient);
  });

  describe('getEvents', () => {
    test('makes GET request to /events', async () => {
      const mockData = [{ id: 1, name: 'Test Event' }];
      mockApiClient.get.mockResolvedValue({ data: mockData });

      const result = await eventApi.getEvents();

      expect(mockApiClient.get).toHaveBeenCalledWith('/events');
      expect(result).toEqual(mockData);
    });
  });

  describe('getEvent', () => {
    test('makes GET request to /events/:id', async () => {
      const mockData = { id: 1, name: 'Test Event' };
      mockApiClient.get.mockResolvedValue({ data: mockData });

      const result = await eventApi.getEvent(1);

      expect(mockApiClient.get).toHaveBeenCalledWith('/events/1');
      expect(result).toEqual(mockData);
    });
  });

  describe('createEvent', () => {
    test('makes POST request to /events', async () => {
      const eventData = { name: 'New Event' };
      const mockResponse = { id: 1, ...eventData };
      mockApiClient.post.mockResolvedValue({ data: mockResponse });

      const result = await eventApi.createEvent(eventData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/events', eventData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateEvent', () => {
    test('makes PUT request to /events/:id', async () => {
      const eventData = { name: 'Updated Event' };
      const mockResponse = { id: 1, ...eventData };
      mockApiClient.put.mockResolvedValue({ data: mockResponse });

      const result = await eventApi.updateEvent(1, eventData);

      expect(mockApiClient.put).toHaveBeenCalledWith('/events/1', eventData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteEvent', () => {
    test('makes DELETE request to /events/:id', async () => {
      const mockResponse = { success: true };
      mockApiClient.delete.mockResolvedValue({ data: mockResponse });

      const result = await eventApi.deleteEvent(1);

      expect(mockApiClient.delete).toHaveBeenCalledWith('/events/1');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getEventByCode', () => {
    test('makes GET request to /events/code/:code', async () => {
      const mockData = { id: 1, name: 'Test Event' };
      mockApiClient.get.mockResolvedValue({ data: mockData });

      const result = await eventApi.getEventByCode('ABC123');

      expect(mockApiClient.get).toHaveBeenCalledWith('/events/code/ABC123');
      expect(result).toEqual(mockData);
    });
  });

  describe('voteOnActivity', () => {
    test('makes PUT request to vote endpoint', async () => {
      const mockResponse = { success: true };
      mockApiClient.put.mockResolvedValue({ data: mockResponse });

      const result = await eventApi.voteOnActivity(1, 2, { vote: 'yes' });

      expect(mockApiClient.put).toHaveBeenCalledWith('/events/1/activities/2/vote', { vote: 'yes' });
      expect(result).toEqual(mockResponse);
    });
  });
});

describe('useEvents hook', () => {
  test('successfully fetches events', async () => {
    const mockData = [{ id: 1, name: 'Test Event' }];
    eventApi.getEvents = jest.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => useEvents(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(eventApi.getEvents).toHaveBeenCalled();
  });

  test('handles error when fetching events', async () => {
    const mockError = new Error('Network error');
    eventApi.getEvents = jest.fn().mockRejectedValue(mockError);

    const { result } = renderHook(() => useEvents(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });
});

describe('useEvent hook', () => {
  test('successfully fetches single event', async () => {
    const mockData = { id: 1, name: 'Test Event' };
    eventApi.getEvent = jest.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => useEvent(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(eventApi.getEvent).toHaveBeenCalledWith(1);
  });

  test('does not fetch when id is not provided', () => {
    eventApi.getEvent = jest.fn();

    const { result } = renderHook(() => useEvent(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isIdle).toBe(true);
    expect(eventApi.getEvent).not.toHaveBeenCalled();
  });
});

describe('useCreateEvent hook', () => {
  test('successfully creates event', async () => {
    const mockData = { id: 1, name: 'New Event' };
    eventApi.createEvent = jest.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => useCreateEvent(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      result.current.mutate({ name: 'New Event' });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(eventApi.createEvent).toHaveBeenCalledWith({ name: 'New Event' });
  });

  test('handles error when creating event', async () => {
    const mockError = new Error('Create failed');
    eventApi.createEvent = jest.fn().mockRejectedValue(mockError);

    const { result } = renderHook(() => useCreateEvent(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      result.current.mutate({ name: 'New Event' });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });
});

describe('useUpdateEvent hook', () => {
  test('successfully updates event', async () => {
    const mockData = { id: 1, name: 'Updated Event' };
    eventApi.updateEvent = jest.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => useUpdateEvent(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      result.current.mutate({ id: 1, data: { name: 'Updated Event' } });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(eventApi.updateEvent).toHaveBeenCalledWith(1, { name: 'Updated Event' });
  });
});

describe('useDeleteEvent hook', () => {
  test('successfully deletes event', async () => {
    const mockResponse = { success: true };
    eventApi.deleteEvent = jest.fn().mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useDeleteEvent(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      result.current.mutate(1);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(eventApi.deleteEvent).toHaveBeenCalledWith(1);
  });
});