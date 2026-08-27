import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import prisma from '../src/config/db.js';
import { generateToken } from '../src/utils/jwt.js';

vi.mock('../src/config/db.js', () => {
  return {
    default: {
      user: {
        findUnique: vi.fn()
      },
      post: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        count: vi.fn()
      }
    }
  };
});

describe('Posts API', () => {
  const user1 = { id: 1, name: 'Alice', email: 'alice@example.com' };
  const user2 = { id: 2, name: 'Bob', email: 'bob@example.com' };
  const tokenUser1 = generateToken({ userId: 1, email: 'alice@example.com' });
  const tokenUser2 = generateToken({ userId: 2, email: 'bob@example.com' });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/posts', () => {
    it('returns a paginated list of posts', async () => {
      const mockPosts = [
        {
          id: 1,
          title: 'Learning Docker',
          description: 'Docker basics and containerization.',
          category: 'DevOps',
          authorId: 1,
          author: { id: 1, name: 'Alice', email: 'alice@example.com' }
        }
      ];

      prisma.post.count.mockResolvedValue(1);
      prisma.post.findMany.mockResolvedValue(mockPosts);

      const res = await request(app).get('/api/posts?page=1&limit=10');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.posts).toHaveLength(1);
      expect(res.body.data.posts[0].title).toBe('Learning Docker');
      expect(res.body.data.pagination).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1
      });
    });
  });

  describe('GET /api/posts/:id', () => {
    it('returns a single post by id', async () => {
      const mockPost = {
        id: 1,
        title: 'Learning Docker',
        description: 'Docker basics and containerization.',
        category: 'DevOps',
        authorId: 1,
        author: { id: 1, name: 'Alice', email: 'alice@example.com' }
      };

      prisma.post.findUnique.mockResolvedValue(mockPost);

      const res = await request(app).get('/api/posts/1');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(1);
    });

    it('returns 404 if post not found', async () => {
      prisma.post.findUnique.mockResolvedValue(null);

      const res = await request(app).get('/api/posts/999');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/posts', () => {
    it('rejects unauthenticated create with 401', async () => {
      const res = await request(app).post('/api/posts').send({
        title: 'New Post Title',
        description: 'A valid description for the post with sufficient length.',
        category: 'DevOps'
      });

      expect(res.status).toBe(401);
    });

    it('creates post successfully when authenticated', async () => {
      prisma.user.findUnique.mockResolvedValue(user1);
      prisma.post.create.mockResolvedValue({
        id: 10,
        title: 'New Post Title',
        description: 'A valid description for the post with sufficient length.',
        category: 'DevOps',
        authorId: 1,
        author: user1
      });

      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send({
          title: 'New Post Title',
          description: 'A valid description for the post with sufficient length.',
          category: 'DevOps'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(10);
    });
  });

  describe('PUT /api/posts/:id', () => {
    it('updates post if user is the author', async () => {
      prisma.user.findUnique.mockResolvedValue(user1);
      prisma.post.findUnique.mockResolvedValue({
        id: 1,
        title: 'Old Title',
        authorId: 1
      });
      prisma.post.update.mockResolvedValue({
        id: 1,
        title: 'Updated Title',
        authorId: 1,
        author: user1
      });

      const res = await request(app)
        .put('/api/posts/1')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send({
          title: 'Updated Title'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Updated Title');
    });

    it('rejects update with 403 if user is not author', async () => {
      prisma.user.findUnique.mockResolvedValue(user2);
      prisma.post.findUnique.mockResolvedValue({
        id: 1,
        title: 'Alice Post',
        authorId: 1 // Belongs to user1
      });

      const res = await request(app)
        .put('/api/posts/1')
        .set('Authorization', `Bearer ${tokenUser2}`)
        .send({
          title: 'Hacked Title'
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/posts/:id', () => {
    it('deletes post if user is the author', async () => {
      prisma.user.findUnique.mockResolvedValue(user1);
      prisma.post.findUnique.mockResolvedValue({
        id: 1,
        authorId: 1
      });
      prisma.post.delete.mockResolvedValue({ id: 1 });

      const res = await request(app)
        .delete('/api/posts/1')
        .set('Authorization', `Bearer ${tokenUser1}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('rejects delete with 403 if user is not author', async () => {
      prisma.user.findUnique.mockResolvedValue(user2);
      prisma.post.findUnique.mockResolvedValue({
        id: 1,
        authorId: 1 // Belongs to user1
      });

      const res = await request(app)
        .delete('/api/posts/1')
        .set('Authorization', `Bearer ${tokenUser2}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });
});
