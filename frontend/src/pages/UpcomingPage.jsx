import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, Calendar, Flame, Sparkles, Film, ArrowRight, 
  ShieldCheck, CheckCircle2, ChevronRight, Bookmark, Info,
  AlertCircle, Compass, Play
} from 'lucide-react';
import { clientDataService, normalizeContentItem } from '../services/clientDataService';
import { INITIAL_CONTENT } from '../services/dataSeed';
import { formatCurrentDate, formatDisplayDate, calculateLiveCountdown, getTodayIsoString } from '../services/dateTracker';
import { useWatch } from '../contexts/WatchContext';
import { useToast } from '../contexts/ToastContext';
import { getPosterFallback } from '../utils/imageFallback';

export default function UpcomingPage() {
  const [upcoming, setUpcoming] = useState(() => {
    const today = getTodayIsoString();
    return INITIAL_CONTENT.map(normalizeContentItem).filter(c => !c.isReleased && c.releaseDate && c.releaseDate > today);
  });
  const [recentReleases, setRecentReleases] = useState(() => {
    return INITIAL_CONTENT.map(normalizeContentItem).filter(c => c.isReleased).sort((a, b) => (b.releaseDate > a.releaseDate ? 1 : -1));
  });
  const [loading, setLoading] = useState(false);
  const [selectedYearFilter, setSelectedYearFilter] = useState('ALL');
  
  // Imminent Countdown for Avengers: Doomsday (Dec 18, 2026)
  const [countdown, setCountdown] = useState(calculateLiveCountdown('2026-12-18'));
  const { isInWatchlist, toggleWatchlist } = useWatch();
  const { showToast } = useToast();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [slate, recent] = await Promise.all([
          clientDataService.getUpcomingSlate(),
          clientDataService.getRecentReleases()
        ]);
        setUpcoming(slate);
        setRecentReleases(recent);
      } catch (err) {
        console.error('Failed to load upcoming slate:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();

    const interval = setInterval(() => {
      setCountdown(calculateLiveCountdown('2026-12-18'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Filter items by year
  const filteredUpcoming = upcoming.filter(item => {
    if (selectedYearFilter === 'ALL') return true;
    if (selectedYearFilter === '2026') return String(item.releaseYear) === '2026';
    if (selectedYearFilter === '2027') return String(item.releaseYear) === '2027';
    if (selectedYearFilter === '2028') return String(item.releaseYear) === '2028';
    return true;
  });

  // Spotlight Imminent Project (Avengers: Doomsday)
  const doomsdayItem = upcoming.find(item => item.slug === 'avengers-doomsday') || upcoming[0];

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* 1. Header Banner */}
      <div style={{
        background: 'radial-gradient(ellipse 90% 70% at 50% 0%, rgba(99, 102, 241, 0.22), transparent 75%)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '50px 0 40px'
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span className="badge badge-gold" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
              <Flame size={14} /> LIVE RELEASE RADAR
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Updated Today: {formatCurrentDate()}
            </span>
          </div>

          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px' }}>
            Multiverse Release Radar &amp; Slate Tracker
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '780px', lineHeight: 1.6 }}>
            Accurate daily tracking of confirmed Marvel Multiverse releases, verified theatrical dates, and studio production milestones.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '36px' }}>
        {/* 2. Spotlight: Avengers: Doomsday Imminent Countdown */}
        {doomsdayItem && (
          <section style={{
            background: 'linear-gradient(135deg, rgba(16, 24, 39, 0.95) 0%, rgba(30, 27, 75, 0.8) 50%, rgba(13, 17, 28, 0.95) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.45)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            marginBottom: '48px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(245, 158, 11, 0.15)',
            position: 'relative'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px',
              padding: '40px'
            }}>
              {/* Left Column: Details */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <span className="pulse-dot pulse-dot-amber" />
                    <span className="badge badge-gold">NEXT MAJOR THEATRICAL MILESTONE</span>
                    <span className="badge badge-indigo">Phase 6 Climax</span>
                  </div>

                  <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '12px', color: '#ffffff' }}>
                    {doomsdayItem.title}
                  </h2>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={16} /> Releasing December 18, 2026
                    </strong>
                    <span>&bull;</span>
                    <span>Directed by Anthony &amp; Joe Russo</span>
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '24px' }}>
                    {doomsdayItem.fullSynopsis || doomsdayItem.shortSynopsis}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Starring:</span>
                    <span style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 500 }}>
                      {doomsdayItem.castMembers}
                    </span>
                  </div>
                </div>

                {/* Countdown Ticker Box */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                      Time Remaining Until World Premiere
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'JetBrains Mono, monospace' }}>
                          {countdown.days}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Days</div>
                      </div>
                      <div style={{ fontSize: '1.8rem', color: 'var(--text-muted)' }}>:</div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'JetBrains Mono, monospace' }}>
                          {String(countdown.hours).padStart(2, '0')}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Hours</div>
                      </div>
                      <div style={{ fontSize: '1.8rem', color: 'var(--text-muted)' }}>:</div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'JetBrains Mono, monospace' }}>
                          {String(countdown.minutes).padStart(2, '0')}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Minutes</div>
                      </div>
                      <div style={{ fontSize: '1.8rem', color: 'var(--text-muted)' }}>:</div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'JetBrains Mono, monospace' }}>
                          {String(countdown.seconds).padStart(2, '0')}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Seconds</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Link to={`/roadmap?slug=${doomsdayItem.slug}`} className="btn btn-primary" style={{ padding: '12px 20px' }}>
                      <Sparkles size={16} /> Path to Doomsday
                    </Link>
                    <Link to={`/content/${doomsdayItem.id}`} className="btn btn-secondary" style={{ padding: '12px 20px' }}>
                      <span>Canon Dossier</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Backdrop / Poster */}
              <div style={{
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                minHeight: '340px',
                background: '#0a0d16'
              }}>
                <img
                  src={doomsdayItem.backdropUrl || doomsdayItem.posterUrl || getPosterFallback(doomsdayItem.title, 'MOVIE')}
                  alt={doomsdayItem.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getPosterFallback(doomsdayItem.title, 'MOVIE');
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(7, 8, 15, 0) 40%, rgba(7, 8, 15, 0.9) 100%)'
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  right: '20px'
                }}>
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(10px)',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target Continuum</div>
                      <strong style={{ fontSize: '0.9rem', color: '#ffffff' }}>Earth-616 &amp; Battleworld</strong>
                    </div>
                    <span className="badge badge-emerald">Doctor Doom (RDJ)</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 3. Recently Released Highlights (Spider-Man: Brand New Day & Fantastic Four) */}
        <section style={{ marginBottom: '56px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="pulse-dot pulse-dot-emerald" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-emerald)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Recently Premiered &bull; Now Available
                </span>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                Fresh In Theaters &amp; Streaming Canon
              </h2>
            </div>
            <Link to="/explore" className="btn btn-ghost btn-sm">
              <span>View All Catalog</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '24px'
          }}>
            {recentReleases.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="glass-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  border: item.slug === 'spider-man-brand-new-day' ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid var(--border-card)'
                }}
              >
                {/* Backdrop Image */}
                <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                  <img
                    src={item.backdropUrl || item.posterUrl || getPosterFallback(item.title, item.contentType)}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getPosterFallback(item.title, item.contentType);
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    display: 'flex',
                    gap: '6px'
                  }}>
                    <span className="badge badge-emerald">
                      <CheckCircle2 size={12} /> Released
                    </span>
                    {item.slug === 'spider-man-brand-new-day' && (
                      <span className="badge badge-red">In Theaters Now</span>
                    )}
                  </div>

                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    background: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(8px)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#34d399',
                    border: '1px solid rgba(16, 185, 129, 0.4)'
                  }}>
                    {item.releaseDate ? formatDisplayDate(item.releaseDate) : 'Recently Released'}
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-indigo)', fontWeight: 600, marginBottom: '6px' }}>
                      {item.universeName} &bull; {item.phaseName || item.sagaName}
                    </div>

                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '8px' }}>
                      <Link to={`/content/${item.id}`} style={{ color: '#ffffff', textDecoration: 'none' }}>
                        {item.title}
                      </Link>
                    </h3>

                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                      {item.shortSynopsis}
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Status Verified:</span>
                      <strong style={{ color: '#ffffff' }}>
                        {item.slug === 'spider-man-brand-new-day' ? 'Released Sep 30, 2026' : (item.releaseDate || 'Released')}
                      </strong>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <Link to={`/roadmap?slug=${item.slug}`} className="btn btn-secondary btn-sm" style={{ justifyContent: 'center' }}>
                        <Sparkles size={14} /> Roadmap
                      </Link>
                      <Link to={`/content/${item.id}`} className="btn btn-outline btn-sm" style={{ justifyContent: 'center' }}>
                        <span>Dossier</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Complete Upcoming Multiverse Slate */}
        <section>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '28px' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '4px' }}>
                Complete Announced Theatrical Slate (2026 &ndash; 2028+)
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                Official studios calendar tracking release dates, production phases, and saga arcs.
              </p>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {['ALL', '2026', '2027', '2028'].map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => setSelectedYearFilter(year)}
                  className={`btn btn-sm ${selectedYearFilter === year ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: 'var(--radius-full)' }}
                >
                  {year === 'ALL' ? 'All Slates' : `${year} Releases`}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="skeleton" style={{ height: '320px', borderRadius: 'var(--radius-lg)' }} />
              ))}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '24px'
            }}>
              {filteredUpcoming.map((item) => (
                <div
                  key={item.id}
                  className="glass-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                  }}
                >
                  {/* Backdrop */}
                  <div style={{ position: 'relative', height: '170px', overflow: 'hidden' }}>
                    <img
                      src={item.backdropUrl || item.posterUrl || getPosterFallback(item.title, item.contentType)}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getPosterFallback(item.title, item.contentType);
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      display: 'flex',
                      gap: '6px'
                    }}>
                      <span className={`badge ${item.badgeClass || 'badge-gold'}`}>
                        {item.statusLabel || item.status}
                      </span>
                    </div>

                    {item.daysUntil !== null && (
                      <div style={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '12px',
                        background: 'rgba(0, 0, 0, 0.85)',
                        backdropFilter: 'blur(8px)',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--accent-amber)',
                        border: '1px solid rgba(245, 158, 11, 0.4)'
                      }}>
                        ⚡ {item.daysUntil} days left
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                        <span style={{ color: 'var(--accent-indigo)', fontWeight: 600 }}>{item.universeName}</span>
                        <span> &bull; </span>
                        <span>{item.phaseName || item.sagaName || 'Phase 6'}</span>
                      </div>

                      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '2px 0 8px' }}>
                        <Link to={`/content/${item.id}`} style={{ color: '#ffffff', textDecoration: 'none' }}>
                          {item.title}
                        </Link>
                      </h3>

                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                        {item.shortSynopsis || 'Details confirmed via official Marvel Studio slates.'}
                      </p>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', marginBottom: '10px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Confirmed Date:</span>
                        <strong style={{ color: '#ffffff' }}>
                          {item.releaseDate ? formatDisplayDate(item.releaseDate) : (item.releaseYear || 'TBA')}
                        </strong>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', marginBottom: '16px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Studio Studio:</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{item.productionStudio || 'Marvel Studios'}</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <Link to={`/roadmap?slug=${item.slug}`} className="btn btn-primary btn-sm" style={{ justifyContent: 'center' }}>
                          <Sparkles size={14} /> Roadmap
                        </Link>
                        <Link to={`/content/${item.id}`} className="btn btn-outline btn-sm" style={{ justifyContent: 'center' }}>
                          <span>Dossier</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
