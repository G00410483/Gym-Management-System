const request = require('supertest');
const app = require('../../../backend/server.js'); // Importing the server file to test

describe('DELETE /deleteNotification/:id', () => {
  // Test case for successful deletion
  it('should delete a notification and return status 200', async () => {
    // Make a DELETE request to delete a notification with a specific id
    const response = await request(app)
      .delete('/deleteNotification/3') 
      .expect(200); // Expecting status code 200 for successful deletion
    
    // Assert the response message
    expect(response.body).toEqual({ message: 'Notification deleted successfully' });
  });
});
