// Simple test setup without MongoDB Memory Server
beforeAll(async () => {
  // No database connection needed for mocked tests
});

afterAll(async () => {
  // No cleanup needed for mocked tests
});

beforeEach(async () => {
  // Reset all mocks
  jest.clearAllMocks();
});