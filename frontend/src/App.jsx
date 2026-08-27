import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Posts from './pages/Posts';
import PostDetails from './pages/PostDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Profile from './pages/Profile';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/posts" replace />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/edit-post/:id" element={<EditPost />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* 404 Catch-all */}
          <Route
            path="*"
            element={
              <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                <h1 style={{ fontSize: '3rem' }}>404</h1>
                <p style={{ color: '#64748b', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                  Page not found.
                </p>
                <Navigate to="/posts" replace />
              </div>
            }
          />
        </Routes>
      </main>
    </>
  );
}
