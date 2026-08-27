import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PostCard from '../components/PostCard';

describe('PostCard Component', () => {
  const samplePost = {
    id: 1,
    title: 'Learning Docker',
    description: 'Docker allows applications to run in isolated containers.',
    category: 'DevOps',
    createdAt: new Date('2025-01-15T12:00:00Z').toISOString(),
    author: {
      id: 1,
      name: 'Krishna'
    }
  };

  it('renders post title, category badge, author and description', () => {
    render(
      <BrowserRouter>
        <PostCard post={samplePost} />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: 'Learning Docker' })).toBeInTheDocument();
    expect(screen.getByText('DevOps')).toBeInTheDocument();
    expect(screen.getByText(/Docker allows applications to run in isolated containers/i)).toBeInTheDocument();
    expect(screen.getByText('Krishna')).toBeInTheDocument();
  });
});
