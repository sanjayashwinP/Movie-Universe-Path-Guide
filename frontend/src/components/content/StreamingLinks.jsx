import React from 'react';
import { ExternalLink, Tv } from 'lucide-react';

export default function StreamingLinks({ platforms: initialPlatforms, streamingPlatforms, content }) {
  const platforms = initialPlatforms || streamingPlatforms || content?.streamingPlatforms || content?.platforms || [];
  if (!platforms || platforms.length === 0) return null;

  return (
    <div style={{ margin: '24px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
        <Tv size={16} color="#38bdf8" />
        <span>AVAILABLE ON OFFICIAL STREAMING</span>
      </div>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {platforms.map((p) => (
          <a
            key={p.id}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{
              padding: '8px 16px',
              fontSize: '0.85rem',
              borderColor: p.platformBrandColor ? `${p.platformBrandColor}66` : 'var(--border-card)',
              background: p.platformBrandColor ? `${p.platformBrandColor}1a` : 'rgba(255, 255, 255, 0.05)'
            }}
          >
            <span style={{ fontWeight: 700, color: p.platformBrandColor || '#ffffff' }}>
              {p.platformName}
            </span>
            {p.quality && (
              <span className="badge badge-gray" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                {p.quality}
              </span>
            )}
            <ExternalLink size={14} style={{ opacity: 0.7 }} />
          </a>
        ))}
      </div>
    </div>
  );
}
