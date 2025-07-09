const request = require('supertest');
const express = require('express');

// Mock the Event model
jest.mock('../models/Event', () => {
  const mockSave = jest.fn();
  const mockFind = jest.fn();
  const mockFindById = jest.fn();
  const mockFindOne = jest.fn();
  const mockId = jest.fn();

  const MockEvent = jest.fn().mockImplementation((data) => ({
    ...data,
    _id: '507f1f77bcf86cd799439011',
    activities: data.activities || [],
    dateProposals: data.dateProposals || [],
    timeProposals: data.timeProposals || [],
    save: mockSave,
    id: mockId
  }));

  MockEvent.find = mockFind;
  MockEvent.findById = mockFindById;
  MockEvent.findOne = mockFindOne;

  return MockEvent;
});

const eventRoutes = require('./eventRoutes');
const Event = require('../models/Event');

const app = express();
app.use(express.json());
app.use('/events', eventRoutes);

// Mock console.log to avoid noise in tests
const originalConsoleLog = console.log;
beforeEach(() => {
  console.log = jest.fn();
  jest.clearAllMocks();
});

afterEach(() => {
  console.log = originalConsoleLog;
});

describe('Event Routes', () => {
  describe('POST /events', () => {
    test('creates a new event with generated codes', async () => {
      const eventData = {
        eventData: {
          name: 'Test Event',
          description: 'Test Description'
        }
      };

      const savedEvent = {
        ...eventData,
        _id: '507f1f77bcf86cd799439011',
        eventCode: 'abc123',
        adminCode: 'def456'
      };

      // Mock the prototype save method
      Event.prototype.save = jest.fn().mockResolvedValue(savedEvent);

      const response = await request(app)
        .post('/events')
        .send(eventData)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('eventCode');
      expect(response.body).toHaveProperty('adminCode');
      expect(response.body.eventCode).toHaveLength(6);
      expect(response.body.adminCode).toHaveLength(6);
    });

    test('returns 400 for invalid event data', async () => {
      const invalidEventData = {
        eventData: {
          name: ''
        }
      };

      Event.prototype.save = jest.fn().mockRejectedValue(new Error('Validation failed'));

      const response = await request(app)
        .post('/events')
        .send(invalidEventData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /events', () => {
    test('returns all events', async () => {
      const mockEvents = [
        {
          _id: '507f1f77bcf86cd799439011',
          eventData: { name: 'Event 1' },
          eventCode: 'abc123',
          adminCode: 'def456'
        },
        {
          _id: '507f1f77bcf86cd799439012',
          eventData: { name: 'Event 2' },
          eventCode: 'ghi789',
          adminCode: 'jkl012'
        }
      ];

      Event.find.mockResolvedValue(mockEvents);

      const response = await request(app)
        .get('/events')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].eventData.name).toBe('Event 1');
      expect(response.body[1].eventData.name).toBe('Event 2');
    });

    test('returns empty array when no events exist', async () => {
      Event.find.mockResolvedValue([]);

      const response = await request(app)
        .get('/events')
        .expect(200);

      expect(response.body).toHaveLength(0);
    });
  });

  describe('GET /events/:id', () => {
    test('returns specific event by ID', async () => {
      const mockEvent = {
        _id: '507f1f77bcf86cd799439011',
        eventData: { name: 'Test Event' },
        eventCode: 'abc123',
        adminCode: 'def456'
      };

      Event.findById.mockResolvedValue(mockEvent);

      const response = await request(app)
        .get('/events/507f1f77bcf86cd799439011')
        .expect(200);

      expect(response.body.eventData.name).toBe('Test Event');
      expect(response.body._id).toBe('507f1f77bcf86cd799439011');
    });

    test('returns 404 for non-existent event', async () => {
      Event.findById.mockResolvedValue(null);

      const response = await request(app)
        .get('/events/507f1f77bcf86cd799439011')
        .expect(404);

      expect(response.body.message).toBe('Event not found');
    });
  });

  describe('GET /events/code/:code', () => {
    test('returns event by participant code', async () => {
      const mockEvent = {
        _id: '507f1f77bcf86cd799439011',
        eventData: { name: 'Test Event' },
        eventCode: 'abc123',
        adminCode: 'def456'
      };

      Event.findOne.mockResolvedValue(mockEvent);

      const response = await request(app)
        .get('/events/code/abc123')
        .expect(200);

      expect(response.body.eventData.name).toBe('Test Event');
      expect(response.body.eventCode).toBe('abc123');
    });

    test('returns 404 for non-existent code', async () => {
      Event.findOne.mockResolvedValue(null);

      const response = await request(app)
        .get('/events/code/nonexistent')
        .expect(404);

      expect(response.body.message).toBe('Event not found');
    });
  });

  describe('PUT /events/:id/suggestions', () => {
    test('adds date proposals to event', async () => {
      const mockEvent = {
        _id: '507f1f77bcf86cd799439011',
        eventData: { name: 'Test Event' },
        eventCode: 'abc123',
        adminCode: 'def456',
        dateProposals: [],
        timeProposals: [],
        save: jest.fn()
      };

      const updatedEvent = {
        ...mockEvent,
        dateProposals: [
          { startDate: '2024-12-25', endDate: '2024-12-25' },
          { startDate: '2024-12-26', endDate: '2024-12-26' }
        ]
      };

      Event.findById.mockResolvedValue(mockEvent);
      mockEvent.save.mockResolvedValue(updatedEvent);

      const suggestions = {
        proposals: [
          { startDate: '2024-12-25', endDate: '2024-12-25' },
          { startDate: '2024-12-26', endDate: '2024-12-26' }
        ],
        type: 'date'
      };

      const response = await request(app)
        .put('/events/507f1f77bcf86cd799439011/suggestions')
        .send(suggestions)
        .expect(200);

      expect(response.body.dateProposals).toHaveLength(2);
      expect(response.body.dateProposals[0].startDate).toBe('2024-12-25');
    });

    test('returns 404 for non-existent event', async () => {
      Event.findById.mockResolvedValue(null);

      const suggestions = {
        proposals: [{ startDate: '2024-12-25', endDate: '2024-12-25' }],
        type: 'date'
      };

      const response = await request(app)
        .put('/events/507f1f77bcf86cd799439011/suggestions')
        .send(suggestions)
        .expect(404);

      expect(response.body.message).toBe('Event not found');
    });
  });

  describe('PUT /events/:id/activities/:actId/vote', () => {
    test('adds vote to activity', async () => {
      const mockActivity = {
        _id: '507f1f77bcf86cd799439013',
        name: 'Test Activity',
        description: 'Test Description',
        votes: []
      };

      const mockEvent = {
        _id: '507f1f77bcf86cd799439011',
        eventData: { name: 'Test Event' },
        eventCode: 'abc123',
        adminCode: 'def456',
        activities: {
          id: jest.fn().mockReturnValue(mockActivity)
        },
        save: jest.fn()
      };

      const updatedEvent = {
        ...mockEvent,
        activities: [{
          ...mockActivity,
          votes: [{ userId: 'user123', vote: true }]
        }]
      };

      Event.findById.mockResolvedValue(mockEvent);
      mockEvent.save.mockResolvedValue(updatedEvent);

      const voteData = {
        userId: 'user123',
        vote: true
      };

      const response = await request(app)
        .put('/events/507f1f77bcf86cd799439011/activities/507f1f77bcf86cd799439013/vote')
        .send(voteData)
        .expect(200);

      expect(response.body.activities[0].votes).toHaveLength(1);
      expect(response.body.activities[0].votes[0].userId).toBe('user123');
      expect(response.body.activities[0].votes[0].vote).toBe(true);
    });

    test('returns 404 for non-existent event', async () => {
      Event.findById.mockResolvedValue(null);

      const voteData = {
        userId: 'user123',
        vote: true
      };

      const response = await request(app)
        .put('/events/507f1f77bcf86cd799439011/activities/507f1f77bcf86cd799439013/vote')
        .send(voteData)
        .expect(404);

      expect(response.body.message).toBe('Event not found');
    });

    test('returns 404 for non-existent activity', async () => {
      const mockEvent = {
        _id: '507f1f77bcf86cd799439011',
        eventData: { name: 'Test Event' },
        eventCode: 'abc123',
        adminCode: 'def456',
        activities: {
          id: jest.fn().mockReturnValue(null)
        },
        save: jest.fn()
      };

      Event.findById.mockResolvedValue(mockEvent);

      const voteData = {
        userId: 'user123',
        vote: true
      };

      const response = await request(app)
        .put('/events/507f1f77bcf86cd799439011/activities/507f1f77bcf86cd799439013/vote')
        .send(voteData)
        .expect(404);

      expect(response.body.message).toBe('Activity not found');
    });
  });
});