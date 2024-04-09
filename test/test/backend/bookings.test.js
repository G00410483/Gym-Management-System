
const request = require('supertest');
const app = require('../../../backend/server.js');

// Group of tests for the basic functionality of GET /bookingsDisplay.
describe('GET /bookingsDisplay', () => {
    // Define a single test case within this group.
    test('It should respond with an array of bookings', async () => {
      // Use supertest to send a GET request to the specified endpoint.
      const response = await request(app).get('/bookingsDisplay');
      // Check if the status code of the response is 200 (OK).
      expect(response.statusCode).toBe(200);
      // Verify that the body of the response is an array.
      expect(response.body).toBeInstanceOf(Array);
      // Further checks to ensure that each booking object in the array has the expected properties.
      expect(response.body[0]).toHaveProperty('class_name');
      expect(response.body[0]).toHaveProperty('email_address');
    });
  });

describe('GET /bookingsDisplay with search and sort', () => {
    // Test case for checking if the endpoint can both filter and sort the bookings.
  test('It should respond with filtered and sorted bookings', async () => {
    // Define both a searchTerm for filtering and a sortField for sorting.
    const searchTerm = 'exampleClassName'; 
    const sortField = 'date'; 
    // Send a GET request with both the searchTerm and sort parameters.
    const response = await request(app).get(`/bookingsDisplay?searchTerm=${searchTerm}&sort=${sortField}`);
    // Expect a successful response.
    expect(response.statusCode).toBe(200);
    // The response be an array, now filtered and sorted according to the given parameters.
    expect(response.body).toBeInstanceOf(Array);
  });
});
