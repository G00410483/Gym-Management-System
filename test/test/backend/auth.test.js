const request = require('supertest');
const app = require('../../../backend/server.js'); 

describe('POST /login', () => {
  it('should login successfully with correct credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'dane@gm.com', // Valid email from database
        password: '12' // Valid password from database
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token'); // Response should have a token property
  });

  it('should fail login with incorrect credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'dane@gm.com', // Valid email from database
        password: 'wrongPassword' // Intentionally wrong password
      });

    expect(response.statusCode).toBe(401); // Unauthorized access code
  });
});
