import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postsApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const CATEGORIES = [
  'Technology',
  'DevOps',
  'Programming',
  'Database',
  'Frontend',
  'Backend',
  'Other'
];

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await postsApi.getById(id);
        const post = response.data?.data;

        if (user && post.authorId !== user.id) {
          setError('You are not authorized to edit this post');
          return;
        }

        setTitle(post.title);
        setDescription(post.description);
        setCategory(post.category);
      } catch (err) {
        setError(err.message || 'Failed to load post for editing');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await postsApi.update(id, {
        title,
        description,
        category
      });
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update post');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <Loading message="Loading post for editing..." />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-card" style={{ maxWidth: '650px' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Edit Post</h1>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              minLength={3}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className="form-textarea"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              minLength={10}
              required
            />
          </div>

          <div className="form-footer">
            <Link to={`/posts/${id}`} className="btn btn-outline">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
