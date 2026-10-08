import React from 'react';
import { Link } from 'react-router-dom';
import { Film, ShieldCheck, ExternalLink, GitBranch, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      marginTop: 'auto',
      borderTop: '1px solid var(--border-subtle)',
      background: 'rgba(7, 8, 12, 0.95)',
      padding: '48px 0 32px'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '36px',
          marginBottom: '40px'
        }}>
          {/* Brand Info */}
          <div>
            <div className="brand" style={{ marginBottom: '14px' }}>
              <div className="brand-icon" style={{ background: 'linear-gradient(135deg, #00f0ff 0%, #ff0844 100%)', boxShadow: '0 0 14px rgba(0, 240, 255, 0.35)' }}>
                <Film size={18} color="#ffffff" />
              </div>
              <span>OmniVerse<span className="brand-dot" style={{ color: '#00f0ff' }}>.</span></span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '16px' }}>
              The definitive Multiverse Nexus & continuity canon tracker. Seamlessly navigate Marvel phases, official release orders, and timelines.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <ShieldCheck size={14} color="var(--accent-emerald)" />
              <span>100% Legal Metadata & Official OTT Links Only</span>
            </div>
          </div>

          {/* Universes & Franchises */}
          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ffffff', marginBottom: '16px' }}>
              Cinematic Universes
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
              <li>
                <Link to="/explore?franchise=marvel" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                  Marvel Cinematic Universe (MCU)
                </Link>
              </li>
              <li>
                <Link to="/explore?franchise=star-wars" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                  Star Wars Canon
                </Link>
              </li>
              <li>
                <Link to="/explore?franchise=dc" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                  DC Universe (DCU)
                </Link>
              </li>
              <li>
                <Link to="/timelines" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <GitBranch size={14} /> Branching Multiverse Map
                </Link>
              </li>
            </ul>
          </div>

          {/* Watch Orders */}
          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ffffff', marginBottom: '16px' }}>
              Watch Journeys
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
              <li>
                <Link to="/watch-orders?mode=chronological" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                  Chronological Story Order
                </Link>
              </li>
              <li>
                <Link to="/watch-orders?mode=release" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                  Theatrical Release Order
                </Link>
              </li>
              <li>
                <Link to="/watch-orders?mode=sacred" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                  Sacred Timeline Strict Order
                </Link>
              </li>
              <li>
                <Link to="/sagas" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} /> Infinity Saga & Multiverse Saga
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / OTT Disclaimer */}
          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ffffff', marginBottom: '16px' }}>
              Legal Disclaimer
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.5 }}>
              OmniVerse does not host, stream, or distribute video media. All posters, synopses, and trademarks are copyright of their respective production studios (Marvel Studios, Disney, Lucasfilm, DC Studios / Warner Bros. Discovery). OTT redirects link solely to verified official platforms (Disney+, Netflix, Max).
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            &copy; {new Date().getFullYear()} OmniVerse Multiverse Platform. Engineered for Multiverse Explorers.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Generic Franchise Architecture v1.0</span>
            <span>&bull;</span>
            <span>Spring Boot 3 + React</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
