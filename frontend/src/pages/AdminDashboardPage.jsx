import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Film, Tv, Plus, Edit, Trash2, CheckCircle, 
  XCircle, Clock, RefreshCw, Layers, GitBranch, Sparkles, Eye 
} from 'lucide-react';
import { adminApi, contentApi, statsApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import ContentFormModal from '../components/admin/ContentFormModal';
import { getPosterFallback } from '../utils/imageFallback';

export default function AdminDashboardPage() {
  const { user, isAdmin } = useAuth();
  const { showSuccess, showError } = useToast();

  const [activeTab, setActiveTab] = useState('CONTENT'); // CONTENT, SYNC, AUDIT
  const [stats, setStats] = useState(null);
  const [contentList, setContentList] = useState([]);
  const [pendingChanges, setPendingChanges] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Content table search/filter
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    if (isAdmin) {
      loadAllAdminData();
    }
  }, [isAdmin]);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, contentRes, changesRes, auditRes] = await Promise.all([
        adminApi.getDashboardStats(),
        contentApi.getAll({ size: 100 }),
        adminApi.getPendingChanges(),
        adminApi.getAuditLogs({ size: 50 })
      ]);

      setStats(statsRes.data.data);
      setContentList(contentRes.data.data.content || []);
      setPendingChanges(changesRes.data.data || []);
      setAuditLogs(auditRes.data.data.content || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      showError('Failed to load administrative records.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContent = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.title}" from the canon database?`)) {
      return;
    }

    try {
      await adminApi.deleteContent(item.id);
      showSuccess(`Deleted "${item.title}"`);
      setContentList(contentList.filter(c => c.id !== item.id));
    } catch (err) {
      showError('Failed to delete content');
    }
  };

  const handleApproveChange = async (changeId) => {
    try {
      await adminApi.approveChange(changeId);
      showSuccess('Pending change approved and published to canon!');
      loadAllAdminData();
    } catch (err) {
      showError('Failed to approve change');
    }
  };

  const handleRejectChange = async (changeId) => {
    try {
      await adminApi.rejectChange(changeId);
      showSuccess('Pending change rejected.');
      loadAllAdminData();
    } catch (err) {
      showError('Failed to reject change');
    }
  };

  const filteredContent = contentList.filter(c => 
    c.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.universeName?.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.contentType?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <ShieldAlert size={48} color="var(--accent-red)" style={{ marginBottom: '16px' }} />
        <h2>Restricted Administrator Portal</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          You must be logged in with an authorized ADMIN account to manage cinematic canon.
        </p>
        <div style={{ display: 'inline-block', padding: '12px 20px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem' }}>
          Tip: Click "Sign In" in the navbar and use the <strong>⚡ 1-Click Demo Admin</strong> account!
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      {/* Title */}
      <div className="section-header" style={{ marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-warning" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
              RESTRICTED RBAC
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Logged in as: <strong>{user?.username}</strong>
            </span>
          </div>
          <h1 className="section-title" style={{ fontSize: '2rem' }}>
            <ShieldAlert size={26} color="var(--accent-amber)" />
            OmniVerse Admin &amp; Canon Governance
          </h1>
          <p className="section-subtitle">
            Universal content CRUD, external data synchronization, and security audit logs.
          </p>
        </div>

        <button 
          type="button" 
          className="btn btn-primary"
          onClick={() => { setEditingItem(null); setFormModalOpen(true); }}
        >
          <Plus size={16} />
          <span>Add New Project</span>
        </button>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '36px'
        }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)', padding: '18px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Projects</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '4px', color: '#ffffff' }}>{stats.totalContent}</div>
          </div>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)', padding: '18px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Movies</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '4px', color: 'var(--accent-red)' }}>{stats.totalMovies}</div>
          </div>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)', padding: '18px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Series &amp; Specials</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '4px', color: 'var(--accent-indigo)' }}>{stats.totalSeries}</div>
          </div>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)', padding: '18px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Upcoming Slate</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '4px', color: 'var(--accent-amber)' }}>{stats.totalUpcoming}</div>
          </div>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)', padding: '18px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Pending Changes</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '4px', color: pendingChanges.length > 0 ? 'var(--accent-amber)' : 'var(--accent-emerald)' }}>
              {pendingChanges.length}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', marginBottom: '28px' }}>
        <button
          type="button"
          className={`order-chip ${activeTab === 'CONTENT' ? 'active' : ''}`}
          onClick={() => setActiveTab('CONTENT')}
        >
          <Film size={16} />
          <span>Manage Content ({contentList.length})</span>
        </button>

        <button
          type="button"
          className={`order-chip ${activeTab === 'SYNC' ? 'active' : ''}`}
          onClick={() => setActiveTab('SYNC')}
        >
          <RefreshCw size={16} />
          <span>Pending Data Sync ({pendingChanges.length})</span>
        </button>

        <button
          type="button"
          className={`order-chip ${activeTab === 'AUDIT' ? 'active' : ''}`}
          onClick={() => setActiveTab('AUDIT')}
        >
          <Clock size={16} />
          <span>Audit Logs ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: CONTENT MANAGEMENT */}
      {activeTab === 'CONTENT' && (
        <div>
          {/* Search bar */}
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search content by title, universe, or type..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              style={{ maxWidth: '400px' }}
            />
          </div>

          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-card)',
            borderRadius: 'var(--radius-md)',
            overflowX: 'auto'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255, 255, 255, 0.02)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '14px 16px' }}>Project</th>
                  <th style={{ padding: '14px 16px' }}>Type</th>
                  <th style={{ padding: '14px 16px' }}>Universe &amp; Timeline</th>
                  <th style={{ padding: '14px 16px' }}>Saga / Phase</th>
                  <th style={{ padding: '14px 16px' }}>Release</th>
                  <th style={{ padding: '14px 16px' }}>Status</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContent.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '52px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', backgroundColor: '#111420', flexShrink: 0 }}>
                          <img 
                            src={item.posterUrl || getPosterFallback(item.title, item.contentType)} 
                            alt={item.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = getPosterFallback(item.title, item.contentType);
                            }}
                          />
                        </div>
                        <div>
                          <strong style={{ color: '#ffffff', display: 'block' }}>{item.title}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Chrono #{item.chronologicalOrder || '-'} &bull; Rel #{item.releaseOrder || '-'}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                        {item.contentType?.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div>{item.universeName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.timelineName || 'Sacred Timeline'}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div>{item.sagaName || '-'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.phaseName || '-'}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                      {item.releaseYear}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge ${item.status === 'RELEASED' ? 'badge-primary' : 'badge-warning'}`} style={{ fontSize: '0.7rem' }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '6px' }}
                          title="Edit Project"
                          onClick={() => { setEditingItem(item); setFormModalOpen(true); }}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '6px', color: 'var(--accent-red)' }}
                          title="Delete Project"
                          onClick={() => handleDeleteContent(item)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PENDING DATA SYNCHRONIZATION */}
      {activeTab === 'SYNC' && (
        <div>
          {/* Automated Live Radar Ingestion Banner */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.12) 0%, rgba(99, 102, 241, 0.15) 100%)',
            border: '1px solid rgba(0, 240, 255, 0.35)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 0 24px rgba(0, 240, 255, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="pulse-dot pulse-dot-emerald" />
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#00f0ff', letterSpacing: '0.04em' }}>
                    AUTOMATED MULTIVERSE RADAR ENGINE
                  </span>
                  <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>ACTIVE BACKGROUND LISTENER</span>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 6px', color: '#ffffff' }}>
                  Future Projects Auto-Discovery & Ingestion
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0, maxWidth: '640px' }}>
                  Continuously scans official Marvel Studios, Disney+, and Sony slate disclosures. Any newly announced film, series, or special is automatically ingested with official posters, canonical metadata, and timeline linkages without manual database work.
                </p>
              </div>

              <button
                type="button"
                className="btn btn-arc"
                onClick={() => {
                  import('../services/radarSyncService').then(mod => {
                    const res = mod.runAutomatedRadarSync();
                    showSuccess(`Auto-Radar Scan Complete! Discovered ${res.totalDiscovered} total future projects.`);
                    loadAllAdminData();
                  });
                }}
                style={{ padding: '12px 20px', fontWeight: 700 }}
              >
                <RefreshCw size={16} />
                <span>Scan & Ingest Newly Announced Projects</span>
              </button>
            </div>
          </div>

          <div style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: 'var(--radius-md)', marginBottom: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <strong>Human-in-the-Loop Safeguard:</strong> Changes detected from official sources (e.g. Marvel.com, Disney announcements) must be verified and approved by an administrator before appearing publicly.
          </div>

          {pendingChanges.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)', color: 'var(--text-muted)' }}>
              <CheckCircle size={36} color="var(--accent-emerald)" style={{ marginBottom: '12px' }} />
              <h3>All External Data in Sync</h3>
              <p>No pending release date shifts or new project alerts require review.</p>
            </div>
          ) : (
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255, 255, 255, 0.02)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '14px 16px' }}>Detected Project</th>
                    <th style={{ padding: '14px 16px' }}>Proposed Change</th>
                    <th style={{ padding: '14px 16px' }}>Previous Value</th>
                    <th style={{ padding: '14px 16px' }}>New Value</th>
                    <th style={{ padding: '14px 16px' }}>Official Source</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right' }}>Review Decision</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingChanges.map(change => (
                    <tr key={change.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#ffffff' }}>
                        {change.proposedData?.title || 'Unknown Project'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                          {change.changeType}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                        {change.previousValue || '(None)'}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                        {change.newValue}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Official Studio Announcement
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleApproveChange(change.id)}
                            style={{ color: 'var(--accent-emerald)', borderColor: 'var(--accent-emerald)' }}
                          >
                            <CheckCircle size={14} /> Approve
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleRejectChange(change.id)}
                            style={{ color: 'var(--accent-red)' }}
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeTab === 'AUDIT' && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255, 255, 255, 0.02)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '14px 16px' }}>Timestamp</th>
                <th style={{ padding: '14px 16px' }}>Admin</th>
                <th style={{ padding: '14px 16px' }}>Action</th>
                <th style={{ padding: '14px 16px' }}>Entity</th>
                <th style={{ padding: '14px 16px' }}>Entity ID</th>
                <th style={{ padding: '14px 16px' }}>Details / Diff</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {log.createdAt}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#ffffff' }}>
                    {log.username}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${log.action === 'CREATE' ? 'badge-accent' : (log.action === 'DELETE' ? 'badge-secondary' : 'badge-info')}`} style={{ fontSize: '0.7rem' }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                    {log.entityName}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                    #{log.entityId}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {log.details || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Content Form Modal */}
      <ContentFormModal
        isOpen={formModalOpen}
        onClose={() => { setFormModalOpen(false); setEditingItem(null); }}
        initialData={editingItem}
        onSaved={loadAllAdminData}
      />
    </div>
  );
}
