import React, { useState, useEffect } from 'react';
import { X, Save, Film, Sparkles, Layers, GitBranch, Calendar } from 'lucide-react';
import { adminApi, franchiseApi } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

export default function ContentFormModal({ isOpen, onClose, initialData, onSaved }) {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);

  // Taxonomy options
  const [franchises, setFranchises] = useState([]);
  const [universes, setUniverses] = useState([]);
  const [timelines, setTimelines] = useState([]);
  const [sagas, setSagas] = useState([]);
  const [phases, setPhases] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    originalTitle: '',
    contentType: 'MOVIE',
    status: 'RELEASED',
    description: '',
    shortSynopsis: '',
    posterUrl: '',
    backdropUrl: '',
    releaseDate: '',
    releaseYear: new Date().getFullYear(),
    runtimeMinutes: 120,
    rating: 7.5,
    genres: 'Action, Sci-Fi, Adventure',
    productionStudio: 'Marvel Studios',
    director: '',
    writers: '',
    castMembers: '',
    postCreditScene: '',
    universeId: '',
    timelineId: '',
    sagaId: '',
    phaseId: '',
    chronologicalOrder: 1,
    releaseOrder: 1,
    timelineOrder: 1,
    isCanon: true
  });

  useEffect(() => {
    async function loadTaxonomies() {
      try {
        const [fRes, uRes, tRes, sRes, pRes] = await Promise.all([
          franchiseApi.getAll(),
          franchiseApi.getUniverses(),
          franchiseApi.getTimelines(),
          franchiseApi.getSagas(),
          franchiseApi.getPhases()
        ]);
        setFranchises(fRes.data.data || []);
        setUniverses(uRes.data.data || []);
        setTimelines(tRes.data.data || []);
        setSagas(sRes.data.data || []);
        setPhases(pRes.data.data || []);
      } catch (err) {
        console.error('Failed to load taxonomies:', err);
      }
    }
    loadTaxonomies();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        originalTitle: initialData.originalTitle || '',
        contentType: initialData.contentType || 'MOVIE',
        status: initialData.status || 'RELEASED',
        description: initialData.description || '',
        shortSynopsis: initialData.shortSynopsis || '',
        posterUrl: initialData.posterUrl || '',
        backdropUrl: initialData.backdropUrl || '',
        releaseDate: initialData.releaseDate || '',
        releaseYear: initialData.releaseYear || new Date().getFullYear(),
        runtimeMinutes: initialData.runtimeMinutes || 120,
        rating: initialData.rating || 7.5,
        genres: initialData.genres || '',
        productionStudio: initialData.productionStudio || 'Marvel Studios',
        director: initialData.director || '',
        writers: initialData.writers || '',
        castMembers: initialData.castMembers || '',
        postCreditScene: initialData.postCreditScene || '',
        universeId: initialData.universeId || '',
        timelineId: initialData.timelineId || '',
        sagaId: initialData.sagaId || '',
        phaseId: initialData.phaseId || '',
        chronologicalOrder: initialData.chronologicalOrder || 1,
        releaseOrder: initialData.releaseOrder || 1,
        timelineOrder: initialData.timelineOrder || 1,
        isCanon: initialData.isCanon !== false
      });
    } else {
      // Defaults for new entry
      setFormData({
        title: '',
        originalTitle: '',
        contentType: 'MOVIE',
        status: 'RELEASED',
        description: '',
        shortSynopsis: '',
        posterUrl: '',
        backdropUrl: '',
        releaseDate: '',
        releaseYear: new Date().getFullYear(),
        runtimeMinutes: 120,
        rating: 7.5,
        genres: 'Action, Sci-Fi',
        productionStudio: 'Marvel Studios',
        director: '',
        writers: '',
        castMembers: '',
        postCreditScene: '',
        universeId: universes[0]?.id || '',
        timelineId: timelines[0]?.id || '',
        sagaId: sagas[0]?.id || '',
        phaseId: phases[0]?.id || '',
        chronologicalOrder: 1,
        releaseOrder: 1,
        timelineOrder: 1,
        isCanon: true
      });
    }
  }, [initialData, universes, timelines, sagas, phases]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? (value ? Number(value) : '') : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedU = universes.find(u => u.id === Number(formData.universeId));
      const resolvedFranchiseId = formData.franchiseId || selectedU?.franchiseId || franchises[0]?.id || 1;

      const payload = {
        ...formData,
        franchiseId: Number(resolvedFranchiseId),
        universeId: formData.universeId ? Number(formData.universeId) : null,
        timelineId: formData.timelineId ? Number(formData.timelineId) : null,
        sagaId: formData.sagaId ? Number(formData.sagaId) : null,
        phaseId: formData.phaseId ? Number(formData.phaseId) : null
      };

      if (initialData?.id) {
        await adminApi.updateContent(initialData.id, payload);
        showSuccess(`Updated "${formData.title}" in cinematic canon!`);
      } else {
        await adminApi.createContent(payload);
        showSuccess(`Published new project "${formData.title}" to canon!`);
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      showError(err.response?.data?.message || 'Failed to save content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-dialog" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '800px', maxHeight: '92vh' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="brand-icon" style={{ width: '28px', height: '28px' }}>
              <Film size={16} color="#ffffff" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
              {initialData ? `Edit Project: ${initialData.title}` : 'Add New Cinematic Project'}
            </h3>
          </div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Section: Basic Metadata */}
          <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-red)', marginBottom: '14px' }}>
            1. Core Information
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Project Title *</label>
              <input
                type="text"
                name="title"
                required
                className="form-input"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Fantastic Four: First Steps"
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Content Type *</label>
              <select
                name="contentType"
                className="form-select"
                value={formData.contentType}
                onChange={handleChange}
              >
                <option value="MOVIE">Movie</option>
                <option value="SERIES">TV Series</option>
                <option value="LIMITED_SERIES">Limited Series</option>
                <option value="SPECIAL_PRESENTATION">Special Presentation</option>
                <option value="ANIMATED_SERIES">Animated Series</option>
                <option value="ONE_SHOT">One-Shot Short</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Status *</label>
              <select
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="RELEASED">Released</option>
                <option value="UPCOMING">Upcoming</option>
                <option value="FILMING">Filming</option>
                <option value="POST_PRODUCTION">Post-Production</option>
                <option value="PRE_PRODUCTION">Pre-Production</option>
                <option value="ANNOUNCED">Announced</option>
                <option value="DELAYED">Delayed</option>
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Release Year</label>
              <input
                type="number"
                name="releaseYear"
                className="form-input"
                value={formData.releaseYear}
                onChange={handleChange}
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Release Date</label>
              <input
                type="date"
                name="releaseDate"
                className="form-input"
                value={formData.releaseDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Section: Continuity & Hierarchy */}
          <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-indigo)', margin: '20px 0 14px' }}>
            2. Universe Hierarchy &amp; Continuity
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Cinematic Universe</label>
              <select
                name="universeId"
                className="form-select"
                value={formData.universeId}
                onChange={handleChange}
              >
                <option value="">Select Universe</option>
                {universes.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Timeline / Branch</label>
              <select
                name="timelineId"
                className="form-select"
                value={formData.timelineId}
                onChange={handleChange}
              >
                <option value="">Select Timeline</option>
                {timelines.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Saga / Major Era</label>
              <select
                name="sagaId"
                className="form-select"
                value={formData.sagaId}
                onChange={handleChange}
              >
                <option value="">Select Saga</option>
                {sagas.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Phase</label>
              <select
                name="phaseId"
                className="form-select"
                value={formData.phaseId}
                onChange={handleChange}
              >
                <option value="">Select Phase</option>
                {phases.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Section: Canon Order Numbers */}
          <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-emerald)', margin: '20px 0 14px' }}>
            3. Canon Order Placements
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Chronological Position #</label>
              <input
                type="number"
                name="chronologicalOrder"
                className="form-input"
                value={formData.chronologicalOrder}
                onChange={handleChange}
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Release Order #</label>
              <input
                type="number"
                name="releaseOrder"
                className="form-input"
                value={formData.releaseOrder}
                onChange={handleChange}
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Timeline Order #</label>
              <input
                type="number"
                name="timelineOrder"
                className="form-input"
                value={formData.timelineOrder}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Section: Artwork & URLs */}
          <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', margin: '20px 0 14px' }}>
            4. Media Artwork &amp; Synopsis
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Poster Image URL</label>
              <input
                type="text"
                name="posterUrl"
                className="form-input"
                value={formData.posterUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Backdrop Banner URL</label>
              <input
                type="text"
                name="backdropUrl"
                className="form-input"
                value={formData.backdropUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Plot Synopsis / Description</label>
            <textarea
              name="description"
              rows="3"
              className="form-textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Narrative summary..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Post-Credit Scene (Behind Spoiler-Shield)</label>
            <textarea
              name="postCreditScene"
              rows="2"
              className="form-textarea"
              value={formData.postCreditScene}
              onChange={handleChange}
              placeholder="Teaser details..."
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} />
              <span>{loading ? 'Saving...' : 'Publish to Canon'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
