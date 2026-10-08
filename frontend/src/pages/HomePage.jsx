import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Play, Check, Info, Sparkles, Clock, Compass, 
  GitBranch, ListOrdered, ChevronRight, Bookmark, ArrowRight, 
  Flame, CheckCircle2, ShieldCheck, Film, Layers, Calendar
} from 'lucide-react';
import { clientDataService, normalizeContentItem } from '../services/clientDataService';
import { INITIAL_CONTENT } from '../services/dataSeed';
import { formatCurrentDate, formatDisplayDate, getTodayIsoString } from '../services/dateTracker';
import { useWatch } from '../contexts/WatchContext';
import { useAuth } from '../contexts/AuthContext';
import ContentCard from '../components/content/ContentCard';

export default function HomePage() {
  const [allContent, setAllContent] = useState(() => INITIAL_CONTENT.map(normalizeContentItem));
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [upcomingSlate, setUpcomingSlate] = useState(() => {
    const today = getTodayIsoString();
    return INITIAL_CONTENT.map(normalizeContentItem).filter(c => !c.isReleased && c.releaseDate && c.releaseDate > today);
  });
  const [recentReleases, setRecentReleases] = useState(() => {
    return INITIAL_CONTENT.map(normalizeContentItem).filter(c => c.isReleased).sort((a, b) => (b.releaseDate > a.releaseDate ? 1 : -1));
  });
  const [activeTab, setActiveTab] = useState('RECENT');
  const [loading, setLoading] = useState(false);

  const { isWatched, toggleWatched, isInWatchlist, toggleWatchlist } = useWatch();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [content, upcoming, recent] = await Promise.all([
          clientDataService.getAllContent(),
          clientDataService.getUpcomingSlate(),
          clientDataService.getRecentReleases()
        ]);
        setAllContent(content);
        setUpcomingSlate(upcoming);
        setRecentReleases(recent);
      } catch (err) {
        console.error('Failed to load homepage content:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  // Curate Spotlight Hero candidates
  const spotlightCandidates = [
    // 1. Spider-Man: Brand New Day (Released Sep 30, 2026)
    allContent.find(c => c.slug === 'spider-man-brand-new-day'),
    // 2. VisionQuest (Disney+ premiere in 7 days - Oct 14, 2026)
    allContent.find(c => c.slug === 'visionquest'),
    // 3. Avengers: Doomsday (Releasing Dec 18, 2026)
    upcomingSlate.find(c => c.slug === 'avengers-doomsday') || allContent.find(c => c.slug === 'avengers-doomsday'),
    // 4. The Fantastic Four: First Steps (Released July 25, 2025)
    allContent.find(c => c.slug === 'the-fantastic-four-first-steps'),
    // 5. Daredevil: Born Again (Seasons 1 & 2 Released)
    allContent.find(c => c.slug === 'daredevil-born-again-season-2') || allContent.find(c => c.slug === 'daredevil-born-again-season-1')
  ].filter(Boolean);

  const featured = spotlightCandidates[featuredIndex] || spotlightCandidates[0] || allContent[0];
  const featuredWatched = featured ? isWatched(featured.id) : false;

  // Curate filtered content for active tab
  let displayCards = [];
  if (activeTab === 'RECENT') {
    displayCards = recentReleases.slice(0, 8);
  } else if (activeTab === 'UPCOMING') {
    displayCards = upcomingSlate.slice(0, 8);
  } else if (activeTab === 'SPIDER_VERSE') {
    displayCards = allContent.filter(c => c.title.toLowerCase().includes('spider-man') || c.universeId === 2 || c.universeId === 3);
  } else if (activeTab === 'AVENGERS') {
    displayCards = allContent.filter(c => c.title.toLowerCase().includes('avengers') || c.title.includes('Civil War'));
  } else {
    displayCards = allContent.slice(0, 8);
  }

  return (
    <div className="home-page" style={{ paddingBottom: '80px' }}>
      {/* 1. Ultra-Premium Cinematic Hero Section */}
      {featured && (
        <section className="hero-section" style={{
          position: 'relative',
          minHeight: '620px',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '60px 0 50px',
          overflow: 'hidden',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          {/* Backdrop Image */}
          <div 
            style={{ 
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${featured.backdropUrl || featured.posterUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              zIndex: 1,
              filter: 'brightness(0.6) saturate(1.15)',
              transform: 'scale(1.03)',
              transition: 'transform 8s ease-out, background-image 0.5s ease'
            }} 
          />

          {/* Gradient Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            background: 'linear-gradient(180deg, rgba(7, 8, 15, 0.25) 0%, rgba(7, 8, 15, 0.75) 55%, #07080f 100%)'
          }} />

          {/* Ambient Glow */}
          <div style={{
            position: 'absolute',
            bottom: '20%',
            left: '10%',
            width: '450px',
            height: '450px',
            background: featured.slug === 'avengers-doomsday' 
              ? 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(230, 36, 41, 0.25) 0%, transparent 70%)',
            zIndex: 3,
            filter: 'blur(50px)',
            pointerEvents: 'none'
          }} />

          <div className="container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
            {/* Spotlight Selector Tabs */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {spotlightCandidates.map((cand, idx) => (
                <button
                  key={cand.id}
                  type="button"
                  onClick={() => setFeaturedIndex(idx)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: featuredIndex === idx ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(8px)',
                    color: featuredIndex === idx ? '#ffffff' : 'var(--text-secondary)',
                    border: featuredIndex === idx ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all var(--transition-fast)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {cand.slug === 'spider-man-brand-new-day' && <span className="pulse-dot pulse-dot-emerald" />}
                  {cand.slug === 'avengers-doomsday' && <Flame size={12} color="var(--accent-amber)" />}
                  <span>{cand.title}</span>
                </button>
              ))}
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '14px' }}>
              {featured.isReleased ? (
                <span className="badge badge-emerald" style={{ padding: '6px 12px' }}>
                  <CheckCircle2 size={13} /> {featured.statusLabel || 'In Theaters / Released'}
                </span>
              ) : (
                <span className="badge badge-gold" style={{ padding: '6px 12px' }}>
                  <Flame size={13} /> {featured.statusLabel || 'Upcoming Slate Milestone'}
                </span>
              )}

              <span className="badge badge-indigo">
                {featured.universeName || 'Marvel Cinematic Universe'}
              </span>

              {featured.phaseName && (
                <span className="badge badge-secondary">{featured.phaseName}</span>
              )}

              {featured.releaseDate && (
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', fontWeight: 700, marginLeft: '4px' }}>
                  📅 {formatDisplayDate(featured.releaseDate)}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 style={{ 
              fontSize: 'clamp(2.4rem, 5vw, 4rem)', 
              fontWeight: 800, 
              lineHeight: 1.1, 
              maxWidth: '900px', 
              marginBottom: '14px',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)'
            }}>
              {featured.title}
            </h1>

            {/* Metadata bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '18px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <strong style={{ color: '#ffffff' }}>{featured.releaseYear}</strong>
              <span>&bull;</span>
              <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                {featured.contentType?.replace('_', ' ')}
              </span>
              <span>&bull;</span>
              <span>{featured.runtimeMinutes ? `${featured.runtimeMinutes} min` : 'Theatrical Feature'}</span>
              <span>&bull;</span>
              <span>{featured.genres}</span>
              {featured.director && (
                <>
                  <span>&bull;</span>
                  <span>Dir. {featured.director}</span>
                </>
              )}
            </div>

            {/* Synopsis */}
            <p style={{ 
              maxWidth: '720px', 
              fontSize: '1.05rem', 
              lineHeight: 1.6, 
              color: 'rgba(255, 255, 255, 0.85)', 
              marginBottom: '28px',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)'
            }}>
              {featured.shortSynopsis || featured.fullSynopsis || 'Explore this pivotal chapter in the expanding multiverse continuum.'}
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link to={`/content/${featured.id}`} className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
                <Info size={18} />
                <span>Explore Canon Dossier</span>
              </Link>

              <Link to={`/roadmap?slug=${featured.slug}`} className="btn btn-cosmic" style={{ padding: '12px 22px', fontSize: '0.95rem' }}>
                <Sparkles size={18} />
                <span>Roadmap / Path to Movie</span>
              </Link>

              <button 
                type="button" 
                className={`btn ${featuredWatched ? 'btn-watched' : 'btn-secondary'}`}
                onClick={() => toggleWatched(featured.id)}
                style={{ padding: '12px 20px' }}
              >
                <Check size={18} color={featuredWatched ? 'var(--accent-emerald)' : 'currentColor'} />
                <span>{featuredWatched ? 'Watched' : 'Mark Watched'}</span>
              </button>

              <button 
                type="button" 
                className={`btn ${isInWatchlist(featured.id) ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => toggleWatchlist(featured.id)}
                style={{ padding: '12px 18px' }}
                title="Save to Watchlist"
              >
                <Bookmark size={18} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 2. Interactive Navigation Tabs & Content Showcase */}
      <div className="container" style={{ paddingTop: '40px' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, marginBottom: '4px' }}>
              Multiverse Canon Vault
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              Real-time daily status tracker across connected timelines and alternate dimensions.
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'RECENT', label: 'In Theaters / New Releases' },
              { id: 'UPCOMING', label: 'Upcoming Slate' },
              { id: 'SPIDER_VERSE', label: 'Spider-Man Nexus' },
              { id: 'AVENGERS', label: 'Avengers Saga' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`btn btn-sm ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Cards Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="skeleton" style={{ height: '380px', borderRadius: 'var(--radius-lg)' }} />
            ))}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '48px'
          }}>
            {displayCards.map(item => (
              <ContentCard key={item.id} content={item} />
            ))}
          </div>
        )}

        {/* 3. New to Marvel? Beginner Guide Release Order Hero Banner */}
        <section style={{
          background: 'linear-gradient(135deg, rgba(230, 36, 41, 0.18) 0%, rgba(99, 102, 241, 0.22) 50%, rgba(0, 240, 255, 0.15) 100%)',
          border: '1px solid rgba(0, 240, 255, 0.35)',
          borderRadius: 'var(--radius-xl)',
          padding: '36px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
          marginBottom: '36px',
          boxShadow: '0 0 32px rgba(0, 240, 255, 0.12)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ maxWidth: '650px', position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-emerald" style={{ background: 'var(--accent-red)', color: '#ffffff' }}>NEWCOMER ESSENTIAL</span>
              <span style={{ fontSize: '0.8rem', color: '#00f0ff', fontWeight: 700 }}>Canonical Release Order Guide</span>
            </div>
            <h3 style={{ fontSize: '1.9rem', fontWeight: 800, marginBottom: '10px', color: '#ffffff' }}>
              Never Watched Marvel Before? Start Here!
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.88)', fontSize: '1.02rem', lineHeight: 1.55 }}>
              Experience the Marvel Cinematic Universe in strict <strong>Canonical Release Order</strong> from #1 <em>Iron Man (2008)</em> to the latest 2026 releases (<em>Spider-Man: Brand New Day</em> & <em>VisionQuest</em>). Built-in character debut breakdowns, post-credit scene guides, and interactive watched tracker.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', position: 'relative', zIndex: 2 }}>
            <Link to="/starter-guide" className="btn btn-primary" style={{ padding: '14px 26px', fontSize: '1rem', fontWeight: 700, boxShadow: '0 0 20px rgba(230, 36, 41, 0.4)' }}>
              <Sparkles size={18} color="#00f0ff" />
              <span>Open Beginner Release Order Guide</span>
            </Link>
          </div>
        </section>

        {/* 4. Callout: Path to Avengers: Doomsday */}
        <section style={{
          background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.45) 0%, rgba(13, 17, 28, 0.95) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          borderRadius: 'var(--radius-xl)',
          padding: '36px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
          marginBottom: '56px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-gold">Interactive Lore Navigator</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dec 18, 2026 Ready</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '10px' }}>
              Where Does Every Movie Fit in the Multiverse?
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.5 }}>
              Planning to watch <strong>Spider-Man: Brand New Day</strong> or preparing for <strong>Avengers: Doomsday</strong>? 
              Generate an intelligent, zero-filler viewing path that extracts the exact prerequisites without endless watchlists.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/roadmap?slug=avengers-doomsday" className="btn btn-primary" style={{ padding: '12px 22px' }}>
              <Sparkles size={16} />
              <span>Path to Doomsday</span>
            </Link>
            <Link to="/story-flow" className="btn btn-secondary" style={{ padding: '12px 20px' }}>
              <GitBranch size={16} />
              <span>Multiverse Story Flow</span>
            </Link>
          </div>
        </section>

        {/* 4. Multiverse Continuity Pillars */}
        <section>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px' }}>
              Connected Dimensions &amp; Continuum Portals
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              Explore the four foundational universes officially unified in Phase 5 &amp; 6.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px'
          }}>
            {[
              {
                name: 'Earth-616 Sacred Timeline',
                desc: 'The central Marvel Cinematic Universe thread featuring Iron Man, Avengers, and Spider-Man: Brand New Day.',
                badge: 'Primary Continuum',
                link: '/timelines'
              },
              {
                name: 'Earth-96283 Raimi-Verse',
                desc: 'Tobey Maguire’s pioneering Spider-Man trilogy featuring Green Goblin, Doc Ock, and Sandman.',
                badge: 'Spider-Verse Legacy',
                link: '/explore?universeId=2'
              },
              {
                name: 'Earth-120703 Amazing Spider-Verse',
                desc: 'Andrew Garfield’s Oscorp timeline featuring Electro, Lizard, and the tragic Gwen Stacy arc.',
                badge: 'Spider-Verse Legacy',
                link: '/explore?universeId=3'
              },
              {
                name: 'Earth-10005 Fox Mutant Continuum',
                desc: 'Hugh Jackman’s Wolverine, Professor X, and Deadpool, bridged into the MCU via the Multiverse Void.',
                badge: 'Mutant Anchor Dimension',
                link: '/explore?universeId=4'
              }
            ].map((univ, i) => (
              <Link
                key={i}
                to={univ.link}
                className="glass-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  textDecoration: 'none'
                }}
              >
                <div>
                  <div style={{ marginBottom: '12px' }}>
                    <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>
                      {univ.badge}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: '#ffffff' }}>
                    {univ.name}
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {univ.desc}
                  </p>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-blue)', fontSize: '0.85rem', fontWeight: 600 }}>
                  <span>Enter Continuum</span>
                  <ChevronRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
