import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, Search, Film, Check, Eye, Clock, Calendar, 
  Sparkles, GitBranch, ArrowRight, ShieldCheck, Flame, Zap, Shield, AlertCircle
} from 'lucide-react';
import { contentApi } from '../../services/api';
import { clientDataService, normalizeContentItem } from '../../services/clientDataService';
import { getPosterFallback } from '../../utils/imageFallback';
import { useWatch } from '../../contexts/WatchContext';
import { useToast } from '../../contexts/ToastContext';

export default function MovieRoadmapFinder({ initialSlug = 'spider-man-brand-new-day' }) {
  const [selectedSlug, setSelectedSlug] = useState(initialSlug);
  const [allMovies, setAllMovies] = useState([]);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  const { isWatched, toggleWatch, watchedIds } = useWatch();
  const toast = useToast();

  // Popular quick options with latest daily tracking
  const quickPicks = [
    { label: 'Spider-Man: Brand New Day (Sep 30, 2026)', slug: 'spider-man-brand-new-day', icon: '🕷️' },
    { label: 'Avengers: Doomsday (Dec 18, 2026)', slug: 'avengers-doomsday', icon: '🛡️' },
    { label: 'The Fantastic Four: First Steps', slug: 'the-fantastic-four-first-steps', icon: '4️⃣' },
    { label: 'Captain America: Brave New World', slug: 'captain-america-brave-new-world', icon: '🦅' },
    { label: 'Dark Phoenix (Fox Prequel Climax)', slug: 'dark-phoenix-2019', icon: '🔥' },
    { label: 'Deadpool & Wolverine (Fox/MCU Bridge)', slug: 'deadpool-and-wolverine', icon: '⚔️' },
    { label: 'Guardians of the Galaxy Vol. 3', slug: 'guardians-of-the-galaxy-vol-3', icon: '🦝' },
    { label: 'Avengers: Secret Wars (Dec 17, 2027)', slug: 'avengers-secret-wars', icon: '⚡' },
    { label: 'Ghost Rider (Feb 18, 2028)', slug: 'ghost-rider-2028', icon: '💀' },
    { label: 'X-Men: Mutant Genesis (May 5, 2028)', slug: 'x-men-2028', icon: '🧬' },
    { label: 'Black Panther 3 (Dec 22, 2028)', slug: 'black-panther-3', icon: '🐾' }
  ];

  // Load all available content for the selector
  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await contentApi.getAll({ size: 100 });
        const list = res.data?.data?.content || [];
        if (list.length > 0) {
          setAllMovies(list.map(normalizeContentItem));
        } else {
          setAllMovies(await clientDataService.getAllContent());
        }
      } catch (err) {
        setAllMovies(await clientDataService.getAllContent());
      }
    }
    fetchMovies();
  }, []);

  // Fetch roadmap whenever selectedSlug changes
  useEffect(() => {
    async function fetchRoadmap() {
      if (!selectedSlug) return;
      setLoading(true);
      try {
        const data = await clientDataService.getRoadmap(selectedSlug);
        setRoadmap(data || null);
      } catch (err) {
        console.error('Failed to load roadmap:', err);
        toast.showError('Could not load roadmap for the selected project');
      } finally {
        setLoading(false);
      }
    }
    fetchRoadmap();
  }, [selectedSlug]);

  const filteredMovies = allMovies.filter(m => 
    !searchFilter.trim() || 
    m.title.toLowerCase().includes(searchFilter.toLowerCase().trim()) ||
    (m.universeName && m.universeName.toLowerCase().includes(searchFilter.toLowerCase().trim())) ||
    (m.universeDesignation && m.universeDesignation.toLowerCase().includes(searchFilter.toLowerCase().trim()))
  );

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'CRITICAL_MUST_WATCH':
        return 'priority-pill critical';
      case 'ESSENTIAL_LORE':
        return 'priority-pill essential';
      case 'MULTIVERSE_BRIDGE':
        return 'priority-pill multiverse';
      case 'CORE_ORIGIN':
        return 'priority-pill origin';
      default:
        return 'priority-pill essential';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'CRITICAL_MUST_WATCH':
        return 'Critical Must-Watch';
      case 'ESSENTIAL_LORE':
        return 'Essential Lore';
      case 'MULTIVERSE_BRIDGE':
        return 'Multiverse Nexus Bridge';
      case 'CORE_ORIGIN':
        return 'Scratch Origin #1';
      case 'TARGET_DESTINATION':
        return 'Target Destination Movie';
      default:
        return 'Prerequisite Step';
    }
  };

  const getUniverseClass = (desig = '', name = '') => {
    const combined = (desig + ' ' + name).toLowerCase();
    if (combined.includes('96283') || combined.includes('tobey')) return 'universe-pill earth-96283';
    if (combined.includes('120703') || combined.includes('andrew')) return 'universe-pill earth-120703';
    if (combined.includes('10005') || combined.includes('x-men') || combined.includes('mutant')) return 'universe-pill earth-10005';
    if (combined.includes('616') || combined.includes('sacred') || combined.includes('marvel cinematic')) return 'universe-pill earth-616';
    return 'universe-pill';
  };

  return (
    <div className="roadmap-finder-container">
      {/* Header Selector Card */}
      <div className="roadmap-selector-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Compass size={24} color="var(--accent-red)" />
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
            Path to Any Movie: Watch Journey From Scratch
          </h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0 0 20px', maxWidth: '800px' }}>
          Select or search any movie. Our algorithm generates the exact step-by-step roadmap starting from scratch (#1 origin) up to that destination, including release dates, timeline coordinates, multiverse branches, and why each chapter is essential to understand.
        </p>

        {/* Live Search & Selector Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', alignItems: 'start' }}>
          <div>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>
              Choose Destination Film or Series {searchFilter ? `(${filteredMovies.length} matching)` : `(${allMovies.length} titles)`}
            </label>
            <select
              className="form-select"
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              style={{ fontSize: '0.95rem', padding: '12px 16px' }}
            >
              {(filteredMovies.length > 0 ? filteredMovies : allMovies).map(m => (
                <option key={m.id} value={m.slug}>
                  {m.title} ({m.releaseYear || 'TBA'}) — {m.universeName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Live Search Filter</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search by title, universe (e.g. Phoenix, Doomsday, Wolverine)..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                style={{ paddingLeft: '38px', paddingRight: searchFilter ? '36px' : '14px' }}
              />
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              {searchFilter && (
                <button
                  type="button"
                  onClick={() => setSearchFilter('')}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}
                >
                  &times;
                </button>
              )}
            </div>

            {/* Live Search Dropdown Suggestions */}
            {searchFilter.trim() && filteredMovies.length > 0 && (
              <div style={{
                marginTop: '8px',
                background: '#0d111d',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 'var(--radius-md)',
                maxHeight: '220px',
                overflowY: 'auto',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                padding: '6px'
              }}>
                {filteredMovies.slice(0, 8).map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setSelectedSlug(m.slug);
                      setSearchFilter('');
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 10px',
                      background: selectedSlug === m.slug ? 'rgba(230, 36, 41, 0.2)' : 'transparent',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      color: '#ffffff',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = selectedSlug === m.slug ? 'rgba(230, 36, 41, 0.2)' : 'transparent'}
                  >
                    <img
                      src={m.posterUrl || getPosterFallback(m.title)}
                      alt={m.title}
                      style={{ width: '28px', height: '40px', objectFit: 'cover', borderRadius: '3px', flexShrink: 0 }}
                      onError={(e) => { e.currentTarget.src = getPosterFallback(m.title); }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {m.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {m.releaseYear || 'TBA'} • {m.universeName}
                      </div>
                    </div>
                    {selectedSlug === m.slug && <Check size={14} color="#34d399" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Picks Chips */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '8px' }}>
            Recommended Direct Roadmaps:
          </div>
          <div className="roadmap-quick-chips">
            {quickPicks.map(p => (
              <button
                key={p.slug}
                type="button"
                className={`quick-chip-btn ${selectedSlug === p.slug ? 'active' : ''}`}
                onClick={() => setSelectedSlug(p.slug)}
              >
                <span>{p.icon}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="glass-panel" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ color: '#ffffff', fontSize: '1.2rem' }}>Calculating Chronological Multiverse Path...</h3>
          <p style={{ color: 'var(--text-muted)' }}>Traversing ancestral lore nodes, multiverse bridges, and release dates.</p>
        </div>
      ) : roadmap && roadmap.targetMovie ? (
        <div>
          {/* Target Movie Hero Banner */}
          <div className="roadmap-hero-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1 }}>
              <img 
                src={roadmap.targetMovie.posterUrl || getPosterFallback(roadmap.targetMovie.title)} 
                alt={roadmap.targetMovie.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getPosterFallback(roadmap.targetMovie.title);
                }}
                style={{ width: '90px', height: '135px', borderRadius: 'var(--radius-md)', objectFit: 'cover', boxShadow: '0 8px 24px rgba(0,0,0,0.7)', border: '1px solid var(--border-subtle)' }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span className="badge badge-accent">Destination Movie</span>
                  <span className={getUniverseClass(roadmap.targetMovie.universeDesignation, roadmap.targetMovie.universeName)}>
                    {roadmap.targetMovie.universeDesignation || roadmap.targetMovie.universeName}
                  </span>
                  <span className="badge badge-outline">{roadmap.targetMovie.releaseYear || 'Upcoming'}</span>
                </div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 8px', color: '#ffffff' }}>
                  {roadmap.targetMovie.title}
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, maxWidth: '640px' }}>
                  {roadmap.narrativeSummary}
                </p>
              </div>
            </div>

            {/* Stats Summary */}
            <div style={{ textAlign: 'right', minWidth: '220px', background: 'rgba(0,0,0,0.3)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                PREREQUISITES FROM SCRATCH
              </div>
              <div style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--accent-blue)', marginBottom: '4px' }}>
                {roadmap.totalSteps} Chapters
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                Total Watch Time: <strong>{Math.floor(roadmap.totalWatchTimeMinutes / 60)}h {roadmap.totalWatchTimeMinutes % 60}m</strong>
              </div>

              {/* Progress */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                <span>Your Watch Progress</span>
                <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>{roadmap.completionPercentage}%</span>
              </div>
              <div className="progress-track" style={{ height: '7px' }}>
                <div className="progress-fill emerald" style={{ width: `${roadmap.completionPercentage}%` }} />
              </div>
            </div>
          </div>

          {/* Sequential Steps List */}
          <div style={{ position: 'relative' }}>
            {roadmap.steps.map((step, idx) => {
              const isTargetStep = step.priority === 'TARGET_DESTINATION' || idx === roadmap.steps.length - 1;
              const stepWatched = (isWatched && isWatched(step.contentId)) || watchedIds?.has(Number(step.contentId)) || step.isWatched;

              return (
                <div key={step.contentId || idx} className="roadmap-step-row">
                  {/* Left Step Badge & Spine */}
                  <div className="roadmap-step-badge-col">
                    <div 
                      className={`roadmap-step-number-circle ${isTargetStep ? 'destination' : ''} ${stepWatched ? 'watched' : ''}`}
                      onClick={() => toggleWatch(step.contentId, step.title)}
                      style={{ cursor: 'pointer' }}
                      title={stepWatched ? 'Mark unwatched' : 'Mark watched'}
                    >
                      {stepWatched ? <Check size={18} strokeWidth={3} /> : step.stepNumber}
                    </div>
                    {idx < roadmap.steps.length - 1 && (
                      <div className="roadmap-step-connector" />
                    )}
                  </div>

                  {/* Right Step Card */}
                  <div className={`roadmap-step-card ${isTargetStep ? 'destination-card' : ''}`}>
                    <div style={{ display: 'flex', gap: '20px' }}>
                      <Link to={`/content/${step.slug || step.contentId}`}>
                        <img 
                          src={(!step.posterUrl || step.posterUrl.includes('unsplash.com')) ? getPosterFallback(step.title) : step.posterUrl} 
                          alt={step.title}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = getPosterFallback(step.title);
                          }}
                          style={{ width: '84px', height: '126px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0, boxShadow: '0 4px 14px rgba(0,0,0,0.6)' }}
                        />
                      </Link>

                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          {/* Tags row */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                            <span className={getPriorityClass(step.priority)}>
                              {getPriorityLabel(step.priority)}
                            </span>
                            <span className={getUniverseClass(step.universeDesignation, step.universeName)}>
                              {step.universeDesignation || step.universeName}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              {step.timelineName}
                            </span>
                          </div>

                          {/* Title & Release */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                            <Link 
                              to={`/content/${step.slug || step.contentId}`}
                              style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', textDecoration: 'none' }}
                            >
                              {step.title}
                            </Link>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <Calendar size={14} />
                                {step.releaseDate || `${step.releaseYear} (TBA)`}
                              </span>
                              {step.runtimeMinutes && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <Clock size={14} />
                                  {step.runtimeMinutes} min
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Lore Reason Callout Box */}
                          <div className="lore-callout-box">
                            <strong style={{ color: 'var(--accent-gold)', display: 'block', marginBottom: '2px' }}>
                              ⚡ Why this chapter is necessary to watch:
                            </strong>
                            {step.reason}
                          </div>
                        </div>

                        {/* Footer row */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            Key Lore Characters: <span style={{ color: 'var(--text-secondary)' }}>{step.keyCharacters || 'Ensemble cast'}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <button
                              type="button"
                              className={`btn btn-sm ${stepWatched ? 'btn-ghost' : 'btn-primary'}`}
                              onClick={() => toggleWatch(step.contentId, step.title)}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '6px 14px' }}
                            >
                              <Check size={14} />
                              {stepWatched ? 'Watched' : 'Mark Watched'}
                            </button>
                            <Link 
                              to={`/content/${step.slug || step.contentId}`} 
                              className="btn btn-ghost btn-sm"
                              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                            >
                              Details <ArrowRight size={14} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <AlertCircle size={40} color="var(--accent-gold)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ color: '#ffffff', fontSize: '1.2rem', marginBottom: '8px' }}>No Roadmap Found</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto' }}>
            Please select another film or choose one from the quick picks above.
          </p>
        </div>
      )}
    </div>
  );
}
