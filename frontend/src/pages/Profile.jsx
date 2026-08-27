import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { postsApi } from '../services/api';
import PostCard from '../components/PostCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function Profile() {
  const { user } = useAuth();
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyPosts = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const response = await postsApi.getAll({ authorId: user.id, limit: 100 });
      const data = response.data?.data;
      setMyPosts(data?.posts || (Array.isArray(data) ? data : []));
    } catch (err) {
      setError(err.message || 'Failed to load your posts');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMyPosts();
  }, [fetchMyPosts]);

  if (!user) return null;

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      })
    : 'Recently';

  return (
    <div className="container">
      <div className="profile-card">
        <div className="profile-avatar">{user.name ? user.name[0].toUpperCase() : 'U'}</div>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{user.name}</h1>
        <p style={{ color: '#475569', fontSize: '0.95rem' }}>{user.email}</p>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          Member since {joinDate}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem' }}>My Posts ({myPosts.length})</h2>
        <Link to="/create-post" className="btn btn-primary btn-sm">
          + Create New Post
        </Link>
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <Loading message="Loading your posts..." />
      ) : myPosts.length === 0 ? (
        <div className="empty-state">
          <h3>You haven&apos;t published any posts yet</h3>
          <p style={{ marginTop: '0.5rem', color: '#64748b' }}>
            Share your knowledge with others by creating your first post.
          </p>
          <Link to="/create-post" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Create Post
          </Link>
        </div>
      ) : (
        <section>
          {myPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>
      )}
    </div>
  );
}
