import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import EventCard from './EventCard';
import { useDeleteEvent } from '../hooks/useApi';
import { useNotification } from '../components/ErrorHandling';

// Mock the hooks
jest.mock('../hooks/useApi');
jest.mock('../components/ErrorHandling');

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

// Mock window.confirm
const mockConfirm = jest.fn();
global.confirm = mockConfirm;

describe('EventCard', () => {
  const mockShowNotification = jest.fn();
  const mockDeleteMutation = {
    mutate: jest.fn(),
    isLoading: false,
  };
  const mockOnView = jest.fn();
  const mockOnEdit = jest.fn();

  const theme = createTheme();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const renderWithProviders = (component) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          {component}
        </ThemeProvider>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useNotification.mockReturnValue({ showNotification: mockShowNotification });
    useDeleteEvent.mockReturnValue(mockDeleteMutation);
  });

  const mockEvent = {
    _id: '1',
    eventData: {
      name: 'Test Event',
      description: 'Test description',
      tags: ['tag1', 'tag2'],
    },
    dateTimeData: {
      dateMode: 'single',
      date: '2024-12-25',
      time: '14:00',
    },
    activities: [
      { id: 1, name: 'Activity 1', costMode: 'fixed', cost: '10' },
      { id: 2, name: 'Activity 2', costMode: 'range', minCost: '20' },
    ],
    activitySupports: [
      { id: 1, name: 'Support 1', costMode: 'fixed', cost: '5' },
    ],
  };

  describe('Event Information Display', () => {
    test('renders event name and description', () => {
      renderWithProviders(<EventCard event={mockEvent} onView={mockOnView} onEdit={mockOnEdit} />);
      
      expect(screen.getByText('Test Event')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    test('renders default values when event data is missing', () => {
      const eventWithoutData = { _id: '1' };
      renderWithProviders(<EventCard event={eventWithoutData} onView={mockOnView} onEdit={mockOnEdit} />);
      
      expect(screen.getByText('Untitled Event')).toBeInTheDocument();
      expect(screen.getByText('No description provided')).toBeInTheDocument();
    });

    test('displays activity count', () => {
      renderWithProviders(<EventCard event={mockEvent} onView={mockOnView} onEdit={mockOnEdit} />);
      
      expect(screen.getByText('2 activities')).toBeInTheDocument();
    });

    test('displays estimated cost when cost > 0', () => {
      renderWithProviders(<EventCard event={mockEvent} onView={mockOnView} onEdit={mockOnEdit} />);
      
      expect(screen.getByText('Est. $35.00')).toBeInTheDocument();
    });

    test('does not display cost when cost is 0', () => {
      const eventWithoutCost = {
        ...mockEvent,
        activities: [],
        activitySupports: [],
      };
      renderWithProviders(<EventCard event={eventWithoutCost} onView={mockOnView} onEdit={mockOnEdit} />);
      
      expect(screen.queryByText(/Est\./)).not.toBeInTheDocument();
    });

    test('displays tags with limit', () => {
      const eventWithManyTags = {
        ...mockEvent,
        eventData: {
          ...mockEvent.eventData,
          tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
        },
      };
      renderWithProviders(<EventCard event={eventWithManyTags} onView={mockOnView} onEdit={mockOnEdit} />);
      
      expect(screen.getByText('tag1')).toBeInTheDocument();
      expect(screen.getByText('tag2')).toBeInTheDocument();
      expect(screen.getByText('tag3')).toBeInTheDocument();
      expect(screen.getByText('+2')).toBeInTheDocument();
    });
  });

  describe('Date Display', () => {
    test('displays single date with time', () => {
      renderWithProviders(<EventCard event={mockEvent} onView={mockOnView} onEdit={mockOnEdit} />);
      
      expect(screen.getByText('12/25/2024 at 14:00')).toBeInTheDocument();
    });

    test('displays single date without time', () => {
      const eventWithoutTime = {
        ...mockEvent,
        dateTimeData: {
          dateMode: 'single',
          date: '2024-12-25',
        },
      };
      renderWithProviders(<EventCard event={eventWithoutTime} onView={mockOnView} onEdit={mockOnEdit} />);
      
      expect(screen.getByText('12/25/2024')).toBeInTheDocument();
    });

    test('displays date range', () => {
      const eventWithRange = {
        ...mockEvent,
        dateTimeData: {
          dateMode: 'range',
          startDate: '2024-12-25',
          endDate: '2024-12-27',
        },
      };
      renderWithProviders(<EventCard event={eventWithRange} onView={mockOnView} onEdit={mockOnEdit} />);
      
      expect(screen.getByText('12/25/2024 - 12/27/2024')).toBeInTheDocument();
    });

    test('displays "Date TBD" when no date is set', () => {
      const eventWithoutDate = {
        ...mockEvent,
        dateTimeData: {},
      };
      renderWithProviders(<EventCard event={eventWithoutDate} onView={mockOnView} onEdit={mockOnEdit} />);
      
      expect(screen.getByText('Date TBD')).toBeInTheDocument();
    });
  });

  describe('Event Status', () => {
    test('shows "Draft" status when no date is set', () => {
      const draftEvent = {
        ...mockEvent,
        dateTimeData: {},
      };
      renderWithProviders(<EventCard event={draftEvent} onView={mockOnView} onEdit={mockOnEdit} />);
      
      expect(screen.getByText('Draft')).toBeInTheDocument();
    });

    test('shows "Upcoming" status for future events', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      
      const futureEvent = {
        ...mockEvent,
        dateTimeData: {
          dateMode: 'single',
          date: futureDate.toISOString(),
        },
      };
      renderWithProviders(<EventCard event={futureEvent} onView={mockOnView} onEdit={mockOnEdit} />);
      
      expect(screen.getByText('Upcoming')).toBeInTheDocument();
    });

    test('shows "Past" status for past events', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);
      
      const pastEvent = {
        ...mockEvent,
        dateTimeData: {
          dateMode: 'single',
          date: pastDate.toISOString(),
        },
      };
      renderWithProviders(<EventCard event={pastEvent} onView={mockOnView} onEdit={mockOnEdit} />);
      
      expect(screen.getByText('Past')).toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    test('calls onView when view button is clicked', () => {
      renderWithProviders(<EventCard event={mockEvent} onView={mockOnView} onEdit={mockOnEdit} />);
      
      const viewButton = screen.getByLabelText(/view/i);
      fireEvent.click(viewButton);
      
      expect(mockOnView).toHaveBeenCalledWith(mockEvent);
    });

    test('calls onEdit when edit button is clicked', () => {
      renderWithProviders(<EventCard event={mockEvent} onView={mockOnView} onEdit={mockOnEdit} />);
      
      const editButton = screen.getByLabelText(/edit/i);
      fireEvent.click(editButton);
      
      expect(mockOnEdit).toHaveBeenCalledWith(mockEvent);
    });

    test('shows confirmation dialog when delete button is clicked', () => {
      mockConfirm.mockReturnValue(true);
      renderWithProviders(<EventCard event={mockEvent} onView={mockOnView} onEdit={mockOnEdit} />);
      
      const deleteButton = screen.getByLabelText(/delete/i);
      fireEvent.click(deleteButton);
      
      expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this event?');
      expect(mockDeleteMutation.mutate).toHaveBeenCalledWith('1');
    });

    test('does not delete when confirmation is cancelled', () => {
      mockConfirm.mockReturnValue(false);
      renderWithProviders(<EventCard event={mockEvent} onView={mockOnView} onEdit={mockOnEdit} />);
      
      const deleteButton = screen.getByLabelText(/delete/i);
      fireEvent.click(deleteButton);
      
      expect(mockConfirm).toHaveBeenCalled();
      expect(mockDeleteMutation.mutate).not.toHaveBeenCalled();
    });

    test('disables delete button when deletion is in progress', () => {
      const loadingMutation = {
        ...mockDeleteMutation,
        isLoading: true,
      };
      useDeleteEvent.mockReturnValue(loadingMutation);
      
      renderWithProviders(<EventCard event={mockEvent} onView={mockOnView} onEdit={mockOnEdit} />);
      
      const deleteButton = screen.getByLabelText(/delete/i);
      expect(deleteButton).toBeDisabled();
    });
  });

  describe('Edge Cases', () => {
    test('handles missing activities array', () => {
      const eventWithoutActivities = {
        ...mockEvent,
        activities: undefined,
      };
      renderWithProviders(<EventCard event={eventWithoutActivities} onView={mockOnView} onEdit={mockOnEdit} />);
      
      expect(screen.getByText('0 activities')).toBeInTheDocument();
    });

    test('handles missing tags array', () => {
      const eventWithoutTags = {
        ...mockEvent,
        eventData: {
          ...mockEvent.eventData,
          tags: undefined,
        },
      };
      renderWithProviders(<EventCard event={eventWithoutTags} onView={mockOnView} onEdit={mockOnEdit} />);
      
      expect(screen.queryByText('tag1')).not.toBeInTheDocument();
    });

    test('handles incomplete date range', () => {
      const eventWithIncompleteRange = {
        ...mockEvent,
        dateTimeData: {
          dateMode: 'range',
          startDate: '2024-12-25',
          endDate: null,
        },
      };
      renderWithProviders(<EventCard event={eventWithIncompleteRange} onView={mockOnView} onEdit={mockOnEdit} />);
      
      expect(screen.getByText('Date range set')).toBeInTheDocument();
    });
  });
});