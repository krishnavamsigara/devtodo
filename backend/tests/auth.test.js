import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import prisma from '../src/config/db.js';
import bcrypt from 'bcryptjs';

vi.mock('../src/config/db.js', () => {
  return {
    default: {
      user: {
        findUnique: vi.fn(),
        create: vi.fn()
      }
    }
  };
});

describe('Auth API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('registers a new user successfully', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const res = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('test@example.com');
      expect(res.body.data.token).toBeDefined();
    });

    it('rejects duplicate email with 409 Conflict', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'existing@example.com'
      });

      const res = await request(app).post('/api/auth/register').send({
        name: 'Duplicate',
        email: 'existing@example.com',
        password: 'password123'
      });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already registered');
    });

    it('rejects invalid payload with 400 Bad Request', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'A', // too short (< 2)
        email: 'invalid-email',
        password: '123' // too short (< 6)
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    it('logs in successfully with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe('test@example.com');
    });

    it('rejects invalid password with 401', async () => {
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('returns current user profile when token is valid', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      prisma.user.findUnique.mockResolvedValueOnce({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Login to get token
      const loginRes = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123'
      });

      const token = loginRes.body.data.token;

      // Mock user lookup for auth middleware and getMe
      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.id).toBe(1);
    });

    it('rejects request without token with 401', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
