import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Clock, Eye, Film, Tv, Sparkles, Star, Calendar, Bookmark } from 'lucide-react';
import { useWatch } from '../../contexts/WatchContext';
import { getDynamicReleaseInfo, formatDisplayDate } from '../../services/dateTracker';
import { getPosterFallback } from '../../utils/imageFallback';

export default function ContentCard({ content, orderType = 'chronological' }) {
  const { isWatched: checkWatched, toggleWatched, isInWatchlist, toggleWatchlist } = useWatch();
  const watched = (checkWatched && checkWatched(content.id)) || content.isWatched;
  const inWatchlist = isInWatchlist && isInWatchlist(content.id);

  const dynamicInfo = getDynamicReleaseInfo(content.releaseDate, content.status);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'TV_SERIES':
      case 'SERIES':
      case 'LIMITED_SERIES':
      case 'ANIMATED_SERIES':
        return <Tv size={13} />;
      case 'SPECIAL_PRESENTATION':
      case 'ONE_SHOT':
        return <Sparkles size={13} />;
      default:
        return <Film size={13} />;
    }
  };

  const getOrderBadge = () => {
    const chrono = content.chronologicalOrder || content.chronologicalOrderNum;
    const release = content.releaseOrder || content.releaseOrderNum;
    const timeline = content.timelineOrder || content.timelineOrderNum;

    if (orderType === 'chronological' && chrono) {
      return { label: `Chrono #${chrono}`, primary: true };
    }
    if (orderType === 'timeline' && timeline) {
      return { label: `Timeline #${timeline}`, primary: true };
    }
    if (release) {
      return { label: `Release #${release}`, primary: false };
    }
    if (chrono) {
      return { label: `Chrono #${chrono}`, primary: false };
    }
    return null;
  };

  const orderBadge = getOrderBadge();

  const handleToggleWatch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatched(content.id, content.title);
  };

  const handleToggleWatchlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist(content.id, content.title);
  };

  return (
    <div 
      className={`glass-card content-card ${watched ? 'watched' : ''}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        position: 'relative',
        transition: 'all var(--transition-normal)'
      }}
    >
      <Link to={`/content/${content.id || content.slug}`} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Poster Wrapper */}
        <div style={{
          position: 'relative',
          width: '100%',
          paddingTop: '142%', // Aspect ratio 1:1.42
          backgroundColor: '#0a0d16',
          overflow: 'hidden'
        }}>
          {(() => {
            const posterSrc = (!content.posterUrl || content.posterUrl.includes('unsplash.com'))
              ? getPosterFallback(content.title)
              : content.posterUrl;
            return (
              <img
                src={posterSrc}
                alt={content.title}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getPosterFallback(content.title);
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.4s ease'
                }}
              />
            );
          })()}

          {/* Gradient Overlay on Poster */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(7, 8, 15, 0.4) 0%, transparent 40%, rgba(7, 8, 15, 0.85) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '12px'
          }}>
            {/* Top row: Order badge & Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
              {orderBadge ? (
                <span style={{
                  padding: '4px 8px',
                  background: orderBadge.primary ? 'var(--accent-red)' : 'rgba(0, 0, 0, 0.65)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  boxShadow: orderBadge.primary ? '0 0 10px var(--accent-red-glow)' : 'none'
                }}>
                  {orderBadge.label}
                </span>
              ) : <div />}

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={handleToggleWatchlist}
                  title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: inWatchlist ? 'var(--accent-indigo)' : 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Bookmark size={15} fill={inWatchlist ? 'currentColor' : 'none'} />
                </button>

                <button
                  type="button"
                  onClick={handleToggleWatch}
                  title={watched ? 'Mark as Unwatched' : 'Mark as Watched'}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: watched ? 'var(--accent-emerald)' : 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {watched ? <Check size={16} strokeWidth={3} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Bottom Row on Poster: Dynamic Status Indicator */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', gap: '6px' }}>
              <span className={`badge ${dynamicInfo.badgeClass}`} style={{ fontSize: '0.65rem', padding: '3px 7px' }}>
                {dynamicInfo.isReleased ? 'Released' : (dynamicInfo.daysUntil ? `${dynamicInfo.daysUntil}d left` : 'Upcoming')}
              </span>

              {content.timelineName && (
                <span className="badge badge-secondary" style={{ fontSize: '0.62rem', padding: '3px 6px' }}>
                  {content.timelineName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card Metadata info below poster */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'var(--accent-indigo)', fontWeight: 600 }}>{content.universeName || 'Marvel'}</span>
              <span>&bull;</span>
              <span>{content.releaseYear || 'TBA'}</span>
            </div>

            <h4 style={{ 
              fontSize: '1.05rem', 
              fontWeight: 700, 
              color: '#ffffff', 
              lineHeight: 1.3,
              marginBottom: '8px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {content.title}
            </h4>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', marginTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span>
                {content.releaseDate ? formatDisplayDate(content.releaseDate) : (content.runtimeMinutes ? `${content.runtimeMinutes} min` : 'Theatrical')}
              </span>

              {content.rating && (
                <span style={{
                  fontSize: '0.68rem',
                  padding: '2px 6px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '3px',
                  fontWeight: 600
                }}>
                  {content.rating}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
