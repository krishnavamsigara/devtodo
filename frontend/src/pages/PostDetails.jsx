import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { postsApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const CATEGORY_CLASS_MAP = {
  Technology: 'badge-technology',
  DevOps: 'badge-devops',
  Programming: 'badge-programming',
  Database: 'badge-database',
  Frontend: 'badge-frontend',
  Backend: 'badge-backend',
  Other: 'badge-other'
};

export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await postsApi.getById(id);
        setPost(response.data?.data);
      } catch (err) {
        setError(err.message || 'Failed to load post details');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      setIsDeleting(true);
      await postsApi.delete(id);
      navigate('/posts');
    } catch (err) {
      setError(err.message || 'Failed to delete post');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <Loading message="Loading post details..." />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container">
        <ErrorMessage message={error || 'Post not found'} />
        <Link to="/posts" className="btn btn-outline" style={{ marginTop: '1rem' }}>
          &larr; Back to Posts
        </Link>
      </div>
    );
  }

  const isAuthor = user && user.id === post.authorId;
  const badgeClass = CATEGORY_CLASS_MAP[post.category] || 'badge-other';
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="container">
      <Link to="/posts" className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem' }}>
        &larr; Back to Posts
      </Link>

      <article className="post-detail-card">
        <header className="post-detail-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>{post.title}</h1>
            <span className={`badge ${badgeClass}`}>{post.category}</span>
          </div>

          <div className="post-detail-meta">
            <span>By <strong>{post.author?.name || 'Anonymous'}</strong> ({post.author?.email})</span>
            <span>•</span>
            <time dateTime={post.createdAt}>{formattedDate}</time>
          </div>
        </header>

        <div className="post-detail-body">{post.description}</div>

        {isAuthor && (
          <div className="post-detail-actions">
            <Link to={`/edit-post/${post.id}`} className="btn btn-outline">
              ✏️ Edit Post
            </Link>
            <button
              onClick={handleDelete}
              className="btn btn-danger"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : '🗑️ Delete Post'}
            </button>
          </div>
        )}
      </article>
    </div>
  );
}
