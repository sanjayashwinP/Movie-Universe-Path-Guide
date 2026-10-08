import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Check, Eye, Calendar, Clock, GitBranch, Sparkles, 
  Film, Tv, ArrowRight, ShieldAlert, Star 
} from 'lucide-react';
import { useWatch } from '../../contexts/WatchContext';
import { getPosterFallback } from '../../utils/imageFallback';

export default function TimelineChart({ items = [], orderType = 'chronological' }) {
  const { watchedIds, isWatched: checkWatched, toggleWatch } = useWatch();

  if (!items || items.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', margin: '30px 0' }}>
        <GitBranch size={48} color="#64748b" style={{ margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', color: '#ffffff' }}>No Timeline Nodes Found</h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto', fontSize: '0.95rem' }}>
          Try clearing filters or switching universes to view the canonical timeline.
        </p>
      </div>
    );
  }

  // Calculate completion
  const totalCount = items.length;
  const watchedCount = items.filter(item => 
    (checkWatched && checkWatched(item.id)) || watchedIds?.has(Number(item.id)) || item.isWatched
  ).length;
  const completionPercentage = totalCount > 0 ? Math.round((watchedCount / totalCount) * 100) : 0;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'TV_SERIES':
      case 'SERIES':
      case 'LIMITED_SERIES':
      case 'ANIMATED_SERIES':
        return <Tv size={12} />;
      case 'SPECIAL_PRESENTATION':
      case 'ONE_SHOT':
        return <Sparkles size={12} />;
      default:
        return <Film size={12} />;
    }
  };

  return (
    <div className="timeline-chart-container">
      {/* Timeline Chart Header & Progress Bar */}
      <div className="timeline-summary-banner">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-accent">Interactive Canon Flow</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Sorted by {orderType === 'release' ? 'Theatrical Release Date' : 'In-Universe Story Chronology'}
              </span>
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
              Timeline Flowchart: {totalCount} Connected Chapters
            </h3>
          </div>

          <div style={{ textAlign: 'right', minWidth: '180px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Progress: <strong style={{ color: 'var(--accent-emerald)', fontSize: '1rem' }}>{watchedCount}</strong> / {totalCount} Completed ({completionPercentage}%)
            </div>
            <div className="progress-track" style={{ height: '8px' }}>
              <div 
                className="progress-fill emerald" 
                style={{ width: `${completionPercentage}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Vertical Timeline Spine */}
      <div className="timeline-spine-track">
        {items.map((item, index) => {
          const isItemWatched = (checkWatched && checkWatched(item.id)) || watchedIds?.has(Number(item.id)) || item.isWatched;
          const chronoNumber = item.chronologicalOrder || item.chronologicalOrderNum || (index + 1);
          const releaseNumber = item.releaseOrder || item.releaseOrderNum || (index + 1);
          const orderNumberToDisplay = orderType === 'release' ? `Rel #${releaseNumber}` : `Chrono #${chronoNumber}`;
          const isBranchTimeline = item.timelineName && !item.timelineName.toLowerCase().includes('sacred') && !item.timelineName.toLowerCase().includes('prime') && !item.timelineName.toLowerCase().includes('galactic');

          return (
            <div 
              key={item.id} 
              className={`timeline-chart-row ${isItemWatched ? 'watched-step' : ''} ${isBranchTimeline ? 'branch-step' : ''}`}
            >
              {/* Connector Pin with glowing order badge */}
              <div className="timeline-chart-pin-col">
                <div 
                  className={`timeline-chart-pin ${isItemWatched ? 'watched' : ''}`}
                  onClick={() => toggleWatch(item.id, item.title)}
                  title={isItemWatched ? 'Mark unwatched' : 'Mark watched'}
                >
                  {isItemWatched ? <Check size={16} strokeWidth={3} /> : chronoNumber}
                </div>
                <div className="timeline-connector-line" />
              </div>

              {/* Timeline Chart Content Card */}
              <div className="timeline-chart-card">
                {/* Poster Thumbnail with glow */}
                <Link to={`/content/${item.slug || item.id}`} className="timeline-card-poster">
                  <img
                    src={item.posterUrl || getPosterFallback(item.title, item.contentType)}
                    alt={item.title}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getPosterFallback(item.title, item.contentType);
                    }}
                  />
                  {isItemWatched && (
                    <div className="timeline-poster-watched-overlay">
                      <Check size={20} color="#10b981" strokeWidth={3} />
                    </div>
                  )}
                </Link>

                {/* Main Information */}
                <div className="timeline-card-body">
                  {/* Top Badge Strip */}
                  <div className="timeline-card-header-strip">
                    <span className="timeline-order-pill">
                      {orderNumberToDisplay}
                    </span>

                    <span className="badge badge-accent" style={{ fontSize: '0.72rem' }}>
                      {getTypeIcon(item.contentType)}
                      <span>{item.contentType?.replace(/_/g, ' ')}</span>
                    </span>

                    <span className="timeline-year-tag">
                      <Calendar size={12} />
                      <span>{item.releaseYear || item.releaseDate?.substring(0, 4) || 'TBA'}</span>
                    </span>

                    {item.runtimeMinutes && (
                      <span className="timeline-runtime-tag">
                        <Clock size={12} />
                        <span>{item.runtimeMinutes} min</span>
                      </span>
                    )}

                    {isBranchTimeline && (
                      <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                        ⚡ {item.timelineName}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h4 className="timeline-card-title">
                    <Link to={`/content/${item.slug || item.id}`}>
                      {item.title}
                    </Link>
                  </h4>

                  {/* Hierarchy & Sagas */}
                  <div className="timeline-card-meta-line">
                    {item.universeName && (
                      <span className="timeline-meta-chip universe">
                        {item.universeName}
                      </span>
                    )}
                    {item.sagaName && (
                      <span className="timeline-meta-chip saga">
                        {item.sagaName}
                      </span>
                    )}
                    {item.phaseName && (
                      <span className="timeline-meta-chip phase">
                        {item.phaseName}
                      </span>
                    )}
                  </div>

                  {/* Story placement summary */}
                  <p className="timeline-card-synopsis">
                    {item.shortSynopsis || item.description || 'Explore this pivotal chapter in the interconnected cinematic timeline.'}
                  </p>

                  {/* Bottom Action Controls */}
                  <div className="timeline-card-footer">
                    <button
                      type="button"
                      className={`btn btn-sm ${isItemWatched ? 'btn-secondary' : 'btn-outline'}`}
                      onClick={() => toggleWatch(item.id, item.title)}
                      style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Check size={14} color={isItemWatched ? 'var(--accent-emerald)' : 'currentColor'} />
                      <span>{isItemWatched ? 'Watched' : 'Mark as Watched'}</span>
                    </button>

                    <Link 
                      to={`/content/${item.slug || item.id}`} 
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}
                    >
                      <span>Where Does This Fit?</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
