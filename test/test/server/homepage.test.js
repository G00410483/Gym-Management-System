const request = require('supertest');
const app = require('../../../backend/server.js');
const mysql = require('mysql2/promise');

describe('GET /', () => {
  beforeAll(async () => {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'gymdb'
    });

    await connection.query(`CREATE TABLE IF NOT EXISTS membership_test (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), price DECIMAL(10,2))`);
    await connection.query(`INSERT INTO membership_test (name, price) VALUES ('Basic', 19.99), ('Premium', 29.99)`);
  });

  afterAll(async () => {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'gymdb'
    });

    await connection.query(`DROP TABLE membership_test`);
    await connection.end();
  });

  // Test case for retrieving all membership plans
  it('should return all membership plans', async () => {
    // Using supertest to send a GET reques to the '/' endpoint
    const response = await request(app).get('/');
    // Response status code should be 200
    expect(response.statusCode).toBe(200);
    // Expects the response body to be an array, since multiple plans are fetched
    expect(Array.isArray(response.body)).toBeTruthy();
    // Indicating that at least one membership plan exists in the database 
    expect(response.body.length).toBeGreaterThan(0); 
  });
});
