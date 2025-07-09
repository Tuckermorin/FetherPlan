import { sumItemCost, calculateEventCost } from './costUtils';

describe('sumItemCost', () => {
  const mockItems = [
    { id: 1, costMode: 'fixed', cost: '10.50' },
    { id: 2, costMode: 'fixed', cost: '25.00' },
    { id: 3, costMode: 'range', minCost: '15.75' },
    { id: 4, costMode: 'range', minCost: '8.25' },
    { id: 5, costMode: 'fixed', cost: null },
    { id: 6, costMode: 'range', minCost: null },
    { id: 7, costMode: 'other' }
  ];

  test('calculates total cost for all items when no selection', () => {
    const result = sumItemCost(mockItems);
    expect(result).toBe(59.5);
  });

  test('calculates total cost for selected items only', () => {
    const selectedIds = [1, 3, 5];
    const result = sumItemCost(mockItems, selectedIds);
    expect(result).toBe(26.25);
  });

  test('handles empty items array', () => {
    const result = sumItemCost([]);
    expect(result).toBe(0);
  });

  test('handles undefined items', () => {
    const result = sumItemCost();
    expect(result).toBe(0);
  });

  test('handles empty selection', () => {
    const result = sumItemCost(mockItems, []);
    expect(result).toBe(0);
  });

  test('handles items with no cost or minCost', () => {
    const itemsWithoutCost = [
      { id: 1, costMode: 'fixed', cost: null },
      { id: 2, costMode: 'range', minCost: null }
    ];
    const result = sumItemCost(itemsWithoutCost);
    expect(result).toBe(0);
  });

  test('handles items with invalid cost mode', () => {
    const itemsWithInvalidMode = [
      { id: 1, costMode: 'invalid', cost: '10.00' },
      { id: 2, costMode: 'fixed', cost: '5.00' }
    ];
    const result = sumItemCost(itemsWithInvalidMode);
    expect(result).toBe(5);
  });

  test('parses string costs correctly', () => {
    const items = [
      { id: 1, costMode: 'fixed', cost: '10.99' },
      { id: 2, costMode: 'range', minCost: '25.50' }
    ];
    const result = sumItemCost(items);
    expect(result).toBe(36.49);
  });
});

describe('calculateEventCost', () => {
  const mockActivities = [
    { id: 1, costMode: 'fixed', cost: '20.00' },
    { id: 2, costMode: 'range', minCost: '15.00' }
  ];

  const mockSupports = [
    { id: 1, costMode: 'fixed', cost: '5.00' },
    { id: 2, costMode: 'range', minCost: '10.00' }
  ];

  test('calculates total event cost with activities and supports', () => {
    const result = calculateEventCost({
      activities: mockActivities,
      supports: mockSupports
    });
    expect(result).toBe(50);
  });

  test('calculates cost with selected activities only', () => {
    const result = calculateEventCost({
      activities: mockActivities,
      supports: mockSupports,
      selectedActivities: [1]
    });
    expect(result).toBe(35);
  });

  test('calculates cost with selected supports only', () => {
    const result = calculateEventCost({
      activities: mockActivities,
      supports: mockSupports,
      selectedSupports: [1]
    });
    expect(result).toBe(40);
  });

  test('calculates cost with both selected activities and supports', () => {
    const result = calculateEventCost({
      activities: mockActivities,
      supports: mockSupports,
      selectedActivities: [1],
      selectedSupports: [1]
    });
    expect(result).toBe(25);
  });

  test('handles empty activities and supports', () => {
    const result = calculateEventCost({
      activities: [],
      supports: []
    });
    expect(result).toBe(0);
  });

  test('handles undefined parameters', () => {
    const result = calculateEventCost();
    expect(result).toBe(0);
  });

  test('handles activities only', () => {
    const result = calculateEventCost({
      activities: mockActivities
    });
    expect(result).toBe(35);
  });

  test('handles supports only', () => {
    const result = calculateEventCost({
      supports: mockSupports
    });
    expect(result).toBe(15);
  });
});