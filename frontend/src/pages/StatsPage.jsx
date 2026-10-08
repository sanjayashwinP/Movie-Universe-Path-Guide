import React, { useState, useEffect } from 'react';
import { BarChart3, Film, Tv, Clock, CheckCircle, Sparkles, Trophy } from 'lucide-react';
import { userTrackingApi, contentApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useWatch } from '../contexts/WatchContext';

export default function StatsPage() {
  const { user } = useAuth();
  const { watchedIds } = useWatch();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await userTrackingApi.getProgress();
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to load user progress stats:', err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [user, watchedIds]);

  if (!user) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <BarChart3 size={48} color="var(--accent-red)" style={{ marginBottom: '16px' }} />
        <h2>Sign in to view your cinematic viewing analytics</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Track total hours streamed, episodes watched, and universe completion percentages.
        </p>
      </div>
    );
  }

  // Derive watch time formatting
  const totalHours = stats ? Math.round(stats.totalWatchMinutes / 60) : 0;
  const days = Math.floor(totalHours / 24);
  const remainingHours = totalHours % 24;

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      {/* Title */}
      <div className="section-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '2rem' }}>
            <BarChart3 size={26} color="var(--accent-red)" />
            Viewing Analytics &amp; Canon Progress
          </h1>
          <p className="section-subtitle">
            Comprehensive audit of your journey across the connected multiverse.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="skeleton" style={{ height: '120px', borderRadius: 'var(--radius-md)' }} />
          ))}
        </div>
      ) : stats ? (
        <div>
          {/* Top Metric Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginBottom: '36px'
          }}>
            {/* Total Watched */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Projects Completed
                </span>
                <CheckCircle size={20} color="var(--accent-emerald)" />
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff' }}>
                {stats.totalWatched}
                <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}> / {stats.totalContent}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', marginTop: '4px', fontWeight: 600 }}>
                {stats.completionPercentage}% Overall Completion
              </div>
            </div>

            {/* Total Watch Time */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Time Invested
                </span>
                <Clock size={20} color="var(--accent-indigo)" />
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff' }}>
                {totalHours}
                <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}> hrs</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Equivalent to {days} days, {remainingHours} hrs
              </div>
            </div>

            {/* Movies Watched */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Theatrical Movies
                </span>
                <Film size={20} color="var(--accent-red)" />
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff' }}>
                {stats.moviesWatched}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Feature films tracked
              </div>
            </div>

            {/* Episodes Watched */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Series Episodes
                </span>
                <Tv size={20} color="var(--accent-amber)" />
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff' }}>
                {stats.episodesWatched}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Across {stats.seriesWatched} series &amp; specials
              </div>
            </div>
          </div>

          {/* Sagas & Major Eras Completion Section */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-card)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px',
            marginBottom: '36px'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trophy size={20} color="var(--accent-amber)" />
              Era &amp; Saga Milestones
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Overall MCU */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: 600 }}>Marvel Cinematic Universe Overall</span>
                  <strong style={{ color: 'var(--accent-emerald)' }}>{stats.completionPercentage}%</strong>
                </div>
                <div className="progress-track">
                  <div className="progress-fill emerald" style={{ width: `${stats.completionPercentage}%` }} />
                </div>
              </div>

              {/* Infinity Saga */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: 600 }}>The Infinity Saga (Phases 1 — 3)</span>
                  <strong style={{ color: 'var(--accent-red)' }}>Phase 1-3 Core</strong>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: '80%' }} />
                </div>
              </div>

              {/* Multiverse Saga */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: 600 }}>The Multiverse Saga (Phases 4 — 6)</span>
                  <strong style={{ color: 'var(--accent-indigo)' }}>Phase 4-6 Slate</strong>
                </div>
                <div className="progress-track">
                  <div className="progress-fill cosmic" style={{ width: '45%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
