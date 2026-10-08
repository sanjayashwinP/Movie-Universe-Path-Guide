import React from 'react';
import { Compass, GitBranch, Layers, Calendar, Clock, Film } from 'lucide-react';

export default function WhereDoesThisFit({ fitData: initialFitData, content }) {
  const fitData = initialFitData || content?.whereDoesThisFit || content;
  if (!fitData) return null;

  return (
    <div className="where-does-this-fit-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <Compass size={22} color="#818cf8" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Where Does This Fit?</h3>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
        {fitData.contextExplanation || 'Chronological and universe continuum placement details.'}
      </p>

      <div className="fit-grid">
        <div className="fit-item">
          <div className="fit-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={14} color="#6366f1" /> Franchise
          </div>
          <div className="fit-val">{fitData.franchiseName}</div>
        </div>

        <div className="fit-item">
          <div className="fit-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Compass size={14} color="#38bdf8" /> Universe
          </div>
          <div className="fit-val">
            {fitData.universeName}
            {fitData.universeDesignation && (
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', fontWeight: 400 }}>
                {fitData.universeDesignation}
              </span>
            )}
          </div>
        </div>

        <div className="fit-item">
          <div className="fit-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <GitBranch size={14} color="#a855f7" /> Timeline
          </div>
          <div className="fit-val">
            {fitData.timelineName}
            {fitData.isMainTimeline && (
              <span className="badge badge-emerald" style={{ fontSize: '0.65rem', marginLeft: '6px' }}>
                Main Canon
              </span>
            )}
          </div>
        </div>

        <div className="fit-item">
          <div className="fit-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Film size={14} color="#f59e0b" /> Saga & Phase
          </div>
          <div className="fit-val">
            {fitData.sagaName}
            {fitData.phaseName && (
              <span style={{ fontSize: '0.75rem', color: '#fbbf24', display: 'block', fontWeight: 400 }}>
                {fitData.phaseName}
              </span>
            )}
          </div>
        </div>

        <div className="fit-item">
          <div className="fit-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} color="#10b981" /> Chronological Order
          </div>
          <div className="fit-val font-mono" style={{ color: '#34d399' }}>
            {fitData.chronologicalOrderNum ? `#${fitData.chronologicalOrderNum}` : 'Branch Timeline'}
          </div>
        </div>

        <div className="fit-item">
          <div className="fit-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} color="#e62429" /> Release Order
          </div>
          <div className="fit-val font-mono" style={{ color: '#ff5257' }}>
            {fitData.releaseOrderNum ? `#${fitData.releaseOrderNum}` : 'TBA'}
          </div>
        </div>
      </div>
    </div>
  );
}
