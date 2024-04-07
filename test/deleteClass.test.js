const request = require('supertest');
const app = require('../backend/server.js');
const mysql = require('mysql2/promise');

jest.mock('mysql2/promise');

describe('DELETE /classes/:id', () => {
    test('handles errors during class deletion', async () => {
        const idToDelete = 2;

        mysql.createConnection.mockRejectedValue(new Error('Database connection failed'));

        const response = await request(app).delete(`/classes/${idToDelete}`);
        expect(response.statusCode).toBe(500);
        expect(response.text).toContain('Internal Server Error');
    });
});
