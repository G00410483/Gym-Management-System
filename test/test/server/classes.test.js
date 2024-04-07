const request = require('supertest');
const app = require('../../../backend/server.js');

describe('GET /classes', () => {
    it('should return a list of classes with the correct structure', async () => {
      const response = await request(app)
        .get('/classes')
        .expect('Content-Type', /json/)
        .expect(200);
  
      // Check if the response body is an array
      expect(Array.isArray(response.body)).toBeTruthy();
  
      // Optionally, if you know the structure of a class object, you can check the first item as an example
      if (response.body.length > 0) {
        const classExample = response.body[0];
        expect(classExample).toHaveProperty('class_name');
        expect(classExample).toHaveProperty('instructor_name');
        expect(classExample).toHaveProperty('time');
        expect(classExample).toHaveProperty('day');
        expect(classExample).toHaveProperty('max_capacity');
      }
    });
  });
  