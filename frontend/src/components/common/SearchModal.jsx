import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Film, Tv, Sparkles, Clock, Check, ArrowRight } from 'lucide-react';
import { contentApi } from '../../services/api';
import { useWatch } from '../../contexts/WatchContext';
import { clientDataService, normalizeContentItem } from '../../services/clientDataService';
import { getPosterFallback } from '../../utils/imageFallback';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { isWatched } = useWatch();

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Keyboard escape & Ctrl+K support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        let list = [];
        try {
          const res = await contentApi.search(query.trim());
          const apiData = res.data?.data;
          list = apiData?.content || (Array.isArray(apiData) ? apiData : []);
        } catch (apiErr) {
          // Fall back to client data
        }

        if (!list || list.length === 0) {
          list = await clientDataService.getAllContent({ search: query.trim() });
        }
        const normalized = Array.isArray(list) ? list.map(normalizeContentItem) : [];
        setResults(normalized);
      } catch (err) {
        console.error('Search query failed:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (contentId) => {
    onClose();
    navigate(`/content/${contentId}`);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'SERIES':
      case 'LIMITED_SERIES':
      case 'ANIMATED_SERIES':
        return <Tv size={14} />;
      case 'SPECIAL_PRESENTATION':
        return <Sparkles size={14} />;
      default:
        return <Film size={14} />;
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-dialog" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', padding: 0, overflow: 'hidden' }}
      >
        {/* Search Input Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(255, 255, 255, 0.03)'
        }}>
          <Search size={20} color="var(--text-muted)" />
          <input
            ref={inputRef}
            type="text"
            className="form-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, series, sagas, actors, characters..."
            style={{
              border: 'none',
              background: 'transparent',
              padding: '4px 0',
              fontSize: '1.1rem',
              color: '#ffffff',
              boxShadow: 'none'
            }}
          />
          {query && (
            <button 
              type="button" 
              onClick={() => setQuery('')}
              className="btn btn-ghost btn-sm"
              style={{ padding: '4px' }}
            >
              <X size={18} />
            </button>
          )}
          <kbd className="search-shortcut" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>ESC</kbd>
        </div>

        {/* Results Body */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '12px' }}>
          {loading && (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div className="skeleton" style={{ width: '60%', height: '20px', margin: '0 auto 12px' }} />
              <div className="skeleton" style={{ width: '40%', height: '16px', margin: '0 auto' }} />
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '6px' }}>No cinematic matches found</p>
              <p style={{ fontSize: '0.85rem' }}>Try searching for "Iron Man", "Loki", "Avengers", or "Phase 1"</p>
            </div>
          )}

          {!loading && !query && (
            <div style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <div style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem', marginBottom: '12px', fontWeight: 600 }}>
                Popular Searches
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Iron Man', 'Loki', 'Deadpool & Wolverine', 'Avengers: Doomsday', 'Sacred Timeline', 'Infinity Saga'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="order-chip"
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    onClick={() => setQuery(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {results.map((item) => {
                const watched = isWatched(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid transparent',
                      transition: 'all var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    {/* Poster Thumbnail */}
                    <div style={{
                      width: '40px',
                      height: '56px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      backgroundColor: '#111420',
                      flexShrink: 0
                    }}>
                      <img 
                        src={item.posterUrl || getPosterFallback(item.title)} 
                        alt={item.title} 
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = getPosterFallback(item.title);
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>

                    {/* Title & Metadata */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ 
                          fontSize: '0.95rem', 
                          fontWeight: 600, 
                          color: '#ffffff',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {item.title}
                        </h4>
                        {watched && (
                          <span style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '4px',
                            color: 'var(--accent-emerald)', 
                            fontSize: '0.75rem', 
                            fontWeight: 600 
                          }}>
                            <Check size={12} /> Watched
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {getTypeIcon(item.contentType)} {item.contentType?.replace('_', ' ')}
                        </span>
                        <span>&bull;</span>
                        <span>{item.releaseYear || 'TBA'}</span>
                        {item.sagaName && (
                          <>
                            <span>&bull;</span>
                            <span style={{ color: 'var(--text-secondary)' }}>{item.sagaName}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <ArrowRight size={16} color="var(--text-muted)" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
