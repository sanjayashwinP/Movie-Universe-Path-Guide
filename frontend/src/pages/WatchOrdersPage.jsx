import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  ListOrdered, Calendar, GitBranch, Sparkles, 
  Check, ArrowRight, Film, Tv, Clock, Compass 
} from 'lucide-react';
import { watchOrderApi, franchiseApi } from '../services/api';
import { useWatch } from '../contexts/WatchContext';
import { clientDataService, normalizeContentItem } from '../services/clientDataService';
import { getPosterFallback } from '../utils/imageFallback';

export default function WatchOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') || 'chronological';
  const [mode, setMode] = useState(initialMode);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isWatched, toggleWatched } = useWatch();

  // Watch journey modes definition
  const JOURNEYS = [
    {
      id: 'chronological',
      title: 'Story Chronological',
      icon: <Calendar size={16} />,
      desc: 'Watch according to in-universe historical sequence (starting with Captain America in 1942).'
    },
    {
      id: 'release',
      title: 'Theatrical Release',
      icon: <ListOrdered size={16} />,
      desc: 'Experience the universe exactly as audiences saw it in theaters (starting with Iron Man in 2008).'
    },
    {
      id: 'sacred',
      title: 'Sacred Timeline Strict',
      icon: <GitBranch size={16} />,
      desc: 'Focus strictly on the unbranched core MCU continuity without alternate universe deviations.'
    },
    {
      id: 'timeline',
      title: 'Multiverse & Branches',
      icon: <GitBranch size={16} />,
      desc: 'Follow the flow of timelines, including branch variants like Loki 2012 and What If...?'
    },
    {
      id: 'saga',
      title: 'Saga by Saga',
      icon: <Sparkles size={16} />,
      desc: 'Progress systematically through the Infinity Saga (Phases 1-3) and Multiverse Saga (Phases 4-6).'
    }
  ];

  useEffect(() => {
    async function loadWatchOrder() {
      setLoading(true);
      try {
        let res;
        if (mode === 'chronological') {
          res = await watchOrderApi.getChronological();
        } else if (mode === 'release') {
          res = await watchOrderApi.getRelease();
        } else if (mode === 'sacred') {
          res = await watchOrderApi.getMainTimeline();
        } else if (mode === 'timeline') {
          res = await watchOrderApi.getTimeline();
        } else if (mode === 'saga') {
          res = await watchOrderApi.getSaga();
        }
        const data = res?.data?.data;
        const list = data?.content || (Array.isArray(data) ? data : []);
        setItems(list.map(normalizeContentItem));
      } catch (err) {
        console.warn('Failed to load watch order from API, using clientDataService:', err);
        const all = await clientDataService.getAllContent();
        if (mode === 'release') {
          all.sort((a, b) => (a.releaseOrderNum || 9999) - (b.releaseOrderNum || 9999));
        } else {
          all.sort((a, b) => (a.chronologicalOrderNum || 9999) - (b.chronologicalOrderNum || 9999));
        }
        setItems(all.map(normalizeContentItem));
      } finally {
        setLoading(false);
      }
    }

    loadWatchOrder();
  }, [mode]);

  const handleSelectJourney = (journeyId) => {
    setMode(journeyId);
    setSearchParams({ mode: journeyId });
  };

  // Find the user's current milestone (first unwatched item in this journey)
  const nextUpIndex = items.findIndex(item => !isWatched(item.id));

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      {/* Page Title */}
      <div className="section-header" style={{ marginBottom: '28px' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '2rem' }}>
            <ListOrdered size={26} color="var(--accent-red)" />
            Cinematic Watch Journeys
          </h1>
          <p className="section-subtitle">
            Choose your tailored viewing path through connected cinematic universes.
          </p>
        </div>
      </div>

      {/* "Choose Your Journey" Selector */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{
          fontSize: '0.8rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontWeight: 700,
          color: 'var(--text-muted)',
          marginBottom: '12px'
        }}>
          Choose Your Journey
        </div>
        <div className="order-selector">
          {JOURNEYS.map((j) => (
            <button
              key={j.id}
              type="button"
              className={`order-chip ${mode === j.id ? 'active' : ''}`}
              onClick={() => handleSelectJourney(j.id)}
            >
              {j.icon}
              <span>{j.title}</span>
            </button>
          ))}
        </div>

        {/* Selected Journey Description Banner */}
        <div style={{
          padding: '16px 20px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderLeft: '4px solid var(--accent-red)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)'
        }}>
          <strong>{JOURNEYS.find(j => j.id === mode)?.title}:</strong>{' '}
          {JOURNEYS.find(j => j.id === mode)?.desc}
        </div>
      </div>

      {/* Timeline List Visualization */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="skeleton" style={{ height: '140px', borderRadius: 'var(--radius-md)' }} />
          ))}
        </div>
      ) : (
        <div className="timeline-list">
          {items.map((item, idx) => {
            const watched = isWatched(item.id);
            const isNextUp = idx === nextUpIndex;

            // Compute order number display based on mode
            const chronoNum = item.chronologicalOrder || item.chronologicalOrderNum;
            const releaseNum = item.releaseOrder || item.releaseOrderNum;
            let orderNumberDisplay = `#${idx + 1}`;
            if (mode === 'chronological' && chronoNum) {
              orderNumberDisplay = `Chrono #${chronoNum}`;
            } else if (mode === 'release' && releaseNum) {
              orderNumberDisplay = `Release #${releaseNum}`;
            }

            return (
              <div 
                key={item.id} 
                className={`timeline-node ${watched ? 'watched' : ''}`}
              >
                {/* Visual Pin */}
                <div className="timeline-node-pin" />

                {/* Timeline Card */}
                <div 
                  className="timeline-card"
                  style={{
                    borderColor: isNextUp ? 'var(--accent-red)' : undefined,
                    boxShadow: isNextUp ? '0 0 24px rgba(225, 29, 72, 0.25)' : undefined
                  }}
                >
                  {/* Poster */}
                  <Link 
                    to={`/content/${item.id}`} 
                    style={{ flexShrink: 0, width: '90px', height: '135px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: '#111420' }}
                  >
                    <img 
                      src={item.posterUrl || getPosterFallback(item.title, item.contentType)} 
                      alt={item.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getPosterFallback(item.title, item.contentType);
                      }}
                    />
                  </Link>

                  {/* Information & Details */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      {/* Top Badges */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                        <span className="badge badge-accent" style={{ fontWeight: 700 }}>
                          {orderNumberDisplay}
                        </span>

                        {isNextUp && (
                          <span className="badge badge-warning" style={{ fontWeight: 700 }}>
                            ⭐ Up Next
                          </span>
                        )}

                        <span className="badge badge-secondary">
                          {item.contentType?.replace('_', ' ')}
                        </span>

                        {item.timelineName && (
                          <span className="badge badge-info">
                            {item.timelineName}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '4px 0 6px' }}>
                        <Link to={`/content/${item.id}`} style={{ color: '#ffffff', textDecoration: 'none' }}>
                          {item.title}
                        </Link>
                      </h3>

                      {/* Canon Metadata Row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <span>Year: <strong style={{ color: '#ffffff' }}>{item.releaseYear}</strong></span>
                        {item.runtimeMinutes && (
                          <>
                            <span>&bull;</span>
                            <span>{item.runtimeMinutes} min</span>
                          </>
                        )}
                        {item.sagaName && (
                          <>
                            <span>&bull;</span>
                            <span style={{ color: 'var(--accent-indigo)', fontWeight: 600 }}>{item.sagaName}</span>
                          </>
                        )}
                        {item.phaseName && (
                          <>
                            <span>&bull;</span>
                            <span>{item.phaseName}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Bottom Actions Row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                      marginTop: '16px',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--border-subtle)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                          type="button"
                          className={`btn ${watched ? 'btn-secondary' : 'btn-outline'} btn-sm`}
                          onClick={() => toggleWatched(item.id)}
                        >
                          <Check size={14} color={watched ? 'var(--accent-emerald)' : 'currentColor'} />
                          <span>{watched ? 'Watched' : 'Mark as Watched'}</span>
                        </button>

                        <Link to={`/content/${item.id}`} className="btn btn-ghost btn-sm">
                          <span>Details &amp; OTT Links</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Universe: <span style={{ color: 'var(--text-secondary)' }}>{item.universeName || 'Marvel MCU'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
