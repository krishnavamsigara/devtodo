import { Link } from 'react-router-dom';

const CATEGORY_CLASS_MAP = {
  Technology: 'badge-technology',
  DevOps: 'badge-devops',
  Programming: 'badge-programming',
  Database: 'badge-database',
  Frontend: 'badge-frontend',
  Backend: 'badge-backend',
  Other: 'badge-other'
};

export default function PostCard({ post }) {
  const badgeClass = CATEGORY_CLASS_MAP[post.category] || 'badge-other';
  const authorName = post.author?.name || 'Anonymous';
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="post-card" data-testid={`post-card-${post.id}`}>
      <div className="post-card-header">
        <h2 className="post-card-title">
          <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </h2>
        <span className={`badge ${badgeClass}`}>{post.category}</span>
      </div>

      <p className="post-card-desc">
        {post.description.length > 200
          ? `${post.description.substring(0, 200)}...`
          : post.description}
      </p>

      <div className="post-card-footer">
        <span>By <strong>{authorName}</strong></span>
        <time dateTime={post.createdAt}>{formattedDate}</time>
      </div>
    </article>
  );
}
