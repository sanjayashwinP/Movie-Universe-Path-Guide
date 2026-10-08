import React, { useState } from 'react';
import { Eye, EyeOff, ShieldAlert } from 'lucide-react';

export default function SpoilerBlock({ title = 'Spoiler Alert', warning = 'This section contains major canonical plot details or post-credit timeline reveals.', children }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="spoiler-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f43f5e', fontWeight: 600, fontSize: '0.9rem' }}>
          <ShieldAlert size={16} />
          <span>{title}</span>
        </div>
        <button
          type="button"
          onClick={() => setRevealed(!revealed)}
          className="btn btn-sm btn-secondary"
          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
        >
          {revealed ? (
            <>
              <EyeOff size={12} /> Hide Spoilers
            </>
          ) : (
            <>
              <Eye size={12} /> Reveal Spoilers
            </>
          )}
        </button>
      </div>

      <div style={{ position: 'relative' }}>
        <div className={revealed ? 'spoiler-revealed' : 'spoiler-blur'}>
          {children}
        </div>

        {!revealed && (
          <div className="spoiler-overlay-button" style={{ textAlign: 'center', width: '100%' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>
              {warning}
            </p>
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="btn btn-sm btn-primary"
            >
              <Eye size={14} /> Reveal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
