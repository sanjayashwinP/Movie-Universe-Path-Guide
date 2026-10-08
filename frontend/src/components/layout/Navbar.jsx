import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Film, Compass, ListOrdered, GitBranch, Sparkles, 
  Clock, Bookmark, BarChart3, ShieldAlert, Search, 
  User, LogOut, LogIn, Menu, X 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar({ onOpenSearch, onOpenAuth }) {
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Brand */}
        <Link to="/" className="brand" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-icon" style={{ background: 'linear-gradient(135deg, #00f0ff 0%, #ff0844 100%)', boxShadow: '0 0 16px rgba(0, 240, 255, 0.4)' }}>
            <Film size={20} color="#ffffff" />
          </div>
          <span>OmniVerse<span className="brand-dot" style={{ color: '#00f0ff' }}>.</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden-mobile">
          <ul className="nav-links">
            <li>
              <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/explore" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Compass size={16} /> Explore
              </NavLink>
            </li>
            <li>
              <NavLink to="/story-flow" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <GitBranch size={16} /> Story Flow
              </NavLink>
            </li>
            <li>
              <NavLink to="/roadmap" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ color: 'var(--accent-blue)' }}>
                <Sparkles size={16} /> Path to Movie
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/starter-guide" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                style={({ isActive }) => ({
                  background: isActive 
                    ? 'linear-gradient(135deg, rgba(230, 36, 41, 0.4) 0%, rgba(99, 102, 241, 0.4) 100%)'
                    : 'linear-gradient(135deg, rgba(230, 36, 41, 0.18) 0%, rgba(99, 102, 241, 0.18) 100%)',
                  border: '1px solid rgba(230, 36, 41, 0.4)',
                  color: '#ffffff',
                  fontWeight: 700,
                  boxShadow: '0 0 16px rgba(230, 36, 41, 0.25)',
                  gap: '6px'
                })}
              >
                <Sparkles size={15} color="#00f0ff" />
                <span>Beginner Guide (Release Order)</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/watch-orders" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <ListOrdered size={16} /> Watch Orders
              </NavLink>
            </li>
            <li>
              <NavLink to="/upcoming" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Clock size={16} /> Upcoming Slate
              </NavLink>
            </li>
            {user && (
              <>
                <li>
                  <NavLink to="/watchlist" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Bookmark size={16} /> Watchlist
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/stats" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <BarChart3 size={16} /> Stats
                  </NavLink>
                </li>
              </>
            )}
            {isAdmin && (
              <li>
                <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ color: 'var(--accent-amber)' }}>
                  <ShieldAlert size={16} /> Admin
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {/* Right Actions */}
        <div className="nav-actions">
          {/* Quick Search Button */}
          <button 
            type="button" 
            className="search-trigger-btn"
            onClick={onOpenSearch}
            title="Search movies, series, timelines (Ctrl+K)"
          >
            <Search size={16} />
            <span className="hidden-mobile">Search universes...</span>
            <kbd className="search-shortcut hidden-mobile">Ctrl K</kbd>
          </button>

          {/* User Account / Auth */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button 
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--grad-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden-mobile">{user.username}</span>
              </button>

              {userDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  width: '200px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 100
                }}>
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '6px' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.displayName || user.username}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Role: {user.role}</div>
                  </div>
                  <Link 
                    to="/watchlist" 
                    className="nav-link" 
                    onClick={() => setUserDropdownOpen(false)}
                    style={{ padding: '8px 12px' }}
                  >
                    <Bookmark size={15} /> My Watchlist
                  </Link>
                  <Link 
                    to="/stats" 
                    className="nav-link" 
                    onClick={() => setUserDropdownOpen(false)}
                    style={{ padding: '8px 12px' }}
                  >
                    <BarChart3 size={15} /> My Analytics
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="nav-link" 
                      onClick={() => setUserDropdownOpen(false)}
                      style={{ padding: '8px 12px', color: 'var(--accent-amber)' }}
                    >
                      <ShieldAlert size={15} /> Admin Portal
                    </Link>
                  )}
                  <button 
                    type="button" 
                    onClick={handleLogout}
                    className="nav-link" 
                    style={{ width: '100%', textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--accent-red)', padding: '8px 12px' }}
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              type="button" 
              className="btn btn-primary btn-sm"
              onClick={onOpenAuth}
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            type="button" 
            className="btn btn-ghost btn-sm hidden-desktop"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '72px',
          left: 0,
          right: 0,
          background: 'rgba(7, 8, 12, 0.98)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '20px',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <NavLink to="/" end className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/explore" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            <Compass size={16} /> Explore
          </NavLink>
          <NavLink to="/story-flow" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            <GitBranch size={16} /> Master Story Flow
          </NavLink>
          <NavLink to="/roadmap" className="nav-link" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--accent-blue)' }}>
            <Sparkles size={16} /> Path to Movie (Roadmap)
          </NavLink>
          <NavLink to="/starter-guide" className="nav-link" onClick={() => setMobileMenuOpen(false)} style={{ color: '#00f0ff', fontWeight: 700 }}>
            <Sparkles size={16} /> Beginner Guide (Release Order)
          </NavLink>
          <NavLink to="/watch-orders" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            <ListOrdered size={16} /> Watch Orders
          </NavLink>
          <NavLink to="/timelines" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            <GitBranch size={16} /> Timelines
          </NavLink>
          <NavLink to="/sagas" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            <Sparkles size={16} /> Sagas & Phases
          </NavLink>
          <NavLink to="/upcoming" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            <Clock size={16} /> Upcoming
          </NavLink>
          {user && (
            <>
              <NavLink to="/watchlist" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                <Bookmark size={16} /> Watchlist
              </NavLink>
              <NavLink to="/stats" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                <BarChart3 size={16} /> Stats
              </NavLink>
            </>
          )}
          {isAdmin && (
            <NavLink to="/admin" className="nav-link" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--accent-amber)' }}>
              <ShieldAlert size={16} /> Admin Portal
            </NavLink>
          )}
        </div>
      )}
    </header>
  );
}
