const request = require('supertest');
const app = require('../backend/server.js');
const mysql = require('mysql2/promise');

describe('GET /', () => {
  beforeAll(async () => {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'gymDB'
    });

    await connection.query(`CREATE TABLE IF NOT EXISTS membership_test (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), price DECIMAL(10,2))`);
    await connection.query(`INSERT INTO membership_test (name, price) VALUES ('Basic', 19.99), ('Premium', 29.99)`);
  });

  afterAll(async () => {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'gymDB'
    });

    await connection.query(`DROP TABLE membership_test`);
    await connection.end();
  });

  it('should return all membership plans', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0); // Ensure at least one plan exists
  });
});
