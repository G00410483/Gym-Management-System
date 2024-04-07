const request = require('supertest');
const app = require('../backend/server.js');

describe('GET /dashboard', () => {
  test('It should respond with an object containing gym statistics', async () => {
    const response = await request(app)
      .get('/dashboard')
      .expect('Content-Type', /json/)
      .expect(200);

    // Check for the structure of the response to match the expected dashboard data
    expect(response.body).toEqual(expect.objectContaining({
      totalMembers: expect.any(Array),
      totalBookings: expect.any(Array),
      totalClasses: expect.any(Array),
      genders: expect.any(Array),
      memberships: expect.any(Array),
      mostBooked: expect.any(Array),
      membersTimeline: expect.any(Array),
      totalPayments: expect.any(Array),
      paymentsByYear: expect.any(Array),
      paymentsByMonth: expect.any(Array)
    }));
  });
});
