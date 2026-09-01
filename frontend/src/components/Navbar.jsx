import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/posts" className="navbar-logo">
          <span>📝</span>
          <span>Blog Posts</span>
        </Link>

        <nav className="navbar-nav">
          <NavLink to="/posts" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
            Posts
          </NavLink>

          {isAuthenticated ? (
            <>
              <Link to="/create-post" className="btn btn-primary btn-sm">
                + Create Post
              </Link>
              <NavLink to="/profile" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                Profile ({user?.name || 'User'})
              </NavLink>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                Login
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
