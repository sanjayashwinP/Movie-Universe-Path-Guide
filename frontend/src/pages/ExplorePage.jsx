import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Filter, RotateCcw, Search, Sparkles, Film, ArrowUpDown, 
  GitBranch, Compass, Calendar, CheckCircle2 
} from 'lucide-react';
import { contentApi, franchiseApi } from '../services/api';
import { useWatch } from '../contexts/WatchContext';
import ContentGrid from '../components/content/ContentGrid';
import TimelineChart from '../components/timeline/TimelineChart';
import { clientDataService, normalizeContentItem } from '../services/clientDataService';

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  // Filter options from API
  const [franchises, setFranchises] = useState([]);
  const [universes, setUniverses] = useState([]);
  const [timelines, setTimelines] = useState([]);
  const [sagas, setSagas] = useState([]);
  const [phases, setPhases] = useState([]);

  // Active filter states
  const [selectedFranchise, setSelectedFranchise] = useState(searchParams.get('franchise') || '');
  const [selectedUniverse, setSelectedUniverse] = useState(searchParams.get('universe') || '');
  const [selectedTimeline, setSelectedTimeline] = useState(searchParams.get('timeline') || '');
  const [selectedSaga, setSelectedSaga] = useState(searchParams.get('saga') || '');
  const [selectedPhase, setSelectedPhase] = useState(searchParams.get('phase') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [watchFilter, setWatchFilter] = useState('ALL'); // ALL, WATCHED, UNWATCHED
  const [sortBy, setSortBy] = useState('chronological'); // Default to chronological for timeline flow!
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('TIMELINE'); // Default to TIMELINE chart as requested!

  const { isWatched } = useWatch();

  // Load initial filter taxonomy
  useEffect(() => {
    async function loadTaxonomies() {
      try {
        const [fRes, uRes, tRes, sRes, pRes] = await Promise.all([
          franchiseApi.getAll(),
          franchiseApi.getUniverses(),
          franchiseApi.getTimelines(),
          franchiseApi.getSagas(),
          franchiseApi.getPhases()
        ]);
        setFranchises(fRes.data?.data || []);
        setUniverses(uRes.data?.data || []);
        setTimelines(tRes.data?.data || []);
        setSagas(sRes.data?.data || []);
        setPhases(pRes.data?.data || []);
      } catch (err) {
        setFranchises(await clientDataService.getFranchises());
        setUniverses(await clientDataService.getUniverses());
        setSagas(await clientDataService.getSagas());
      }
    }
    loadTaxonomies();
  }, []);

  // Fetch content on filter change
  useEffect(() => {
    async function fetchContent() {
      setLoading(true);
      try {
        const params = {
          size: 100,
          page: 0
        };

        if (selectedUniverse) params.universeId = selectedUniverse;
        if (selectedTimeline) params.timelineId = selectedTimeline;
        if (selectedSaga) params.sagaId = selectedSaga;
        if (selectedPhase) params.phaseId = selectedPhase;
        if (selectedType) params.contentType = selectedType;
        if (searchQuery.trim()) params.search = searchQuery.trim();

        let list = [];
        try {
          const res = await contentApi.getAll(params);
          const data = res.data?.data;
          const raw = data?.content || (Array.isArray(data) ? data : []);
          list = raw.map(normalizeContentItem);
        } catch (apiErr) {
          list = await clientDataService.getAllContent(params);
        }

        // In-memory filters for franchise
        if (selectedFranchise) {
          list = list.filter(item => {
            const u = universes.find(u => u.name === item.universeName);
            const f = franchises.find(fr => fr.id === u?.franchiseId);
            return f?.slug === selectedFranchise || f?.name?.toLowerCase().includes(selectedFranchise.toLowerCase());
          });
        }

        // Search Query Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          list = list.filter(item => 
            item.title?.toLowerCase().includes(q) ||
            item.castMembers?.toLowerCase().includes(q) ||
            item.director?.toLowerCase().includes(q) ||
            item.universeName?.toLowerCase().includes(q)
          );
        }

        // Watch Status Filter
        if (watchFilter === 'WATCHED') {
          list = list.filter(item => isWatched(item.id));
        } else if (watchFilter === 'UNWATCHED') {
          list = list.filter(item => !isWatched(item.id));
        }

        // Sort
        list.sort((a, b) => {
          if (sortBy === 'releaseDate') {
            return (a.releaseDate || '').localeCompare(b.releaseDate || '');
          }
          if (sortBy === 'chronological') {
            const aOrder = a.chronologicalOrder || a.chronologicalOrderNum || 9999;
            const bOrder = b.chronologicalOrder || b.chronologicalOrderNum || 9999;
            return aOrder - bOrder;
          }
          if (sortBy === 'title') {
            return (a.title || '').localeCompare(b.title || '');
          }
          return 0;
        });

        setItems(list);
        setTotalElements(list.length);
      } catch (err) {
        console.error('Error fetching filtered content:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, [
    selectedFranchise, selectedUniverse, selectedTimeline, 
    selectedSaga, selectedPhase, selectedType, watchFilter, sortBy, searchQuery,
    universes, franchises
  ]);

  const resetFilters = () => {
    setSelectedFranchise('');
    setSelectedUniverse('');
    setSelectedTimeline('');
    setSelectedSaga('');
    setSelectedPhase('');
    setSelectedType('');
    setWatchFilter('ALL');
    setSortBy('chronological');
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      {/* Header Banner */}
      <div className="section-header" style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 12px', background: 'rgba(230, 36, 41, 0.15)', border: '1px solid rgba(230, 36, 41, 0.3)', borderRadius: 'var(--radius-full)', color: 'var(--accent-red)', fontSize: '0.8rem', fontWeight: 800, marginBottom: '8px' }}>
            <Sparkles size={13} /> MARVEL OMNIVERSE EXPLORER
          </div>
          <h1 className="section-title" style={{ fontSize: '2.2rem', fontWeight: 900, margin: '0 0 6px', color: '#ffffff' }}>
            Cinematic Canon Explorer
          </h1>
          <p className="section-subtitle" style={{ margin: 0, color: 'var(--text-secondary)' }}>
            Interactive timeline flow chart covering Earth-616 Sacred Timeline, Tobey Maguire's Earth-96283, Andrew Garfield's Earth-120703, Fox X-Men's Earth-10005, and upcoming releases.
          </p>
        </div>

        {/* View Switcher & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div className="view-toggle-container">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'TIMELINE' ? 'active' : ''}`}
              onClick={() => setViewMode('TIMELINE')}
            >
              <GitBranch size={15} /> Timeline Chart
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'GRID' ? 'active' : ''}`}
              onClick={() => setViewMode('GRID')}
            >
              <Film size={15} /> Cinematic Grid
            </button>
          </div>

          <Link to="/roadmap" className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Compass size={15} /> Path to Any Movie
          </Link>

          <button 
            type="button" 
            className="btn btn-ghost btn-sm"
            onClick={resetFilters}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Symmetrical High-Contrast Filter Toolbar */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(20, 24, 38, 0.85) 0%, rgba(13, 15, 24, 0.95) 100%)',
        border: '1px solid var(--border-card)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 28px',
        marginBottom: '36px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Search Bar Row */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Live search by title, character, or director across all timelines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '42px', fontSize: '1rem', background: 'rgba(0, 0, 0, 0.5)' }}
          />
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        {/* Row 1: Select Dropdowns Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px'
        }}>
          {/* Universe */}
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Universe</label>
            <select 
              className="form-select"
              value={selectedUniverse}
              onChange={(e) => setSelectedUniverse(e.target.value)}
            >
              <option value="">All Universes</option>
              {universes.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.designation || 'Multiverse'})</option>
              ))}
            </select>
          </div>

          {/* Timeline */}
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Timeline / Continuity</label>
            <select 
              className="form-select"
              value={selectedTimeline}
              onChange={(e) => setSelectedTimeline(e.target.value)}
            >
              <option value="">All Timelines</option>
              {timelines.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Saga */}
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Saga / Era</label>
            <select 
              className="form-select"
              value={selectedSaga}
              onChange={(e) => setSelectedSaga(e.target.value)}
            >
              <option value="">All Sagas</option>
              {sagas.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Phase */}
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Phase</label>
            <select 
              className="form-select"
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
            >
              <option value="">All Phases</option>
              {phases.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Format Chips, Watch Status & Sorting */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '18px'
        }}>
          {/* Content Type Filter Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Type:</span>
            {[
              { label: 'All', value: '' },
              { label: 'Movies', value: 'MOVIE' },
              { label: 'TV Series', value: 'SERIES' },
              { label: 'Limited Series', value: 'LIMITED_SERIES' },
              { label: 'Specials', value: 'SPECIAL_PRESENTATION' }
            ].map(type => (
              <button
                key={type.value}
                type="button"
                className={`order-chip ${selectedType === type.value ? 'active' : ''}`}
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                onClick={() => setSelectedType(type.value)}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Watch Status & Sort By */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Watch Status:</span>
              <select
                className="form-select"
                value={watchFilter}
                onChange={(e) => setWatchFilter(e.target.value)}
                style={{ padding: '6px 12px', fontSize: '0.82rem', width: 'auto' }}
              >
                <option value="ALL">All Watch Status</option>
                <option value="WATCHED">Watched Only</option>
                <option value="UNWATCHED">Unwatched Only</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowUpDown size={14} color="var(--text-muted)" />
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ padding: '6px 12px', fontSize: '0.82rem', width: 'auto' }}
              >
                <option value="chronological">Story Chronology</option>
                <option value="releaseDate">Theatrical Release Date</option>
                <option value="title">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          Displaying <strong style={{ color: '#ffffff' }}>{totalElements}</strong> cinematic projects in {viewMode === 'TIMELINE' ? 'interactive timeline flowchart' : 'grid layout'}
        </div>
      </div>

      {/* Render View: Timeline Flow Chart or Content Grid */}
      {viewMode === 'TIMELINE' ? (
        <TimelineChart items={items} orderType={sortBy === 'releaseDate' ? 'release' : 'chronological'} />
      ) : (
        <ContentGrid items={items} loading={loading} />
      )}
    </div>
  );
}
