import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Health Check API', () => {
  it('GET /api/health returns 200 and health payload', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: 'ok',
      service: 'posts-api'
    });
  });

  it('GET /api/non-existent returns 404', async () => {
    const res = await request(app).get('/api/non-existent');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
