import React from 'react';
import ContentCard from './ContentCard';
import { Film } from 'lucide-react';

export default function ContentGrid({ 
  items, 
  contents = [], 
  loading = false, 
  orderType = 'release', 
  emptyMessage = 'No cinematic content found matching your criteria.' 
}) {
  const contentList = items || contents || [];

  if (loading) {
    return (
      <div className="content-grid">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="content-card" style={{ height: '360px' }}>
            <div className="skeleton" style={{ width: '100%', height: '260px' }} />
            <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="skeleton" style={{ width: '80%', height: '16px' }} />
              <div className="skeleton" style={{ width: '40%', height: '12px' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!contentList || contentList.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', margin: '30px 0' }}>
        <Film size={48} color="#64748b" style={{ margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', color: '#ffffff' }}>No Content Found</h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto', fontSize: '0.95rem' }}>
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="content-grid">
      {contentList.map((item) => (
        <ContentCard key={item.id} content={item} orderType={orderType} />
      ))}
    </div>
  );
}
