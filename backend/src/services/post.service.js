import prisma from '../config/db.js';

export const getAllPosts = async ({ page = 1, limit = 10, search, category, authorId } = {}) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const where = {};

  if (category && category !== 'All') {
    where.category = category;
  }

  if (authorId) {
    where.authorId = parseInt(authorId, 10);
  }

  if (search && search.trim() !== '') {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }

  const [total, posts] = await Promise.all([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
  ]);

  const totalPages = Math.ceil(total / limitNum) || 1;

  return {
    posts,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages
    }
  };
};

export const getPostById = async (id) => {
  const postId = parseInt(id, 10);
  if (isNaN(postId)) {
    const error = new Error('Invalid post ID');
    error.statusCode = 400;
    throw error;
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  if (!post) {
    const error = new Error('Post not found');
    error.statusCode = 404;
    throw error;
  }

  return post;
};

export const createPost = async ({ title, description, category, authorId }) => {
  return prisma.post.create({
    data: {
      title,
      description,
      category: category || 'Technology',
      authorId
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};

export const updatePost = async (id, userId, data) => {
  const postId = parseInt(id, 10);
  if (isNaN(postId)) {
    const error = new Error('Invalid post ID');
    error.statusCode = 400;
    throw error;
  }

  const post = await prisma.post.findUnique({
    where: { id: postId }
  });

  if (!post) {
    const error = new Error('Post not found');
    error.statusCode = 404;
    throw error;
  }

  if (post.authorId !== userId) {
    const error = new Error('You are not authorized to update this post');
    error.statusCode = 403;
    throw error;
  }

  return prisma.post.update({
    where: { id: postId },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.category && { category: data.category })
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};

export const deletePost = async (id, userId) => {
  const postId = parseInt(id, 10);
  if (isNaN(postId)) {
    const error = new Error('Invalid post ID');
    error.statusCode = 400;
    throw error;
  }

  const post = await prisma.post.findUnique({
    where: { id: postId }
  });

  if (!post) {
    const error = new Error('Post not found');
    error.statusCode = 404;
    throw error;
  }

  if (post.authorId !== userId) {
    const error = new Error('You are not authorized to delete this post');
    error.statusCode = 403;
    throw error;
  }

  await prisma.post.delete({
    where: { id: postId }
  });

  return { id: postId };
};
