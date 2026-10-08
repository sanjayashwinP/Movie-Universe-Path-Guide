import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, CheckCircle2, Circle, Clock, Film, Tv, Star, 
  Bookmark, Check, ArrowRight, Compass, Flame, Filter, Search,
  Info, Eye, Layers, Calendar, ChevronRight
} from 'lucide-react';
import { INITIAL_CONTENT, INITIAL_PHASES } from '../services/dataSeed';
import { normalizeContentItem } from '../services/clientDataService';
import { useWatch } from '../contexts/WatchContext';
import { formatDisplayDate } from '../services/dateTracker';
import { getPosterFallback } from '../utils/imageFallback';

export default function BeginnerGuidePage() {
  const { isWatched: checkWatched, toggleWatched, isInWatchlist, toggleWatchlist } = useWatch();

  // Sort strictly by release order number
  const allReleaseContent = useMemo(() => {
    return [...INITIAL_CONTENT]
      .map(normalizeContentItem)
      .sort((a, b) => (a.releaseOrderNum || 999) - (b.releaseOrderNum || 999));
  }, []);

  const [selectedPhase, setSelectedPhase] = useState('ALL');
  const [selectedFormat, setSelectedFormat] = useState('ALL'); // ALL, MOVIE, TV_SERIES
  const [watchFilter, setWatchFilter] = useState('ALL'); // ALL, UNWATCHED, WATCHED
  const [searchQuery, setSearchQuery] = useState('');

  // Watched stats
  const watchedCount = allReleaseContent.filter(c => checkWatched(c.id)).length;
  const totalCount = allReleaseContent.length;
  const progressPercent = Math.round((watchedCount / totalCount) * 100);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return allReleaseContent.filter(item => {
      // Phase filter
      if (selectedPhase === 'LEGACY') {
        if (item.phaseNumber !== null && item.phaseNumber !== undefined) {
          return false;
        }
      } else if (selectedPhase !== 'ALL' && item.phaseNumber !== Number(selectedPhase)) {
        return false;
      }
      // Format filter
      if (selectedFormat === 'MOVIE' && item.contentType !== 'MOVIE') {
        return false;
      }
      if (selectedFormat === 'TV_SERIES' && item.contentType !== 'TV_SERIES' && item.contentType !== 'SPECIAL_PRESENTATION') {
        return false;
      }
      // Watch status filter
      const watched = checkWatched(item.id);
      if (watchFilter === 'WATCHED' && !watched) return false;
      if (watchFilter === 'UNWATCHED' && watched) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesCast = item.castMembers && item.castMembers.toLowerCase().includes(q);
        const matchesIntro = item.keyIntroduction && item.keyIntroduction.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCast && !matchesIntro) return false;
      }

      return true;
    });
  }, [allReleaseContent, selectedPhase, selectedFormat, watchFilter, searchQuery, checkWatched]);

  // Phase summaries for banners
  const phaseDescriptions = {
    1: 'The Foundation — Earth’s Mightiest Heroes are individually introduced, culminating in the historic Battle of New York.',
    2: 'Expansion & Fractures — The aftermath of New York exposes deeper galactic threats and the rise of Ultron.',
    3: 'The Infinity Climax — The Avengers fracture over the Sokovia Accords, leading directly into Thanos’ crusade in Infinity War & Endgame.',
    4: 'The Multiverse Fractures — In the post-Endgame world, grief unbinds magic, timelines branch at the TVA, and the multiverse cracks open.',
    5: 'Secret Alliances & Street Wars — Multiverse incursions escalate, mutant origins surface, and Mayor Fisk initiates New York’s street war.',
    6: 'Battleworld & Incursion Reckoning — Marvel’s First Family arrives, White Vision embarks on VisionQuest, and Doom collides reality into Battleworld.'
  };

  return (
    <div className="beginner-guide-page" style={{ paddingBottom: '90px' }}>
      {/* 1. Hero Header */}
      <section style={{
        position: 'relative',
        padding: '50px 0 36px',
        background: 'radial-gradient(ellipse 90% 60% at 50% -20%, rgba(230, 36, 41, 0.22), transparent 75%), radial-gradient(ellipse 70% 40% at 85% 60%, rgba(99, 102, 241, 0.15), transparent 70%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div className="container">
          <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>
            {/* Pill Tag */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: 'rgba(230, 36, 41, 0.15)',
              border: '1px solid rgba(230, 36, 41, 0.4)',
              borderRadius: 'var(--radius-full)',
              color: '#ff4d4f',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              marginBottom: '16px',
              boxShadow: '0 0 20px rgba(230, 36, 41, 0.2)'
            }}>
              <Sparkles size={15} color="#00f0ff" />
              <span>THE DEFINITIVE NEWCOMER GUIDE</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em'
            }}>
              Marvel Watch Order: First to Latest in Release Order
            </h1>

            <p style={{
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '28px',
              maxWidth: '720px',
              margin: '0 auto 28px'
            }}>
              New to the Marvel Cinematic Universe? This is the <strong style={{ color: '#ffffff' }}>strict theatrical release sequence</strong> starting with <em>Iron Man (2008)</em> all the way to <em>Spider-Man: Brand New Day</em>, <em>VisionQuest</em> (Oct 14, 2026), and <em>Avengers: Doomsday</em>. Experience the interconnected universe exactly as millions of fans did worldwide.
            </p>

            {/* Quick Tips Box */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
              textAlign: 'left',
              marginTop: '20px',
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 20px',
              backdropFilter: 'blur(12px)'
            }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <CheckCircle2 size={18} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <strong style={{ color: '#ffffff', display: 'block' }}>Canonical Release Order</strong>
                  Post-credits scenes and world-building make 100% logical sense in this sequence.
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Flame size={18} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <strong style={{ color: '#ffffff', display: 'block' }}>Never Skip Credits</strong>
                  Nearly every MCU entry features essential mid-credits and post-credits scenes.
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Clock size={18} color="var(--accent-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <strong style={{ color: '#ffffff', display: 'block' }}>Track Your Journey</strong>
                  Click the checkmark on each card to save your watched progress locally.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Progress Tracker & Filters */}
      <section style={{
        position: 'sticky',
        top: '72px',
        zIndex: 30,
        background: 'rgba(7, 8, 15, 0.94)',
        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '14px 0'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            {/* Progress Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '280px', flex: '1 1 300px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                  <span style={{ color: '#ffffff' }}>Your MCU Journey</span>
                  <span style={{ color: progressPercent === 100 ? 'var(--accent-emerald)' : 'var(--accent-blue)' }}>
                    {watchedCount} / {totalCount} Watched ({progressPercent}%)
                  </span>
                </div>
                <div style={{
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${progressPercent}%`,
                    height: '100%',
                    background: progressPercent === 100 
                      ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                      : 'linear-gradient(90deg, #00f0ff 0%, #6366f1 50%, #e62429 100%)',
                    transition: 'width 0.4s ease',
                    boxShadow: '0 0 12px rgba(0, 240, 255, 0.5)'
                  }} />
                </div>
              </div>
            </div>

            {/* Quick Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* Search Input */}
              <div style={{ position: 'relative', minWidth: '180px' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Filter character or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: '6px 12px 6px 30px',
                    fontSize: '0.8rem',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 'var(--radius-md)',
                    color: '#ffffff',
                    outline: 'none',
                    width: '100%'
                  }}
                />
              </div>

              {/* Format Filter */}
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                style={{
                  padding: '6px 10px',
                  fontSize: '0.8rem',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 'var(--radius-md)',
                  color: '#ffffff',
                  outline: 'none'
                }}
              >
                <option value="ALL" style={{ background: '#0e111c' }}>All Formats (Movies & Series)</option>
                <option value="MOVIE" style={{ background: '#0e111c' }}>Theatrical Movies Only</option>
                <option value="TV_SERIES" style={{ background: '#0e111c' }}>Series & Specials</option>
              </select>

              {/* Watch State Filter */}
              <select
                value={watchFilter}
                onChange={(e) => setWatchFilter(e.target.value)}
                style={{
                  padding: '6px 10px',
                  fontSize: '0.8rem',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 'var(--radius-md)',
                  color: '#ffffff',
                  outline: 'none'
                }}
              >
                <option value="ALL" style={{ background: '#0e111c' }}>Show All</option>
                <option value="UNWATCHED" style={{ background: '#0e111c' }}>Unwatched Only</option>
                <option value="WATCHED" style={{ background: '#0e111c' }}>Watched Only</option>
              </select>
            </div>
          </div>

          {/* Phase Filter Tabs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            overflowX: 'auto',
            paddingTop: '12px',
            scrollbarWidth: 'none'
          }}>
            <button
              onClick={() => setSelectedPhase('ALL')}
              style={{
                padding: '5px 12px',
                fontSize: '0.78rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-full)',
                background: selectedPhase === 'ALL' ? 'var(--accent-red)' : 'rgba(255, 255, 255, 0.06)',
                color: '#ffffff',
                border: '1px solid',
                borderColor: selectedPhase === 'ALL' ? 'var(--accent-red)' : 'rgba(255, 255, 255, 0.1)',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: selectedPhase === 'ALL' ? '0 0 12px rgba(230, 36, 41, 0.4)' : 'none'
              }}
            >
              All Phases (1–6)
            </button>

            {[1, 2, 3, 4, 5, 6].map(num => (
              <button
                key={num}
                onClick={() => setSelectedPhase(String(num))}
                style={{
                  padding: '5px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-full)',
                  background: selectedPhase === String(num) ? 'var(--accent-red)' : 'rgba(255, 255, 255, 0.06)',
                  color: '#ffffff',
                  border: '1px solid',
                  borderColor: selectedPhase === String(num) ? 'var(--accent-red)' : 'rgba(255, 255, 255, 0.1)',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedPhase === String(num) ? '0 0 12px rgba(230, 36, 41, 0.4)' : 'none'
                }}
              >
                Phase {num} {num <= 3 ? '(Infinity Saga)' : '(Multiverse Saga)'}
              </button>
            ))}

            <button
              onClick={() => setSelectedPhase('LEGACY')}
              style={{
                padding: '5px 12px',
                fontSize: '0.78rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-full)',
                background: selectedPhase === 'LEGACY' ? 'var(--accent-red)' : 'rgba(255, 255, 255, 0.06)',
                color: '#ffffff',
                border: '1px solid',
                borderColor: selectedPhase === 'LEGACY' ? 'var(--accent-red)' : 'rgba(255, 255, 255, 0.1)',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: selectedPhase === 'LEGACY' ? '0 0 12px rgba(230, 36, 41, 0.4)' : 'none'
              }}
            >
              Multiverse Branches (Raimi, Webb, Fox X-Men)
            </button>
          </div>
        </div>
      </section>

      {/* 3. The Strict Release Order Feed */}
      <section style={{ paddingTop: '36px' }}>
        <div className="container">
          {filteredEntries.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              background: 'rgba(15, 23, 42, 0.4)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <Info size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No matches found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Try relaxing your search query or phase filter.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {filteredEntries.map((item, index) => {
                const watched = checkWatched(item.id);
                const inWatchlist = isInWatchlist(item.id);
                const isPreviousPhaseDifferent = index === 0 || filteredEntries[index - 1].phaseNumber !== item.phaseNumber;

                return (
                  <React.Fragment key={item.id}>
                    {/* Phase Header Banner when phase changes */}
                    {isPreviousPhaseDifferent && (
                      <div style={{
                        marginTop: index > 0 ? '24px' : '0',
                        marginBottom: '8px',
                        padding: '16px 20px',
                        background: 'linear-gradient(90deg, rgba(30, 27, 75, 0.8) 0%, rgba(15, 23, 42, 0.6) 100%)',
                        borderLeft: '4px solid var(--accent-red)',
                        borderRadius: '0 var(--radius-lg) var(--radius-lg) 0',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <span style={{
                            padding: '3px 8px',
                            background: item.phaseNumber <= 3 ? 'var(--accent-red)' : 'var(--accent-indigo)',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            letterSpacing: '0.04em',
                            color: '#ffffff'
                          }}>
                            PHASE {item.phaseNumber}
                          </span>
                          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                            {item.phaseName || `Phase ${item.phaseNumber}`}
                          </h2>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            • {item.sagaName}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                          {phaseDescriptions[item.phaseNumber] || 'Crucial chapter in the overarching cinematic storyline.'}
                        </p>
                      </div>
                    )}

                    {/* Timeline Item Card */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(80px, 100px) 160px 1fr',
                      gap: '24px',
                      background: watched ? 'rgba(16, 185, 129, 0.04)' : 'rgba(15, 23, 42, 0.65)',
                      border: watched ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 'var(--radius-xl)',
                      padding: '20px',
                      position: 'relative',
                      boxShadow: watched ? '0 0 20px rgba(16, 185, 129, 0.08)' : '0 8px 24px rgba(0, 0, 0, 0.3)',
                      transition: 'all 0.25s ease'
                    }}>
                      {/* Left: Giant Sequence Badge */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                        paddingRight: '16px'
                      }}>
                        <div style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          background: watched 
                            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                            : 'linear-gradient(135deg, rgba(230, 36, 41, 0.3) 0%, rgba(99, 102, 241, 0.3) 100%)',
                          border: watched ? '2px solid #10b981' : '2px solid rgba(255, 255, 255, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.25rem',
                          fontWeight: 900,
                          color: '#ffffff',
                          boxShadow: watched ? '0 0 16px rgba(16, 185, 129, 0.4)' : 'none',
                          marginBottom: '8px'
                        }}>
                          #{item.releaseOrderNum || index + 1}
                        </div>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          color: watched ? 'var(--accent-emerald)' : 'var(--text-muted)'
                        }}>
                          {watched ? 'WATCHED' : 'WATCH ORDER'}
                        </span>
                      </div>

                      {/* Middle: Poster */}
                      <div style={{
                        position: 'relative',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        aspectRatio: '2/3',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)'
                      }}>
                        <img
                          src={item.posterUrl || getPosterFallback(item.title)}
                          alt={item.title}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = getPosterFallback(item.title);
                          }}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        {/* Format Badge overlay */}
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          padding: '3px 6px',
                          background: 'rgba(0, 0, 0, 0.75)',
                          backdropFilter: 'blur(8px)',
                          borderRadius: '4px',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {item.contentType === 'TV_SERIES' ? <Tv size={10} /> : <Film size={10} />}
                          <span>{item.contentType === 'TV_SERIES' ? 'SERIES' : 'MOVIE'}</span>
                        </div>
                      </div>

                      {/* Right: Content & Beginner Guide Intel */}
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          {/* Title & Metadata row */}
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                                <span style={{
                                  fontSize: '0.75rem',
                                  color: 'var(--text-muted)',
                                  fontFamily: 'JetBrains Mono, monospace'
                                }}>
                                  {formatDisplayDate(item.releaseDate)}
                                </span>
                                <span style={{ color: 'var(--border-card)' }}>•</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  {item.runtimeMinutes ? `${item.runtimeMinutes} min` : 'Feature'}
                                </span>
                                <span style={{ color: 'var(--border-card)' }}>•</span>
                                <span style={{
                                  fontSize: '0.68rem',
                                  padding: '2px 6px',
                                  background: 'rgba(255, 255, 255, 0.08)',
                                  borderRadius: '4px',
                                  color: '#cbd5e1'
                                }}>
                                  {item.rating || 'PG-13'}
                                </span>
                                {item.status === 'RELEASED' && (
                                  <span className="badge badge-emerald" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                                    Released
                                  </span>
                                )}
                                {item.slug === 'spider-man-brand-new-day' && (
                                  <span className="badge badge-emerald" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                                    🔥 Now In Theaters (Sep 30)
                                  </span>
                                )}
                                {item.slug === 'visionquest' && (
                                  <span className="badge badge-gold" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                                    ⚡ Streaming in 7 Days (Oct 14)
                                  </span>
                                )}
                                {item.slug === 'avengers-doomsday' && (
                                  <span className="badge badge-indigo" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                                    🛡️ Dec 18, 2026 (72d left)
                                  </span>
                                )}
                              </div>

                              <Link to={`/content/${item.id || item.slug}`}>
                                <h3 style={{
                                  fontSize: '1.45rem',
                                  fontWeight: 800,
                                  color: '#ffffff',
                                  lineHeight: 1.25,
                                  margin: 0
                                }}>
                                  {item.title}
                                </h3>
                              </Link>
                            </div>

                            {/* Actions (Watched & Watchlist) */}
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                type="button"
                                onClick={() => toggleWatchlist(item.id, item.title)}
                                title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                                style={{
                                  padding: '8px 12px',
                                  background: inWatchlist ? 'var(--accent-indigo)' : 'rgba(255, 255, 255, 0.08)',
                                  borderRadius: 'var(--radius-md)',
                                  color: '#ffffff',
                                  fontSize: '0.78rem',
                                  fontWeight: 600,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  border: '1px solid rgba(255, 255, 255, 0.1)',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <Bookmark size={14} fill={inWatchlist ? 'currentColor' : 'none'} />
                                <span className="hidden-mobile">{inWatchlist ? 'In Watchlist' : 'Watchlist'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => toggleWatched(item.id, item.title)}
                                title={watched ? 'Mark as Unwatched' : 'Mark as Watched'}
                                style={{
                                  padding: '8px 14px',
                                  background: watched 
                                    ? 'var(--accent-emerald)' 
                                    : 'linear-gradient(135deg, rgba(230, 36, 41, 0.3) 0%, rgba(99, 102, 241, 0.3) 100%)',
                                  border: watched ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.15)',
                                  borderRadius: 'var(--radius-md)',
                                  color: '#ffffff',
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  boxShadow: watched ? '0 0 14px rgba(16, 185, 129, 0.4)' : 'none',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                {watched ? <Check size={15} strokeWidth={3} /> : <Eye size={15} />}
                                <span>{watched ? 'Watched' : 'Mark Watched'}</span>
                              </button>
                            </div>
                          </div>

                          <p style={{
                            fontSize: '0.88rem',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.5,
                            marginBottom: '14px'
                          }}>
                            {item.shortSynopsis}
                          </p>

                          {/* Beginner Intel Grid */}
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '10px',
                            background: 'rgba(0, 0, 0, 0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            borderRadius: 'var(--radius-md)',
                            padding: '12px 14px',
                            marginBottom: '14px'
                          }}>
                            {/* Key Introduction */}
                            <div>
                              <span style={{
                                display: 'block',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                                color: 'var(--accent-blue)',
                                marginBottom: '2px'
                              }}>
                                🌟 Character Introductions:
                              </span>
                              <span style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.4 }}>
                                {item.keyIntroduction || 'Expands the core ensemble and broadens universe lore.'}
                              </span>
                            </div>

                            {/* Post Credit Scene Guidance */}
                            <div>
                              <span style={{
                                display: 'block',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                                color: 'var(--accent-amber)',
                                marginBottom: '2px'
                              }}>
                                🎬 Post-Credits Scene Guide:
                              </span>
                              <span style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.4 }}>
                                {item.postCreditScene || 'Look out for mid-credits and end-credits teases setting up future events.'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Row: Beginner Advice & Link */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                          paddingTop: '12px',
                          gap: '12px',
                          flexWrap: 'wrap'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8' }}>
                              Beginner Tip:
                            </span>
                            <span style={{ fontSize: '0.8rem', color: '#f1f5f9' }}>
                              {item.beginnerNotes || 'Crucial canonical viewing in Phase release order.'}
                            </span>
                          </div>

                          <Link
                            to={`/content/${item.id || item.slug}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              color: 'var(--accent-blue)',
                              transition: 'gap 0.2s ease'
                            }}
                          >
                            <span>Dossier & Relationships</span>
                            <ChevronRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
