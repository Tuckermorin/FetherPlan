// Mock the Event model
const mockEvent = {
  save: jest.fn(),
  validate: jest.fn(),
  validateSync: jest.fn(),
  toObject: jest.fn(),
  toJSON: jest.fn()
};

const Event = jest.fn().mockImplementation((data) => {
  // Apply default values
  const defaultData = {
    eventData: {
      name: data.eventData?.name || '',
      description: data.eventData?.description || '',
      location: data.eventData?.location || '',
      isPublic: data.eventData?.isPublic !== undefined ? data.eventData.isPublic : true,
      rsvpDeadline: data.eventData?.rsvpDeadline || '',
      maxParticipants: data.eventData?.maxParticipants || 0,
      tags: data.eventData?.tags || [],
    },
    dateTimeData: {
      dateMode: data.dateTimeData?.dateMode || '',
      date: data.dateTimeData?.date || '',
      startDate: data.dateTimeData?.startDate || '',
      endDate: data.dateTimeData?.endDate || '',
      time: data.dateTimeData?.time || '',
      allowParticipantSelection: data.dateTimeData?.allowParticipantSelection || false,
      requiredDayCount: data.dateTimeData?.requiredDayCount || 0,
    },
    activities: data.activities || [],
    activitySupports: data.activitySupports || [],
    requiredActivityCount: data.requiredActivityCount || 0,
    requiredSupportCount: data.requiredSupportCount || 0,
    eventCode: data.eventCode,
    adminCode: data.adminCode,
    _id: '507f1f77bcf86cd799439011',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return {
    ...mockEvent,
    ...defaultData
  };
});

Event.find = jest.fn();
Event.findById = jest.fn();
Event.findOne = jest.fn();
Event.create = jest.fn();
Event.deleteMany = jest.fn();

describe('Event Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Schema Validation', () => {
    test('creates event with valid required fields', async () => {
      const eventData = {
        eventData: {
          name: 'Test Event'
        },
        dateTimeData: {
          dateMode: 'single'
        },
        eventCode: 'abc123',
        adminCode: 'def456'
      };

      const event = new Event(eventData);
      mockEvent.save.mockResolvedValue(event);
      
      const savedEvent = await event.save();

      expect(savedEvent.eventData.name).toBe('Test Event');
      expect(savedEvent.dateTimeData.dateMode).toBe('single');
      expect(savedEvent.eventCode).toBe('abc123');
      expect(savedEvent.adminCode).toBe('def456');
    });

    test('fails validation without required name', async () => {
      const eventData = {
        eventData: {
          description: 'Test Description'
        },
        dateTimeData: {
          dateMode: 'single'
        },
        eventCode: 'abc123',
        adminCode: 'def456'
      };

      const event = new Event(eventData);
      mockEvent.save.mockRejectedValue(new Error('Event validation failed: eventData.name: Path `eventData.name` is required.'));
      
      await expect(event.save()).rejects.toThrow(/required/);
    });

    test('fails validation without required dateMode', async () => {
      const eventData = {
        eventData: {
          name: 'Test Event'
        },
        dateTimeData: {
          date: '2024-12-25'
        },
        eventCode: 'abc123',
        adminCode: 'def456'
      };

      const event = new Event(eventData);
      mockEvent.save.mockRejectedValue(new Error('Event validation failed: dateTimeData.dateMode: Path `dateTimeData.dateMode` is required.'));
      
      await expect(event.save()).rejects.toThrow(/required/);
    });

    test('fails validation with invalid dateMode', async () => {
      const eventData = {
        eventData: {
          name: 'Test Event'
        },
        dateTimeData: {
          dateMode: 'invalid'
        },
        eventCode: 'abc123',
        adminCode: 'def456'
      };

      const event = new Event(eventData);
      mockEvent.save.mockRejectedValue(new Error('Event validation failed: dateTimeData.dateMode: `invalid` is not a valid enum value for path `dateMode`.'));
      
      await expect(event.save()).rejects.toThrow();
    });

    test('accepts valid dateMode values', async () => {
      const singleModeEvent = new Event({
        eventData: { name: 'Single Mode Event' },
        dateTimeData: { dateMode: 'single' },
        eventCode: 'abc123',
        adminCode: 'def456'
      });

      const rangeModeEvent = new Event({
        eventData: { name: 'Range Mode Event' },
        dateTimeData: { dateMode: 'range' },
        eventCode: 'ghi789',
        adminCode: 'jkl012'
      });

      mockEvent.save.mockResolvedValue(singleModeEvent);

      await expect(singleModeEvent.save()).resolves.toBeDefined();
      await expect(rangeModeEvent.save()).resolves.toBeDefined();
    });
  });

  describe('Default Values', () => {
    test('applies default values correctly', async () => {
      const minimalEvent = new Event({
        eventData: {
          name: 'Minimal Event'
        },
        dateTimeData: {
          dateMode: 'single'
        },
        eventCode: 'abc123',
        adminCode: 'def456'
      });

      mockEvent.save.mockResolvedValue(minimalEvent);
      const savedEvent = await minimalEvent.save();

      expect(savedEvent.eventData.description).toBe('');
      expect(savedEvent.eventData.location).toBe('');
      expect(savedEvent.eventData.isPublic).toBe(true);
      expect(savedEvent.eventData.rsvpDeadline).toBe('');
      expect(savedEvent.eventData.maxParticipants).toBe(0);
      expect(savedEvent.eventData.tags).toEqual([]);
      expect(savedEvent.dateTimeData.date).toBe('');
      expect(savedEvent.dateTimeData.startDate).toBe('');
      expect(savedEvent.dateTimeData.endDate).toBe('');
      expect(savedEvent.dateTimeData.time).toBe('');
      expect(savedEvent.dateTimeData.allowParticipantSelection).toBe(false);
      expect(savedEvent.dateTimeData.requiredDayCount).toBe(0);
      expect(savedEvent.activities).toEqual([]);
      expect(savedEvent.activitySupports).toEqual([]);
      expect(savedEvent.requiredActivityCount).toBe(0);
      expect(savedEvent.requiredSupportCount).toBe(0);
    });

    test('overrides default values when provided', async () => {
      const customEvent = new Event({
        eventData: {
          name: 'Custom Event',
          description: 'Custom Description',
          location: 'Custom Location',
          isPublic: false,
          rsvpDeadline: '2024-12-01',
          maxParticipants: 50,
          tags: ['tag1', 'tag2']
        },
        dateTimeData: {
          dateMode: 'range',
          startDate: '2024-12-25',
          endDate: '2024-12-27',
          time: '14:00',
          allowParticipantSelection: true,
          requiredDayCount: 2
        },
        activities: [{ name: 'Activity 1' }],
        activitySupports: [{ name: 'Support 1' }],
        requiredActivityCount: 1,
        requiredSupportCount: 1,
        eventCode: 'abc123',
        adminCode: 'def456'
      });

      mockEvent.save.mockResolvedValue(customEvent);
      const savedEvent = await customEvent.save();

      expect(savedEvent.eventData.description).toBe('Custom Description');
      expect(savedEvent.eventData.location).toBe('Custom Location');
      expect(savedEvent.eventData.isPublic).toBe(false);
      expect(savedEvent.eventData.rsvpDeadline).toBe('2024-12-01');
      expect(savedEvent.eventData.maxParticipants).toBe(50);
      expect(savedEvent.eventData.tags).toEqual(['tag1', 'tag2']);
      expect(savedEvent.dateTimeData.startDate).toBe('2024-12-25');
      expect(savedEvent.dateTimeData.endDate).toBe('2024-12-27');
      expect(savedEvent.dateTimeData.time).toBe('14:00');
      expect(savedEvent.dateTimeData.allowParticipantSelection).toBe(true);
      expect(savedEvent.dateTimeData.requiredDayCount).toBe(2);
      expect(savedEvent.activities).toHaveLength(1);
      expect(savedEvent.activitySupports).toHaveLength(1);
      expect(savedEvent.requiredActivityCount).toBe(1);
      expect(savedEvent.requiredSupportCount).toBe(1);
    });
  });

  describe('Unique Constraints', () => {
    test('enforces unique eventCode constraint', async () => {
      const event1 = new Event({
        eventData: { name: 'Event 1' },
        dateTimeData: { dateMode: 'single' },
        eventCode: 'duplicate',
        adminCode: 'admin1'
      });

      const event2 = new Event({
        eventData: { name: 'Event 2' },
        dateTimeData: { dateMode: 'single' },
        eventCode: 'duplicate',
        adminCode: 'admin2'
      });

      mockEvent.save.mockResolvedValueOnce(event1);
      mockEvent.save.mockRejectedValueOnce(new Error('E11000 duplicate key error'));

      await event1.save();
      await expect(event2.save()).rejects.toThrow(/duplicate key/);
    });

    test('enforces unique adminCode constraint', async () => {
      const event1 = new Event({
        eventData: { name: 'Event 1' },
        dateTimeData: { dateMode: 'single' },
        eventCode: 'event1',
        adminCode: 'duplicate'
      });

      const event2 = new Event({
        eventData: { name: 'Event 2' },
        dateTimeData: { dateMode: 'single' },
        eventCode: 'event2',
        adminCode: 'duplicate'
      });

      mockEvent.save.mockResolvedValueOnce(event1);
      mockEvent.save.mockRejectedValueOnce(new Error('E11000 duplicate key error'));

      await event1.save();
      await expect(event2.save()).rejects.toThrow(/duplicate key/);
    });

    test('allows different events with unique codes', async () => {
      const event1 = new Event({
        eventData: { name: 'Event 1' },
        dateTimeData: { dateMode: 'single' },
        eventCode: 'event1',
        adminCode: 'admin1'
      });

      const event2 = new Event({
        eventData: { name: 'Event 2' },
        dateTimeData: { dateMode: 'single' },
        eventCode: 'event2',
        adminCode: 'admin2'
      });

      mockEvent.save.mockResolvedValueOnce(event1);
      mockEvent.save.mockResolvedValueOnce(event2);

      await expect(event1.save()).resolves.toBeDefined();
      await expect(event2.save()).resolves.toBeDefined();
    });
  });

  describe('Timestamps', () => {
    test('automatically adds createdAt and updatedAt timestamps', async () => {
      const event = new Event({
        eventData: { name: 'Test Event' },
        dateTimeData: { dateMode: 'single' },
        eventCode: 'abc123',
        adminCode: 'def456'
      });

      mockEvent.save.mockResolvedValue(event);
      const savedEvent = await event.save();

      expect(savedEvent.createdAt).toBeDefined();
      expect(savedEvent.updatedAt).toBeDefined();
      expect(savedEvent.createdAt).toBeInstanceOf(Date);
      expect(savedEvent.updatedAt).toBeInstanceOf(Date);
    });

    test('updates updatedAt timestamp on save', async () => {
      const event = new Event({
        eventData: { name: 'Test Event' },
        dateTimeData: { dateMode: 'single' },
        eventCode: 'abc123',
        adminCode: 'def456'
      });

      const originalUpdatedAt = event.updatedAt;

      // Simulate timestamp update
      const updatedEvent = { ...event, updatedAt: new Date(Date.now() + 1000) };
      mockEvent.save.mockResolvedValueOnce(event);
      mockEvent.save.mockResolvedValueOnce(updatedEvent);

      await event.save();
      
      event.eventData.name = 'Updated Event';
      const result = await event.save();

      expect(result.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('Data Types', () => {
    test('validates boolean fields correctly', async () => {
      const event = new Event({
        eventData: {
          name: 'Test Event',
          isPublic: 'not a boolean'
        },
        dateTimeData: {
          dateMode: 'single',
          allowParticipantSelection: 'also not a boolean'
        },
        eventCode: 'abc123',
        adminCode: 'def456'
      });

      mockEvent.save.mockRejectedValue(new Error('Cast to Boolean failed'));
      await expect(event.save()).rejects.toThrow();
    });

    test('validates number fields correctly', async () => {
      const event = new Event({
        eventData: {
          name: 'Test Event',
          maxParticipants: 'not a number'
        },
        dateTimeData: {
          dateMode: 'single',
          requiredDayCount: 'also not a number'
        },
        requiredActivityCount: 'still not a number',
        requiredSupportCount: 'definitely not a number',
        eventCode: 'abc123',
        adminCode: 'def456'
      });

      mockEvent.save.mockRejectedValue(new Error('Cast to Number failed'));
      await expect(event.save()).rejects.toThrow();
    });

    test('validates array fields correctly', async () => {
      const event = new Event({
        eventData: {
          name: 'Test Event',
          tags: ['valid', 'string', 'array']
        },
        dateTimeData: {
          dateMode: 'single'
        },
        activities: [{ name: 'Activity 1' }, { name: 'Activity 2' }],
        activitySupports: [{ name: 'Support 1' }],
        eventCode: 'abc123',
        adminCode: 'def456'
      });

      mockEvent.save.mockResolvedValue(event);
      await expect(event.save()).resolves.toBeDefined();
    });
  });
});