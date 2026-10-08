import React, { useState } from 'react';
import { Check, CheckCircle2, Circle, Clock, Play } from 'lucide-react';
import { useWatch } from '../../contexts/WatchContext';

export default function EpisodeTracker({ seasons = [], contentTitle = 'Series' }) {
  const [activeSeasonIndex, setActiveSeasonIndex] = useState(0);
  const { toggleEpisode } = useWatch();

  if (!seasons || seasons.length === 0) return null;

  const currentSeason = seasons[activeSeasonIndex] || seasons[0];
  const episodes = currentSeason.episodes || [];

  const watchedCount = episodes.filter((ep) => ep.isWatched).length;
  const totalCount = episodes.length;
  const progressPct = totalCount > 0 ? Math.round((watchedCount / totalCount) * 100) : 0;

  // Next unwatched episode
  const nextUnwatched = episodes.find((ep) => !ep.isWatched);

  return (
    <div className="glass-panel" style={{ padding: '24px', margin: '32px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Episode Tracker</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Track progress season by season for {contentTitle}
          </p>
        </div>

        {/* Season tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {seasons.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setActiveSeasonIndex(idx)}
              className={`btn btn-sm ${activeSeasonIndex === idx ? 'btn-primary' : 'btn-secondary'}`}
            >
              Season {s.seasonNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Season Progress Bar */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>
          <span>Season {currentSeason.seasonNumber} Progress</span>
          <span style={{ fontWeight: 700, color: '#ffffff' }}>
            {watchedCount} / {totalCount} Episodes ({progressPct}%)
          </span>
        </div>
        <div className="progress-track">
          <div className="progress-fill emerald" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* Next Up Banner */}
      {nextUnwatched && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Play size={16} color="#818cf8" />
            <span style={{ fontSize: '0.875rem' }}>
              <strong>Next Up:</strong> Ep {nextUnwatched.episodeNumber} - {nextUnwatched.title}
            </span>
          </div>
          <button
            onClick={() => toggleEpisode(nextUnwatched.id)}
            className="btn btn-sm btn-secondary"
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
          >
            Mark Watched
          </button>
        </div>
      )}

      {/* Episode List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {episodes.map((ep) => (
          <div
            key={ep.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: ep.isWatched ? 'rgba(16, 185, 129, 0.05)' : 'rgba(0, 0, 0, 0.25)',
              border: ep.isWatched ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              transition: 'background 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
              <button
                type="button"
                onClick={() => toggleEpisode(ep.id)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: ep.isWatched ? 'var(--accent-emerald)' : 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: ep.isWatched ? '#07080c' : 'var(--text-muted)',
                  border: ep.isWatched ? 'none' : '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                {ep.isWatched ? <Check size={16} strokeWidth={3} /> : <Circle size={14} />}
              </button>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                    #{ep.episodeNumber}
                  </span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600, color: ep.isWatched ? 'var(--text-secondary)' : '#ffffff' }}>
                    {ep.title}
                  </span>
                </div>
                {ep.synopsis && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px', lineClamp: 1, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {ep.synopsis}
                  </p>
                )}
              </div>
            </div>

            {ep.runtimeMinutes && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '12px' }}>
                <Clock size={12} />
                {ep.runtimeMinutes}m
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
