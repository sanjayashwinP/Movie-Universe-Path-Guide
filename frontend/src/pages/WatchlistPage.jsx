import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Star, Trash2, Check, Film, ArrowRight } from 'lucide-react';
import { userTrackingApi, contentApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { getPosterFallback } from '../utils/imageFallback';

export default function WatchlistPage() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [activeTab, setActiveTab] = useState('WANT_TO_WATCH');
  const [watchlist, setWatchlist] = useState([]);
  const [contentMap, setContentMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWatchlist() {
      if (!user) return;
      setLoading(true);
      try {
        const [wlRes, contentRes] = await Promise.all([
          userTrackingApi.getWatchlist(),
          contentApi.getAll({ size: 100 })
        ]);
        setWatchlist(wlRes.data.data || []);

        const map = {};
        (contentRes.data.data.content || []).forEach(c => {
          map[c.id] = c;
        });
        setContentMap(map);
      } catch (err) {
        console.error('Failed to load watchlist:', err);
      } finally {
        setLoading(false);
      }
    }

    loadWatchlist();
  }, [user]);

  const handleRemove = async (contentId) => {
    try {
      await userTrackingApi.removeFromWatchlist(contentId);
      setWatchlist(watchlist.filter(w => w.contentId !== contentId));
      showSuccess('Removed from watchlist');
    } catch (err) {
      showError('Failed to remove item');
    }
  };

  const handleStatusChange = async (contentId, newStatus) => {
    try {
      await userTrackingApi.updateWatchlist(contentId, { status: newStatus });
      setWatchlist(watchlist.map(w => w.contentId === contentId ? { ...w, status: newStatus } : w));
      showSuccess(`Moved to ${newStatus.replace('_', ' ')}`);
    } catch (err) {
      showError('Failed to update status');
    }
  };

  const filtered = watchlist.filter(w => w.status === activeTab);

  if (!user) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <Bookmark size={48} color="var(--accent-red)" style={{ marginBottom: '16px' }} />
        <h2>Sign in to track your personal watchlist</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          Organize what you want to watch next, track progress, and review your personal ratings.
        </p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      {/* Title */}
      <div className="section-header" style={{ marginBottom: '28px' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '2rem' }}>
            <Bookmark size={26} color="var(--accent-red)" />
            Personal Watchlist &amp; Tracking
          </h1>
          <p className="section-subtitle">
            Manage your queue, active series, and completed cinematic milestones.
          </p>
        </div>
      </div>

      {/* Status Tabs */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '32px' }}>
        {[
          { id: 'WANT_TO_WATCH', label: 'Want to Watch' },
          { id: 'WATCHING', label: 'Currently Watching' },
          { id: 'WATCHED', label: 'Completed' },
          { id: 'DROPPED', label: 'Dropped' }
        ].map(tab => {
          const count = watchlist.filter(w => w.status === tab.id).length;
          return (
            <button
              key={tab.id}
              type="button"
              className={`order-chip ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.label}</span>
              <span className="badge badge-secondary" style={{ fontSize: '0.7rem', padding: '1px 6px' }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of items */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {[1, 2, 3].map(n => (
            <div key={n} className="skeleton" style={{ height: '140px', borderRadius: 'var(--radius-md)' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          padding: '60px 20px',
          textAlign: 'center',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-card)'
        }}>
          <Film size={36} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>No items in "{activeTab.replace('_', ' ')}"</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
            Browse the canon explorer to queue movies and series.
          </p>
          <Link to="/explore" className="btn btn-primary btn-sm">
            Explore Cinematic Universes
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filtered.map(entry => {
            const item = contentMap[entry.contentId];
            if (!item) return null;

            return (
              <div 
                key={entry.id}
                style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '16px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-md)',
                  alignItems: 'center'
                }}
              >
                <Link 
                  to={`/content/${item.id}`} 
                  style={{ width: '60px', height: '90px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0, backgroundColor: '#111420' }}
                >
                  <img 
                    src={item.posterUrl || getPosterFallback(item.title, item.contentType)} 
                    alt={item.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getPosterFallback(item.title, item.contentType);
                    }}
                  />
                </Link>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>{item.contentType?.replace('_', ' ')}</span>
                    <span>&bull;</span>
                    <span>{item.releaseYear}</span>
                  </div>

                  <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <Link to={`/content/${item.id}`} style={{ color: '#ffffff', textDecoration: 'none' }}>
                      {item.title}
                    </Link>
                  </h4>

                  {entry.rating && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--accent-amber)', marginBottom: '8px' }}>
                      <Star size={13} fill="currentColor" /> {entry.rating} / 10
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                    {activeTab !== 'WATCHED' && (
                      <button 
                        type="button" 
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        onClick={() => handleStatusChange(item.id, 'WATCHED')}
                      >
                        <Check size={12} /> Mark Watched
                      </button>
                    )}

                    <button 
                      type="button" 
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '4px 8px', color: 'var(--accent-red)' }}
                      onClick={() => handleRemove(item.id)}
                      title="Remove from watchlist"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
