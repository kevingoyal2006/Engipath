import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, LayoutDashboard, Route, FolderGit2, 
  HelpCircle, User, LogOut, ShieldAlert
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to={user ? "/dashboard" : "/"} className="brand-logo">
          <Compass size={28} style={{ color: 'var(--gossamer-orange)' }} />
          <span style={{
            background: 'linear-gradient(135deg, #EC4D25 0%, #2BCFCE 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>EngiPath</span>
        </Link>

        {user ? (
          <>
            <ul className="nav-links">
              <li>
                <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className={`nav-link ${isActive('/roadmap') ? 'active' : ''}`}>
                  <Route size={18} /> Roadmap
                </Link>
              </li>
              <li>
                <Link to="/projects" className={`nav-link ${isActive('/projects') ? 'active' : ''}`}>
                  <FolderGit2 size={18} /> Projects
                </Link>
              </li>
              <li>
                <Link to="/assessment" className={`nav-link ${isActive('/assessment') ? 'active' : ''}`}>
                  <HelpCircle size={18} /> Assessment
                </Link>
              </li>
              <li>
                <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>
                  <User size={18} /> Profile
                </Link>
              </li>

              {user.role === 'admin' && (
                <li>
                  <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`} style={{ color: '#EC4D25' }}>
                    <ShieldAlert size={18} /> Admin Panel
                  </Link>
                </li>
              )}
            </ul>

            <div className="nav-user-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className="user-name" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {user.name} <span className="badge badge-recommended" style={{ fontSize: '0.7rem' }}>{user.role}</span>
              </span>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
