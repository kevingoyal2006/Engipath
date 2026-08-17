import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Route, FolderGit2, HelpCircle, User, LogOut, ShieldAlert } from 'lucide-react';

/* EngiPath brand SVG icon — matches visual identity */
const EngiPathIcon = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="14" fill="#0B2545"/>
    <polyline points="10,22 4,32 10,42" stroke="#3B82F6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <polyline points="24,22 30,32 24,42" stroke="#3B82F6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <polyline points="34,44 40,36 46,40 54,26" stroke="url(#tg)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="34" cy="44" r="3" fill="#14B8A6"/>
    <circle cx="46" cy="40" r="3" fill="#2E74B5"/>
    <circle cx="54" cy="26" r="3" fill="#3B82F6"/>
    <polyline points="50,23 54,26 51,30" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <defs>
      <linearGradient id="tg" x1="34" y1="44" x2="54" y2="26" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#14B8A6"/>
        <stop offset="100%" stopColor="#3B82F6"/>
      </linearGradient>
    </defs>
  </svg>
);

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

        {/* EngiPath Brand Logo */}
        <Link to={user ? "/dashboard" : "/"} className="brand-logo" style={{ textDecoration: 'none' }}>
          <EngiPathIcon size={36} />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
              <span style={{ color: '#0B2545' }}>Engi</span>
              <span style={{ color: '#2E74B5' }}>Path</span>
            </span>
            <span style={{ fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
              Career Roadmaps
            </span>
          </div>
        </Link>

        {user ? (
          <>
            <ul className="nav-links">
              <li>
                <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                  <LayoutDashboard size={17} /> Dashboard
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className={`nav-link ${isActive('/roadmap') ? 'active' : ''}`}>
                  <Route size={17} /> Roadmap
                </Link>
              </li>
              <li>
                <Link to="/projects" className={`nav-link ${isActive('/projects') ? 'active' : ''}`}>
                  <FolderGit2 size={17} /> Projects
                </Link>
              </li>
              <li>
                <Link to="/assessment" className={`nav-link ${isActive('/assessment') ? 'active' : ''}`}>
                  <HelpCircle size={17} /> Assessment
                </Link>
              </li>
              <li>
                <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>
                  <User size={17} /> Profile
                </Link>
              </li>
              {user.role === 'admin' && (
                <li>
                  <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`} style={{ color: '#2E74B5', fontWeight: 700 }}>
                    <ShieldAlert size={17} /> Admin
                  </Link>
                </li>
              )}
            </ul>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-light)'
              }}>
                <div style={{
                  width: 28, height: 28,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0B2545, #2E74B5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '0.75rem', fontWeight: 700
                }}>
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.1 }}>{user.name}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{user.role}</div>
                </div>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                <LogOut size={15} /> Logout
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started Free</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
