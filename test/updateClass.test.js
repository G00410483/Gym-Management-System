// Supertest library for testing the API.
const request = require('supertest');
// Require the Express app from the server.js file in the backend directory.
const app = require('../backend/server.js');

// Test suite for the PUT /classes/:id endpoint.
describe('PUT /classes/:id', () => {
    // Variable to hold the class object that will be updated.
    let classToUpdate;
  
    // Before running the test cases, set up the class object to update.
    beforeAll(async () => {
      // Initialize classToUpdate with an id property.
      classToUpdate = { id: '100' }; 
    });
  
    // Test case: should successfully update the class with the provided data.
    it('should update the class with provided data', async () => {
      // Define the data to update the class with.
      const updateData = {
        class_name: 'Updated Class Name',
        instructor_name: 'Updated Instructor',
        time: '10:00',
        day: 'Monday',
        max_capacity: 20
      };
  
      // Make a PUT request to the server with the update data.
      const response = await request(app)
        .put(`/classes/${classToUpdate.id}`)
        .send(updateData);
  
      // The response status code is 200 (OK).
      expect(response.statusCode).toBe(200);
      // The response body contains a message indicating success.
      expect(response.body).toHaveProperty('message', 'Class updated successfully');
    });
  
    // Test case: should return a 400 status code if required fields are missing.
    it('should return 400 if required fields are missing', async () => {
      // Define incomplete data, missing some required fields.
      const incompleteData = {
        class_name: 'Incomplete Class Name',
      };
  
      // Make a PUT request to the server with the incomplete data
      const response = await request(app)
        .put(`/classes/${classToUpdate.id}`)
        .send(incompleteData);
  
      // The response status code is 400 
      expect(response.statusCode).toBe(400);
    });
});
