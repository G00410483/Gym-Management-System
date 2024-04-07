const supertest = require('supertest');
const app = require('../backend/server.js');

describe('PUT /members/:id', () => {
  it('should update a member successfully and return a success message', async () => {
    // Member data to be updated
    const memberData = {
      pps_number: '8888888UU',
      first_name: 'Glen',
      second_name: 'Patton',
      email_address: 'gpatton@example.com',
      gender: 'male',
      date_of_birth: '1990-01-01',
      start_date: '2023-04-01',
      type_of_membership: 'basic'
    };

    // '1' is a valid member ID in your database for testing
    const response = await supertest(app)
      .put('/members/1') // Update the ID as necessary for your test environment
      .send(memberData)
      .expect(200); // Expecting HTTP status code 200

    // Assert on the response
    expect(response.body.message).toBe('Member updated successfully');
  });

  it('should return a 400 status code if required member information is missing', async () => {
    // Mock incomplete member data
    const incompleteMemberData = {
      // Missing some required fields
      first_name: 'Jane',
      email_address: 'janedoe@example.com',
      gender: 'Female',
    };

    const response = await supertest(app)
      .put('/members/2') // '2' is another valid member ID
      .send(incompleteMemberData)
      .expect(400); // Expecting HTTP status code 400 for Bad Request
  });

});

