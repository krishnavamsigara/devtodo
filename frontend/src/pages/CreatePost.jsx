import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { postsApi } from '../services/api';
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

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await postsApi.create({
        title,
        description,
        category
      });
      const newPost = response.data?.data;
      navigate(`/posts/${newPost.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create post');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="form-card" style={{ maxWidth: '650px' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Create Post</h1>

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
              placeholder="e.g. Learning Docker"
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
              placeholder="Write your post content here (min 10 characters)..."
              minLength={10}
              required
            />
          </div>

          <div className="form-footer">
            <Link to="/posts" className="btn btn-outline">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
