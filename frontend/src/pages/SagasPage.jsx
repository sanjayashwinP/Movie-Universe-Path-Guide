import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Layers, Check, Film, ArrowRight } from 'lucide-react';
import { franchiseApi, contentApi } from '../services/api';
import { clientDataService, normalizeContentItem } from '../services/clientDataService';
import { getPosterFallback } from '../utils/imageFallback';
import { useWatch } from '../contexts/WatchContext';

export default function SagasPage() {
  const [sagas, setSagas] = useState([]);
  const [phases, setPhases] = useState([]);
  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSagaId, setActiveSagaId] = useState(null);

  const { isWatched, toggleWatched } = useWatch();

  useEffect(() => {
    async function loadSagaData() {
      setLoading(true);
      try {
        let sList = [];
        let pList = [];
        let cList = [];
        try {
          const [sRes, pRes, cRes] = await Promise.all([
            franchiseApi.getSagas(),
            franchiseApi.getPhases(),
            contentApi.getAll({ size: 100 })
          ]);
          sList = sRes.data?.data || [];
          pList = pRes.data?.data || [];
          const raw = cRes.data?.data?.content || (Array.isArray(cRes.data?.data) ? cRes.data?.data : []);
          cList = raw.map(normalizeContentItem);
        } catch (apiErr) {
          sList = await clientDataService.getSagas();
          pList = await clientDataService.getPhases();
          cList = await clientDataService.getAllContent();
        }

        if (cList.length === 0) {
          cList = await clientDataService.getAllContent();
        }

        setSagas(sList);
        setPhases(pList);
        setContentList(cList);

        if (sList.length > 0) {
          setActiveSagaId(sList[0].id);
        }
      } catch (err) {
        console.error('Failed to load sagas:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSagaData();
  }, []);

  const activeSaga = sagas.find(s => s.id === activeSagaId);
  const sagaPhases = phases.filter(p => p.sagaId === activeSagaId);

  // Compute stats for a phase
  const getPhaseStats = (phaseId) => {
    const items = contentList.filter(c => c.phaseName === phases.find(p => p.id === phaseId)?.name);
    const watched = items.filter(c => isWatched(c.id)).length;
    const total = items.length;
    const pct = total > 0 ? Math.round((watched / total) * 100) : 0;
    return { items, watched, total, pct };
  };

  // Compute stats for active saga
  const getSagaStats = () => {
    const items = contentList.filter(c => c.sagaName === activeSaga?.name);
    const watched = items.filter(c => isWatched(c.id)).length;
    const total = items.length;
    const pct = total > 0 ? Math.round((watched / total) * 100) : 0;
    return { watched, total, pct };
  };

  const sagaStats = getSagaStats();

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      {/* Page Title */}
      <div className="section-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '2rem' }}>
            <Sparkles size={26} color="var(--accent-red)" />
            Cinematic Sagas &amp; Phases
          </h1>
          <p className="section-subtitle">
            Track narrative chapters and phases from origin to multiverse culmination.
          </p>
        </div>
      </div>

      {/* Saga Switcher Chips */}
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '32px' }}>
        {sagas.map(s => (
          <button
            key={s.id}
            type="button"
            className={`order-chip ${activeSagaId === s.id ? 'active' : ''}`}
            onClick={() => setActiveSagaId(s.id)}
            style={{ fontSize: '1rem', padding: '12px 24px' }}
          >
            <Sparkles size={16} />
            <span>{s.name}</span>
          </button>
        ))}
      </div>

      {activeSaga && (
        <div>
          {/* Saga Summary Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.4) 0%, rgba(13, 15, 24, 0.95) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px',
            marginBottom: '40px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
              <div>
                <span className="badge badge-accent" style={{ marginBottom: '8px' }}>Active Saga Era</span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0 8px' }}>
                  {activeSaga.name}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '700px', margin: 0 }}>
                  {activeSaga.description}
                </p>
              </div>

              {/* Progress Box */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                minWidth: '220px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Saga Completion</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>{sagaStats.pct}%</span>
                </div>
                <div className="progress-track" style={{ marginBottom: '8px' }}>
                  <div className="progress-fill emerald" style={{ width: `${sagaStats.pct}%` }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                  {sagaStats.watched} of {sagaStats.total} projects completed
                </div>
              </div>
            </div>
          </div>

          {/* Phases Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {sagaPhases.map(phase => {
              const { items, watched, total, pct } = getPhaseStats(phase.id);

              return (
                <div 
                  key={phase.id}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-card)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px'
                  }}
                >
                  {/* Phase Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginBottom: '20px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid var(--border-subtle)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="brand-icon" style={{ width: '28px', height: '28px', borderRadius: '4px' }}>
                        <Layers size={16} color="#ffffff" />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
                          {phase.name}
                        </h3>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {phase.description}
                        </div>
                      </div>
                    </div>

                    {/* Phase Progress Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <strong>{watched}</strong> / {total} watched ({pct}%)
                      </div>
                      <div style={{ width: '100px' }} className="progress-track">
                        <div className="progress-fill cosmic" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Phase Content Table / Cards */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '14px'
                  }}>
                    {items.map((item, idx) => {
                      const itemWatched = isWatched(item.id);
                      return (
                        <div
                          key={item.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-md)'
                          }}
                        >
                          {/* Order Number */}
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', width: '24px' }}>
                            {idx + 1}
                          </div>

                          {/* Poster */}
                          <Link 
                            to={`/content/${item.id}`}
                            style={{ width: '40px', height: '60px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0, backgroundColor: '#111420' }}
                          >
                            <img 
                              src={(!item.posterUrl || item.posterUrl.includes('unsplash.com')) ? getPosterFallback(item.title) : item.posterUrl} 
                              alt={item.title} 
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = getPosterFallback(item.title);
                              }}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                          </Link>

                          {/* Details */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <Link 
                              to={`/content/${item.id}`}
                              style={{ 
                                color: '#ffffff', 
                                textDecoration: 'none', 
                                fontWeight: 600, 
                                fontSize: '0.9rem',
                                display: 'block',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {item.title}
                            </Link>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                              <span>{item.releaseYear}</span>
                              <span> &bull; </span>
                              <span>{item.contentType?.replace('_', ' ')}</span>
                            </div>
                          </div>

                          {/* Watched toggle */}
                          <button
                            type="button"
                            className={`btn ${itemWatched ? 'btn-secondary' : 'btn-ghost'} btn-sm`}
                            onClick={() => toggleWatched(item.id)}
                            style={{ padding: '6px' }}
                            title={itemWatched ? 'Mark unwatched' : 'Mark watched'}
                          >
                            <Check size={16} color={itemWatched ? 'var(--accent-emerald)' : 'var(--text-muted)'} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
