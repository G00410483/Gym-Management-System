const request = require('supertest');
const app = require('../../../backend/server.js');
const mysql = require('mysql2/promise');

// Setup a test database connection
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'gymdb'
};

describe('/registerMember endpoint', () => {

  beforeAll(async () => {
    const connection = await mysql.createConnection(dbConfig);
    await connection.end();
  });

  afterAll(async () => {
    const connection = await mysql.createConnection(dbConfig);
    await connection.end();
  });

  it('should return 400 for missing fields', async () => {
    const response = await request(app).post('/registerMember').send({

    });
    expect(response.statusCode).toBe(400);
    expect(response.text).toContain('Missing required registration information');
  });

  
});
