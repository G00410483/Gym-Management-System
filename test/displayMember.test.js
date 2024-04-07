const request = require('supertest'); // Importing supertest for making HTTP requests
const app = require('../backend/server.js'); // Importing the server file to test

describe('GET /displayMember', () => {
   let validToken; // Declaration of the variable to store the valid token

   // Hook to execute before all tests
   beforeAll(async () => { 
    // Making a POST request to login and extracting the token from the response
    const loginResponse = await request(app)
      .post('/login')
      .send({
        email: 'dane@gm.com',
        password: '12'
      });
    validToken = loginResponse.body.token; // Extract the token from the login response
  });

  it('should return 401 if no token is provided', async () => {
    // Making a GET request to /displayMember without providing a token
    const response = await request(app)
      .get('/displayMember')
      .send();
    // Asserting response status code and message
    expect(response.statusCode).toBe(401);
    expect(response.text).toContain('No token provided');
  });

  it('should return 401 for an invalid token', async () => {
    // Making a GET request to /displayMember with an invalid token
    const response = await request(app)
      .get('/displayMember')
      .set('Authorization', 'Bearer invalid.token.here')
      .send();
    // Asserting response status code and message
    expect(response.statusCode).toBe(401);
    expect(response.text).toContain('Invalid token');
  });

  it('should return member details for a valid token', async () => {
    // Making a GET request to /displayMember with a valid token
    const response = await request(app)
      .get('/displayMember')
      .set('Authorization', `Bearer ${validToken}`)
      .send();
    // Asserting response status code and presence of member details
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('memberDetails');
  });
});
