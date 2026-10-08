import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Check, Bookmark, Star, Clock, Calendar, Film, 
  Tv, Sparkles, ExternalLink, ShieldAlert, ArrowLeft, Compass 
} from 'lucide-react';
import { contentApi, userTrackingApi } from '../services/api';
import { useWatch } from '../contexts/WatchContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import WhereDoesThisFit from '../components/content/WhereDoesThisFit';
import BeforeAndAfter from '../components/content/BeforeAndAfter';
import StreamingLinks from '../components/content/StreamingLinks';
import SpoilerBlock from '../components/content/SpoilerBlock';
import EpisodeTracker from '../components/content/EpisodeTracker';
import { clientDataService, normalizeContentItem } from '../services/clientDataService';
import { getDynamicReleaseInfo, formatDisplayDate } from '../services/dateTracker';
import { getPosterFallback } from '../utils/imageFallback';

export default function ContentDetailPage() {
  const { id } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchlistStatus, setWatchlistStatus] = useState(null);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [savingTracking, setSavingTracking] = useState(false);

  const { isWatched, toggleWatched } = useWatch();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    async function loadDetails() {
      setLoading(true);
      try {
        let data = null;
        try {
          const res = await contentApi.getById(id);
          data = res.data?.data;
        } catch (apiErr) {
          data = await clientDataService.getContentById(id);
        }
        setContent(data ? normalizeContentItem(data) : null);

        // Load watchlist / personal tracking if logged in
        if (user && data) {
          try {
            const wlRes = await userTrackingApi.getWatchlist();
            const entry = (wlRes.data.data || []).find(w => w.contentId === Number(id));
            if (entry) {
              setWatchlistStatus(entry.status);
              setRating(entry.rating || 0);
              setNotes(entry.notes || '');
            }
          } catch (e) {
            console.warn('Watchlist load non-fatal:', e);
          }
        }
      } catch (err) {
        console.error('Failed to load content details:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDetails();
  }, [id, user]);

  const handleWatchlistChange = async (newStatus) => {
    if (!user) {
      showError('Please sign in to save items to your personal watchlist.');
      return;
    }
    setSavingTracking(true);
    try {
      await userTrackingApi.updateWatchlist(id, {
        status: newStatus,
        rating: rating,
        notes: notes
      });
      setWatchlistStatus(newStatus);
      showSuccess(`Updated watchlist: ${newStatus.replace('_', ' ')}`);
    } catch (err) {
      showError('Failed to update watchlist entry.');
    } finally {
      setSavingTracking(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 24px' }}>
        <div className="skeleton" style={{ width: '40%', height: '40px', marginBottom: '20px' }} />
        <div className="skeleton" style={{ height: '360px', borderRadius: 'var(--radius-lg)' }} />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2>Content not found in cinematic canon</h2>
        <p style={{ color: 'var(--text-muted)' }}>The requested project ID does not exist in any timeline.</p>
        <Link to="/explore" className="btn btn-primary" style={{ marginTop: '16px' }}>
          Back to Canon Explorer
        </Link>
      </div>
    );
  }

  const watched = isWatched(content.id);
  const isSeries = ['SERIES', 'LIMITED_SERIES', 'ANIMATED_SERIES'].includes(content.contentType);

  return (
    <div className="content-detail-page">
      {/* 1. Backdrop Hero Banner */}
      <div style={{
        position: 'relative',
        minHeight: '440px',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '48px 0 32px',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border-subtle)',
        background: '#07080c'
      }}>
        {content.backdropUrl && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${content.backdropUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            filter: 'brightness(0.4)',
            zIndex: 1
          }} />
        )}
        <div className="hero-gradient-overlay" />

        <div className="container" style={{ position: 'relative', zIndex: 3, display: 'flex', gap: '36px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          {/* Poster */}
          <div style={{
            width: '200px',
            aspectRatio: '2 / 3',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            backgroundColor: '#111420',
            border: '2px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8)',
            flexShrink: 0
          }}>
            <img 
              src={(!content.posterUrl || content.posterUrl.includes('unsplash.com')) ? getPosterFallback(content.title) : content.posterUrl} 
              alt={content.title} 
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = getPosterFallback(content.title);
              }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>

          {/* Core Info */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            {(() => {
              const dynamicInfo = getDynamicReleaseInfo(content.releaseDate, content.status);
              return (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  <span className={`badge ${dynamicInfo.badgeClass}`}>
                    {dynamicInfo.isReleased ? 'Released' : (dynamicInfo.daysUntil ? `${dynamicInfo.daysUntil} Days Left` : 'Upcoming')}
                  </span>
                  <span className="badge badge-accent">{content.contentType?.replace('_', ' ')}</span>
                  <span className="badge badge-primary">{content.universeName || 'Marvel MCU'}</span>
                  {content.phaseName && <span className="badge badge-secondary">{content.phaseName}</span>}
                  {content.releaseDate && (
                    <span className="badge badge-info" style={{ textTransform: 'none' }}>
                      📅 {formatDisplayDate(content.releaseDate)}
                    </span>
                  )}
                </div>
              );
            })()}

            <h1 style={{ fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.15, margin: '6px 0 12px' }}>
              {content.title}
            </h1>

            {content.originalTitle && content.originalTitle !== content.title && (
              <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                Original Title: {content.originalTitle}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              <span style={{ fontWeight: 600, color: '#ffffff' }}>{content.releaseYear}</span>
              {content.runtimeMinutes && (
                <>
                  <span>&bull;</span>
                  <span>{content.runtimeMinutes} min</span>
                </>
              )}
              {content.rating && (
                <>
                  <span>&bull;</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-amber)', fontWeight: 700 }}>
                    <Star size={15} fill="currentColor" /> {content.rating} / 10
                  </span>
                </>
              )}
              {content.genres && (
                <>
                  <span>&bull;</span>
                  <span>{content.genres}</span>
                </>
              )}
            </div>

            {/* Primary Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className={`btn ${watched ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => toggleWatched(content.id)}
              >
                <Check size={18} color={watched ? 'var(--accent-emerald)' : 'currentColor'} />
                <span>{watched ? 'Watched' : 'Mark as Watched'}</span>
              </button>

              {/* Watchlist Status Selector */}
              <select
                className="form-select"
                value={watchlistStatus || ''}
                onChange={(e) => handleWatchlistChange(e.target.value)}
                style={{ width: 'auto', padding: '10px 16px', background: 'rgba(255, 255, 255, 0.08)' }}
              >
                <option value="">+ Add to Watchlist</option>
                <option value="WANT_TO_WATCH">Want to Watch</option>
                <option value="WATCHING">Currently Watching</option>
                <option value="WATCHED">Completed</option>
                <option value="DROPPED">Dropped</option>
              </select>

              {/* View Full Roadmap From Scratch */}
              <Link
                to={`/roadmap?slug=${content.slug || content.id}`}
                className="btn btn-outline"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)' }}
              >
                <Compass size={17} />
                <span>Path to This Movie</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Dossier Layout */}
      <div className="container" style={{ padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px' }}>
          {/* Main Column */}
          <div>
            {/* Synopsis */}
            <section style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>Storyline &amp; Synopsis</h3>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#cbd5e1' }}>
                {content.description || content.shortSynopsis || 'No plot synopsis provided.'}
              </p>
            </section>

            {/* "Where Does This Fit?" Essential Canon Section */}
            <WhereDoesThisFit content={content} />

            {/* "Before and After" Prerequisites & Recommended Next Watch */}
            <BeforeAndAfter content={content} />

            {/* Episode Tracker (if Series) */}
            {isSeries && (
              <EpisodeTracker 
                contentId={content.id} 
                seasons={content.seasons || []} 
              />
            )}

            {/* Post-Credit Scenes (Spoiler Shielded) */}
            {content.postCreditScene && (
              <section style={{ marginTop: '36px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>
                  Post-Credit Scene &amp; Multiverse Teaser
                </h3>
                <SpoilerBlock 
                  title="Mid / Post-Credit Scene Details"
                  content={content.postCreditScene} 
                />
              </section>
            )}
          </div>

          {/* Sidebar Column */}
          <div>
            {/* Official OTT Streaming Links */}
            <StreamingLinks platforms={content.platforms} />

            {/* Studio / Crew Credits */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              marginBottom: '24px'
            }}>
              <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ffffff', marginBottom: '14px' }}>
                Production Dossier
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
                {content.director && (
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Director:</span>
                    <strong style={{ color: '#ffffff' }}>{content.director}</strong>
                  </div>
                )}
                {content.writers && (
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Screenplay:</span>
                    <strong style={{ color: '#ffffff' }}>{content.writers}</strong>
                  </div>
                )}
                {content.productionStudio && (
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Studio:</span>
                    <strong style={{ color: '#ffffff' }}>{content.productionStudio}</strong>
                  </div>
                )}
                {content.castMembers && (
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Starring:</span>
                    <strong style={{ color: '#ffffff' }}>{content.castMembers}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Personal Notes / Rating (if user logged in) */}
            {user && (
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-md)',
                padding: '20px'
              }}>
                <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ffffff', marginBottom: '14px' }}>
                  Personal Canon Notes
                </h4>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Your Rating (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="form-input"
                    value={rating || ''}
                    onChange={(e) => setRating(Number(e.target.value))}
                    placeholder="e.g. 9"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Personal Notes</label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Memories, timeline theories, thoughts..."
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%' }}
                  disabled={savingTracking}
                  onClick={() => handleWatchlistChange(watchlistStatus || 'WANT_TO_WATCH')}
                >
                  Save Personal Notes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
