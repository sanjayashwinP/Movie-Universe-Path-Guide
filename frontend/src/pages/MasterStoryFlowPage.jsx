import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  GitBranch, Film, Tv, Sparkles, Filter, Check, Eye, 
  Calendar, Clock, ArrowRight, Compass, Shield, Flame, Globe,
  Search, Info, BookOpen, Layers, CheckCircle2, ChevronDown
} from 'lucide-react';
import { contentApi, franchiseApi } from '../services/api';
import { clientDataService, normalizeContentItem } from '../services/clientDataService';
import { useWatch } from '../contexts/WatchContext';
import { getPosterFallback } from '../utils/imageFallback';
import TimelineChart from '../components/timeline/TimelineChart';
import ContentGrid from '../components/content/ContentGrid';

export default function MasterStoryFlowPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState('ALL'); // ALL, MOVIE, SERIES, SPECIAL_PRESENTATION
  const [selectedBranch, setSelectedBranch] = useState('ALL'); // ALL, 616, 96283, 120703, 10005, TVA
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, RELEASED, UPCOMING
  const [viewMode, setViewMode] = useState('STORY_LINE'); // STORY_LINE, TIMELINE, GRID
  const [searchQuery, setSearchQuery] = useState('');

  const { isWatched, toggleWatch } = useWatch();

  useEffect(() => {
    async function fetchFlowData() {
      setLoading(true);
      try {
        let list = [];
        try {
          const res = await contentApi.getAll({ size: 100 });
          const data = res.data?.data;
          const raw = data?.content || (Array.isArray(data) ? data : []);
          list = raw.map(normalizeContentItem);
        } catch (apiErr) {
          // Fall through to clientDataService
        }

        if (!list || list.length === 0) {
          list = await clientDataService.getAllContent();
        }

        // Sort by in-universe chronological story order from scratch (#1 origin onwards)
        list.sort((a, b) => {
          const aOrder = a.chronologicalOrder || a.chronologicalOrderNum || 9999;
          const bOrder = b.chronologicalOrder || b.chronologicalOrderNum || 9999;
          return aOrder - bOrder;
        });

        setItems(list.map(normalizeContentItem));
      } catch (err) {
        console.error('Failed to load master flow content:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFlowData();
  }, []);

  // Filter items according to user selections
  const filteredItems = items.filter(item => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = item.title?.toLowerCase().includes(q);
      const castMatch = item.castMembers?.toLowerCase().includes(q);
      const synMatch = (item.shortSynopsis || item.description || '').toLowerCase().includes(q);
      if (!titleMatch && !castMatch && !synMatch) return false;
    }

    // Format filter
    if (selectedFormat === 'MOVIE' && item.contentType !== 'MOVIE') return false;
    if (selectedFormat === 'SERIES' && !['TV_SERIES', 'SERIES', 'LIMITED_SERIES', 'ANIMATED_SERIES'].includes(item.contentType)) return false;
    if (selectedFormat === 'SPECIAL_PRESENTATION' && item.contentType !== 'SPECIAL_PRESENTATION') return false;

    // Multiverse branch filter
    const desig = (item.universeDesignation || item.universeName || '').toLowerCase();
    const tlName = (item.timelineName || '').toLowerCase();
    if (selectedBranch === '616' && !desig.includes('616') && !desig.includes('199999') && !tlName.includes('sacred') && !tlName.includes('prime')) return false;
    if (selectedBranch === '96283' && !desig.includes('96283') && !desig.includes('tobey')) return false;
    if (selectedBranch === '120703' && !desig.includes('120703') && !desig.includes('andrew')) return false;
    if (selectedBranch === '10005' && !desig.includes('10005') && !desig.includes('x-men') && !desig.includes('mutant')) return false;
    if (selectedBranch === 'TVA' && !tlName.includes('tva') && !tlName.includes('void') && !tlName.includes('branch')) return false;

    // Status filter
    if (statusFilter === 'RELEASED' && item.status !== 'RELEASED') return false;
    if (statusFilter === 'UPCOMING' && item.status === 'RELEASED') return false;

    return true;
  });

  const getTypeBadge = (type) => {
    switch (type) {
      case 'TV_SERIES':
      case 'SERIES':
      case 'LIMITED_SERIES':
      case 'ANIMATED_SERIES':
        return { label: 'TV Series', icon: <Tv size={12} />, bg: 'rgba(99, 102, 241, 0.18)', border: 'rgba(99, 102, 241, 0.4)', color: '#818cf8' };
      case 'SPECIAL_PRESENTATION':
      case 'ONE_SHOT':
        return { label: 'Special Presentation', icon: <Sparkles size={12} />, bg: 'rgba(234, 179, 8, 0.18)', border: 'rgba(234, 179, 8, 0.4)', color: '#facc15' };
      default:
        return { label: 'Movie', icon: <Film size={12} />, bg: 'rgba(225, 29, 72, 0.18)', border: 'rgba(225, 29, 72, 0.4)', color: '#fb7185' };
    }
  };

  const getBranchBadge = (item) => {
    const desig = (item.universeDesignation || item.universeName || '').toLowerCase();
    const tl = (item.timelineName || '').toLowerCase();
    if (desig.includes('96283') || desig.includes('tobey')) {
      return { label: 'Earth-96283 (Tobey Maguire)', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)' };
    }
    if (desig.includes('120703') || desig.includes('andrew')) {
      return { label: 'Earth-120703 (Andrew Garfield)', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)' };
    }
    if (desig.includes('10005') || desig.includes('x-men') || desig.includes('mutant')) {
      return { label: 'Earth-10005 (Fox X-Men / Deadpool)', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' };
    }
    if (tl.includes('void') || tl.includes('tva')) {
      return { label: 'TVA Null-Time / The Void', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)' };
    }
    return { label: 'Earth-616 (Sacred Timeline)', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' };
  };

  const watchedTotal = items.filter(i => isWatched && isWatched(i.id)).length;
  const watchedPct = items.length > 0 ? Math.round((watchedTotal / items.length) * 100) : 0;

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: '1360px' }}>
      {/* Master Hero Banner */}
      <div className="glass-panel" style={{
        padding: '36px 32px',
        marginBottom: '32px',
        background: 'linear-gradient(135deg, rgba(230, 36, 41, 0.14) 0%, rgba(20, 24, 38, 0.95) 50%, rgba(13, 15, 24, 0.98) 100%)',
        border: '1px solid rgba(230, 36, 41, 0.35)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.7), 0 0 30px rgba(230, 36, 41, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(230, 36, 41, 0.2)', border: '1px solid rgba(230, 36, 41, 0.4)', borderRadius: 'var(--radius-full)', color: '#ff6b6b', fontSize: '0.8rem', fontWeight: 800, marginBottom: '12px' }}>
              <Globe size={14} /> DEDICATED MARVEL MULTIVERSE STORY FLOW LINE
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: '0 0 10px', color: '#ffffff', letterSpacing: '-0.02em' }}>
              Canonical Story Flow Line
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', maxWidth: '820px', margin: 0, lineHeight: 1.6 }}>
              Follow the complete narrative storyline linking movies, Disney+ series, and Special Presentations seamlessly from scratch (#1 origin) across all multiverse branches: Earth-616 Sacred Timeline, Tobey Maguire's Earth-96283, Andrew Garfield's Earth-120703, and the Fox X-Men Earth-10005 universe.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '220px' }}>
            <div style={{ background: 'rgba(0, 0, 0, 0.4)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)', padding: '12px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                <span>Watched Progress:</span>
                <strong style={{ color: 'var(--accent-emerald)' }}>{watchedTotal} / {items.length} ({watchedPct}%)</strong>
              </div>
              <div className="progress-track" style={{ height: '7px' }}>
                <div className="progress-fill emerald" style={{ width: `${watchedPct}%` }} />
              </div>
            </div>

            <Link to="/roadmap" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 18px', fontSize: '0.9rem' }}>
              <Compass size={16} /> Roadmap: From Scratch to Any Movie
            </Link>
          </div>
        </div>

        {/* Live Auto-Sync Architecture Guarantee Notice */}
        <div style={{
          marginTop: '24px',
          padding: '12px 18px',
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.85rem',
          color: '#34d399'
        }}>
          <Sparkles size={16} style={{ flexShrink: 0 }} />
          <span>
            <strong>Automatic Story Incorporation Engine:</strong> When future movies, series, or special presentations are announced or added, they are automatically placed into this story flow line with verified theatrical artwork, chronology anchors, and continuity linkage.
          </span>
        </div>
      </div>

      {/* Filter, Search & View Controls */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-card)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        marginBottom: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Row 1: Search & View Mode Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          {/* Real-time search */}
          <div style={{ position: 'relative', flex: 1, minWidth: '260px', maxWidth: '420px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Filter by title, hero, or storyline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '38px', height: '40px', fontSize: '0.88rem', background: '#0c0f18' }}
            />
          </div>

          {/* View Mode Switcher */}
          <div className="view-toggle-container">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'STORY_LINE' ? 'active' : ''}`}
              onClick={() => setViewMode('STORY_LINE')}
            >
              <GitBranch size={15} /> Story Flow Line
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'TIMELINE' ? 'active' : ''}`}
              onClick={() => setViewMode('TIMELINE')}
            >
              <Layers size={15} /> Vertical Spine
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'GRID' ? 'active' : ''}`}
              onClick={() => setViewMode('GRID')}
            >
              <Film size={15} /> Cinematic Cards
            </button>
          </div>
        </div>

        {/* Row 2: Content Type Formats */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Format:</span>
            {[
              { id: 'ALL', label: 'All Projects' },
              { id: 'MOVIE', label: 'Feature Films' },
              { id: 'SERIES', label: 'TV & Disney+ Series' },
              { id: 'SPECIAL_PRESENTATION', label: 'Special Presentations' }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                className={`order-chip ${selectedFormat === f.id ? 'active' : ''}`}
                onClick={() => setSelectedFormat(f.id)}
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Multiverse Branch Selector Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Timeline Branch:</span>
            {[
              { id: 'ALL', label: 'All Universes' },
              { id: '616', label: 'Earth-616 (Sacred)' },
              { id: '96283', label: 'Earth-96283 (Tobey)' },
              { id: '120703', label: 'Earth-120703 (Andrew)' },
              { id: '10005', label: 'Earth-10005 (Fox)' },
              { id: 'TVA', label: 'TVA / Void' }
            ].map(b => (
              <button
                key={b.id}
                type="button"
                className={`order-chip ${selectedBranch === b.id ? 'active' : ''}`}
                onClick={() => setSelectedBranch(b.id)}
                style={{ padding: '5px 12px', fontSize: '0.78rem' }}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Status selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Status:</span>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '5px 10px', fontSize: '0.8rem', width: 'auto', height: '32px' }}
            >
              <option value="ALL">All Releases</option>
              <option value="RELEASED">Released Only</option>
              <option value="UPCOMING">Upcoming Slate Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Showing count */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Showing <strong style={{ color: '#ffffff' }}>{filteredItems.length}</strong> narrative nodes in canonical story flow
        </div>
      </div>

      {/* Main Content Renderers */}
      {viewMode === 'STORY_LINE' && (
        <div className="story-flow-stream-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredItems.map((item, index) => {
            const watched = isWatched && isWatched(item.id);
            const chronoNum = item.chronologicalOrder || item.chronologicalOrderNum || (index + 1);
            const typeBadge = getTypeBadge(item.contentType);
            const branchBadge = getBranchBadge(item);
            const nextItem = filteredItems[index + 1];

            return (
              <div 
                key={item.id} 
                className="story-flow-node-card"
                style={{
                  background: watched ? 'rgba(16, 185, 129, 0.04)' : 'rgba(20, 24, 38, 0.75)',
                  border: watched ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(255, 255, 255, 0.09)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Visual Branch Accent Line */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: '5px',
                  background: branchBadge.color
                }} />

                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  {/* Poster Thumbnail */}
                  <Link 
                    to={`/content/${item.slug || item.id}`}
                    style={{
                      flexShrink: 0,
                      width: '120px',
                      height: '180px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      background: '#0d101d',
                      boxShadow: '0 10px 24px rgba(0, 0, 0, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      position: 'relative'
                    }}
                  >
                    <img
                      src={item.posterUrl || getPosterFallback(item.title, item.contentType)}
                      alt={item.title}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getPosterFallback(item.title, item.contentType);
                      }}
                    />
                    {watched && (
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: '#10b981',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#000',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
                      }}>
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </Link>

                  {/* Body Details */}
                  <div style={{ flex: 1, minWidth: '300px' }}>
                    {/* Top Badges */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                      <span style={{
                        padding: '4px 10px',
                        background: 'rgba(230, 36, 41, 0.2)',
                        border: '1px solid rgba(230, 36, 41, 0.45)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        color: '#ff6b6b'
                      }}>
                        STORY STEP #{chronoNum}
                      </span>

                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '4px 10px',
                        background: typeBadge.bg,
                        border: `1px solid ${typeBadge.border}`,
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: typeBadge.color
                      }}>
                        {typeBadge.icon}
                        {typeBadge.label}
                      </span>

                      <span style={{
                        padding: '4px 10px',
                        background: branchBadge.bg,
                        border: `1px solid ${branchBadge.color}40`,
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: branchBadge.color
                      }}>
                        {branchBadge.label}
                      </span>

                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={13} /> {item.releaseYear || item.releaseDate?.substring(0, 4)}
                      </span>

                      {item.runtimeMinutes && (
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={13} /> {item.runtimeMinutes} min
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 8px', color: '#ffffff' }}>
                      <Link to={`/content/${item.slug || item.id}`} style={{ color: '#ffffff', textDecoration: 'none' }}>
                        {item.title}
                      </Link>
                    </h3>

                    {/* Hierarchy tags */}
                    <div style={{ display: 'flex', gap: '10px', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      {item.sagaName && <span style={{ color: 'var(--accent-gold)' }}>{item.sagaName}</span>}
                      {item.phaseName && <span>• {item.phaseName}</span>}
                      {item.director && <span>• Directed by {item.director}</span>}
                    </div>

                    {/* Narrative Synopsis */}
                    <p style={{ color: '#d1d5db', fontSize: '0.94rem', lineHeight: 1.6, margin: '0 0 14px' }}>
                      {item.fullSynopsis || item.shortSynopsis || item.description}
                    </p>

                    {/* Post Credit Scene Continuity Note */}
                    {item.postCreditScene && (
                      <div style={{
                        padding: '10px 14px',
                        background: 'rgba(99, 102, 241, 0.08)',
                        border: '1px solid rgba(99, 102, 241, 0.25)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.84rem',
                        color: '#c7d2fe',
                        marginBottom: '16px'
                      }}>
                        <strong>🎬 Post-Credits / Continuity Bridge:</strong> {item.postCreditScene}
                      </div>
                    )}

                    {/* Bottom Action Strip */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.07)', paddingTop: '14px' }}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          type="button"
                          className={`btn ${watched ? 'btn-success' : 'btn-outline'}`}
                          onClick={() => toggleWatch(item.id, item.title)}
                          style={{ fontSize: '0.82rem', padding: '7px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Check size={14} />
                          {watched ? 'Watched' : 'Mark as Watched'}
                        </button>

                        <Link
                          to={`/content/${item.slug || item.id}`}
                          className="btn btn-ghost"
                          style={{ fontSize: '0.82rem', padding: '7px 14px' }}
                        >
                          Canon Dossier &amp; Cast &rarr;
                        </Link>
                      </div>

                      {nextItem && (
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <span>Next in story flow:</span>
                          <strong style={{ color: '#ffffff' }}>{nextItem.title}</strong>
                          <ArrowRight size={13} color="var(--accent-red)" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewMode === 'TIMELINE' && (
        <TimelineChart items={filteredItems} orderType="chronological" />
      )}

      {viewMode === 'GRID' && (
        <ContentGrid items={filteredItems} loading={loading} />
      )}
    </div>
  );
}
