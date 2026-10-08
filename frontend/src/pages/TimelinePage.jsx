import React, { useState, useEffect } from 'react';
import { GitBranch, Sparkles, Film, ArrowRight, Check } from 'lucide-react';
import { franchiseApi, contentApi } from '../services/api';
import { clientDataService, normalizeContentItem } from '../services/clientDataService';
import { getPosterFallback } from '../utils/imageFallback';
import { Link } from 'react-router-dom';
import { useWatch } from '../contexts/WatchContext';

export default function TimelinePage() {
  const [timelines, setTimelines] = useState([]);
  const [timelineContent, setTimelineContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTimelineId, setActiveTimelineId] = useState(null);

  const { isWatched } = useWatch();

  useEffect(() => {
    async function loadTimelinesAndContent() {
      setLoading(true);
      try {
        let list = [];
        try {
          const tRes = await franchiseApi.getTimelines();
          list = tRes.data?.data || [];
        } catch (tErr) {
          list = await clientDataService.getTimelines();
        }
        setTimelines(list);
        if (list.length > 0) {
          setActiveTimelineId(list[0].id);
        }

        // Fetch all content to group by timeline
        let allContent = [];
        try {
          const cRes = await contentApi.getAll({ size: 100 });
          const raw = cRes.data?.data?.content || (Array.isArray(cRes.data?.data) ? cRes.data?.data : []);
          allContent = raw.map(normalizeContentItem);
        } catch (cErr) {
          allContent = await clientDataService.getAllContent();
        }

        if (allContent.length === 0) {
          allContent = await clientDataService.getAllContent();
        }

        const grouped = {};
        allContent.forEach(item => {
          const tName = item.timelineName || 'Unassigned';
          if (!grouped[tName]) grouped[tName] = [];
          grouped[tName].push(item);
        });

        // Sort items inside timeline by timelineOrder or chronologicalOrder
        Object.keys(grouped).forEach(k => {
          grouped[k].sort((a, b) => (a.timelineOrder || a.chronologicalOrder || 999) - (b.timelineOrder || b.chronologicalOrder || 999));
        });

        setTimelineContent(grouped);
      } catch (err) {
        console.error('Failed to load timelines:', err);
      } finally {
        setLoading(false);
      }
    }

    loadTimelinesAndContent();
  }, []);

  const activeTimeline = timelines.find(t => t.id === activeTimelineId);
  const activeItems = activeTimeline ? (timelineContent[activeTimeline.name] || []) : [];

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      {/* Title */}
      <div className="section-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '2rem' }}>
            <GitBranch size={26} color="var(--accent-red)" />
            Multiverse &amp; Branching Timelines
          </h1>
          <p className="section-subtitle">
            Explore core canon and nexus branch timelines across the connected multiverse.
          </p>
        </div>
      </div>

      {/* Visual Branching Architecture Schematic */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.4) 0%, rgba(13, 15, 24, 0.9) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        marginBottom: '40px',
        overflowX: 'auto'
      }}>
        <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '16px' }}>
          Multiverse Branch Topology
        </div>

        {/* Conceptual diagram */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          minWidth: '600px',
          fontFamily: 'monospace',
          fontSize: '0.85rem'
        }}>
          {/* Main Trunk */}
          <div style={{
            padding: '16px 20px',
            background: 'rgba(225, 29, 72, 0.15)',
            border: '1px solid var(--accent-red)',
            borderRadius: 'var(--radius-md)',
            color: '#ffffff'
          }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-red)' }}>Sacred Timeline (MCU 616)</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Iron Man &rarr; Endgame &rarr; Secret Wars</div>
          </div>

          <div style={{ color: 'var(--text-muted)' }}>&rarr;</div>

          {/* Nexus Point */}
          <div style={{
            padding: '12px 16px',
            background: 'rgba(99, 102, 241, 0.2)',
            border: '1px dashed var(--accent-indigo)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center'
          }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-indigo)' }}>2012 Time Heist (Nexus Event)</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Tesseract stolen by Loki</div>
          </div>

          <div style={{ color: 'var(--text-muted)' }}>&rarr;</div>

          {/* Branches */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{
              padding: '10px 16px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid var(--accent-emerald)',
              borderRadius: 'var(--radius-md)'
            }}>
              <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>Loki 2012 Branch</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '8px' }}>TVA &amp; Yggdrasil Loom</span>
            </div>
            <div style={{
              padding: '10px 16px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid var(--accent-amber)',
              borderRadius: 'var(--radius-md)'
            }}>
              <span style={{ fontWeight: 700, color: 'var(--accent-amber)' }}>What If...? Alternates</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '8px' }}>Captain Carter &amp; Infinite Ultron</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Selection Tabs */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '28px' }}>
        {timelines.map(t => (
          <button
            key={t.id}
            type="button"
            className={`order-chip ${activeTimelineId === t.id ? 'active' : ''}`}
            onClick={() => setActiveTimelineId(t.id)}
          >
            <GitBranch size={16} />
            <span>{t.name}</span>
            {t.isMainTimeline && (
              <span className="badge badge-accent" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>Main</span>
            )}
          </button>
        ))}
      </div>

      {/* Active Timeline Details & Chronological Flow */}
      {activeTimeline && (
        <div>
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-card)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
                {activeTimeline.name}
              </h2>
              {activeTimeline.isMainTimeline ? (
                <span className="badge badge-accent">Canonical Main Timeline</span>
              ) : (
                <span className="badge badge-warning">Branch / Alternate Universe</span>
              )}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
              {activeTimeline.description || 'Timeline continuity sequence and canon milestones.'}
            </p>
          </div>

          {/* Timeline Projects List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeItems.length === 0 ? (
              <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No projects assigned to this timeline yet.
              </div>
            ) : (
              activeItems.map((item, idx) => {
                const watched = isWatched(item.id);
                return (
                  <div
                    key={item.id}
                    className="timeline-card"
                    style={{ alignItems: 'center' }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: watched ? 'var(--accent-emerald)' : 'rgba(255, 255, 255, 0.08)',
                      color: watched ? '#07080c' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      flexShrink: 0
                    }}>
                      {watched ? <Check size={18} /> : (idx + 1)}
                    </div>

                    <Link 
                      to={`/content/${item.id}`}
                      style={{
                        width: '60px',
                        height: '90px',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        backgroundColor: '#111420',
                        flexShrink: 0
                      }}
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

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                          {item.contentType?.replace('_', ' ')}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {item.releaseYear}
                        </span>
                        {item.phaseName && (
                          <span style={{ fontSize: '0.8rem', color: 'var(--accent-indigo)' }}>
                            {item.phaseName}
                          </span>
                        )}
                      </div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '2px 0 6px' }}>
                        <Link to={`/content/${item.id}`} style={{ color: '#ffffff', textDecoration: 'none' }}>
                          {item.title}
                        </Link>
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.shortSynopsis || item.description}
                      </p>
                    </div>

                    <Link to={`/content/${item.id}`} className="btn btn-ghost btn-sm">
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
