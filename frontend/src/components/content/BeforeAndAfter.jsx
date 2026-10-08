import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getPosterFallback } from '../../utils/imageFallback';

export default function BeforeAndAfter({ before: initialBefore, after: initialAfter, content }) {
  const before = initialBefore || content?.watchBefore || [];
  const after = initialAfter || content?.watchAfter || [];

  if ((!before || before.length === 0) && (!after || after.length === 0)) {
    return null;
  }

  return (
    <div style={{ margin: '32px 0' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>Before & After Guide</h3>
      <div className="before-after-container">
        {/* Previous / Watch Before */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>
            <ArrowLeft size={16} color="#818cf8" />
            <span>WATCH BEFORE (Prerequisites)</span>
          </div>

          {before.length === 0 ? (
            <div className="before-card" style={{ opacity: 0.7 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                None required (Great starting point!)
              </span>
            </div>
          ) : (
            before.map((item) => (
              <Link key={item.id} to={`/content/${item.relatedContentSlug || item.relatedContentId}`} className="before-card">
                <img
                  src={item.relatedContentPosterUrl || getPosterFallback(item.relatedContentTitle, item.relatedContentType)}
                  alt={item.relatedContentTitle}
                  className="rel-thumb"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getPosterFallback(item.relatedContentTitle, item.relatedContentType);
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{item.relatedContentTitle}</h5>
                    {item.isWatched && <CheckCircle2 size={14} color="#10b981" />}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {item.relatedContentType?.replace(/_/g, ' ')} ({item.relatedContentReleaseYear})
                  </div>
                  {item.notes && (
                    <div style={{ fontSize: '0.75rem', color: '#818cf8', marginTop: '2px' }}>
                      {item.notes}
                    </div>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Next / Watch After */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>
            <span>RECOMMENDED NEXT (Watch After)</span>
            <ArrowRight size={16} color="#e62429" />
          </div>

          {after.length === 0 ? (
            <div className="after-card" style={{ opacity: 0.7 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Latest entry in this timeline / arc
              </span>
            </div>
          ) : (
            after.map((item) => (
              <Link key={item.id} to={`/content/${item.relatedContentSlug || item.relatedContentId}`} className="after-card">
                <img
                  src={item.relatedContentPosterUrl || getPosterFallback(item.relatedContentTitle, item.relatedContentType)}
                  alt={item.relatedContentTitle}
                  className="rel-thumb"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getPosterFallback(item.relatedContentTitle, item.relatedContentType);
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{item.relatedContentTitle}</h5>
                    {item.isWatched && <CheckCircle2 size={14} color="#10b981" />}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {item.relatedContentType?.replace(/_/g, ' ')} ({item.relatedContentReleaseYear})
                  </div>
                  {item.notes && (
                    <div style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '2px' }}>
                      {item.notes}
                    </div>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
