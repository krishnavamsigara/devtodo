import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { postsApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import PostCard from '../components/PostCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const CATEGORIES = [
  'All',
  'Technology',
  'DevOps',
  'Programming',
  'Database',
  'Frontend',
  'Backend',
  'Other'
];

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 1
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const { isAuthenticated } = useAuth();

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        limit: 6
      };
      if (search.trim()) params.search = search.trim();
      if (category && category !== 'All') params.category = category;

      const response = await postsApi.getAll(params);
      const data = response.data?.data;
      if (data?.posts) {
        setPosts(data.posts);
        setPagination(data.pagination || { page, limit: 6, total: data.posts.length, totalPages: 1 });
      } else if (Array.isArray(data)) {
        setPosts(data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPosts();
    }, 200);

    return () => clearTimeout(timer);
  }, [fetchPosts]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  return (
    <div className="container">
      <div className="posts-header">
        <div className="filters-bar">
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search posts..."
            value={search}
            onChange={handleSearchChange}
          />
          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={category}
            onChange={handleCategoryChange}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {isAuthenticated && (
          <Link to="/create-post" className="btn btn-primary">
            + Create Post
          </Link>
        )}
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <Loading message="Fetching posts..." />
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <h3>No posts found</h3>
          <p style={{ marginTop: '0.5rem', color: '#64748b' }}>
            Try adjusting your search query or category filter.
          </p>
          {isAuthenticated && (
            <Link
              to="/create-post"
              className="btn btn-primary"
              style={{ marginTop: '1.25rem' }}
            >
              Write the First Post
            </Link>
          )}
        </div>
      ) : (
        <>
          <section>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </section>

          {pagination.totalPages > 1 && (
            <div
              className="pagination"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem',
                marginTop: '2rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-color)'
              }}
            >
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                &larr; Previous
              </button>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.total} total)
              </span>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
              >
                Next &rarr;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
