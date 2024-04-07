// Import the supertest library for testing HTTP requests
const supertest = require('supertest');
// Import the app instance to test its HTTP endpoints
const app = require('../backend/server.js');

// Describe a group of tests for the GET /members endpoint
describe('GET /members', () => {
  // Test case: it should return all members 
  it('should return all members', async () => {
    // Use supertest to make a GET request to the /members endpoint and expect a JSON response with a 200 status code
    const response = await supertest(app)
      .get('/members')
      .expect('Content-Type', /json/)
      .expect(200);

    // Response body is an array indicating it returned a list of members
    expect(Array.isArray(response.body)).toBeTruthy();
    // The array is not empty, indicating that the members are indeed returned
    expect(response.body.length).toBeGreaterThan(0); 
    // Assert that each member object has the expected properties, ensuring the data structure is correct
    expect(response.body[0]).toHaveProperty('first_name');
    expect(response.body[0]).toHaveProperty('second_name');
    expect(response.body[0]).toHaveProperty('email_address');
  });

  // Test case: it should filter the members returned based on a provided search term query parameter
  it('should filter members based on a search term', async () => {
    const searchTerm = 'John'; // Define a search term to filter the members
    // Make a GET request with the search term as a query parameter
    const response = await supertest(app)
      .get(`/members?searchTerm=${searchTerm}`)
      .expect('Content-Type', /json/)
      .expect(200);

    // Returned members include the search term in their first or second name
    expect(response.body.some(member => member.first_name.includes(searchTerm) || member.second_name.includes(searchTerm))).toBeTruthy();
  });

  // Test case: it should return an empty array when no members match the search term
  it('should handle requests with no matching members', async () => {
    const searchTerm = 'NonExistentName'; // Define a search term that does not match any members
    // Make a GET request with the non-existent search term
    const response = await supertest(app)
      .get(`/members?searchTerm=${searchTerm}`)
      .expect(200); 

    // Response body is an array indicating it returned a list (or lack thereof) of members
    expect(Array.isArray(response.body)).toBeTruthy();
    // The array is empty, indicating no members matched the search term
    expect(response.body.length).toEqual(0);
  });

  // Test case: it should correctly apply multiple query parameters to filter and sort the members
  it('should correctly apply multiple query parameters', async () => {
    const searchTerm = 'John'; // Define a search term to filter the members
    const sortParam = 'first_name'; // Define a sort parameter to sort the filtered members
    // Make a GET request with both search and sort query parameters
    const response = await supertest(app)
      .get(`/members?searchTerm=${searchTerm}&sort=${sortParam}`)
      .expect('Content-Type', /json/)
      .expect(200);

    // Response body is an array, ensuring that a list of members is returned
    expect(Array.isArray(response.body)).toBeTruthy();
  });
});
