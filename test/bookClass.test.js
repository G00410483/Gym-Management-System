const request = require('supertest');
const app = require('../backend/server.js');
const mysql = require('mysql2/promise');

// Mock mysql2/promise to prevent actual DB operations
jest.mock('mysql2/promise');

// Setup a mock for the database connection
const mockConnection = {
    execute: jest.fn(), // Mock the 'execute' function to simulate database queries
    end: jest.fn(), // Mock the 'end' function to simulate closing the database connection
  };
  

// Mock createConnection to return the mock connection
mysql.createConnection.mockResolvedValue(mockConnection);

describe('POST /bookClass', () => {
  beforeEach(() => {
    // Before each test, reset the mocks to clear any previous calls or configurations
    mockConnection.execute.mockClear();
    mockConnection.end.mockClear();
  });

  // Test case: Successful class booking with valid data
  it('should book a class successfully with valid data', async () => {
    // Mock the database response to simulate finding a member with the provided email
    mockConnection.execute.mockResolvedValueOnce([[{ email_address: 'test@example.com' }]]);

    // Make a POST request with valid data
    const response = await request(app)
      .post('/bookClass')
      .send({
        class_name: 'Yoga',
        email_address: 'test@example.com',
        date: '2023-04-07',
      });
    
    // The response status code is 200
    expect(response.statusCode).toBe(200);
    // The response body contains a success message
    expect(response.body.message).toEqual('Booking successful');
    // The database 'execute' function was called twice (to check member existance and insert bookings)
    expect(mockConnection.execute).toHaveBeenCalledTimes(2); // Check that the database was queried
  });

  // Test case: Error due to missing required booking information
  it('should return an error if required booking information is missing', async () => {
    const response = await request(app)
      .post('/bookClass')
      .send({
        email_address: 'test@example.com',
        date: '2023-04-07',
        // Missing class_name
      });

      // The response status code is 400
    expect(response.statusCode).toBe(400);
    // The response contains an error message about missing booking information
    expect(response.text).toContain('Missing required booking information');
  });

});
