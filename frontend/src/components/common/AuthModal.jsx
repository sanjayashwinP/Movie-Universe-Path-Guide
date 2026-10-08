import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldAlert, Sparkles, LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const { showSuccess, showError } = useToast();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        await register(username, email, password, displayName);
        showSuccess(`Welcome to OmniVerse, ${displayName || username}!`);
      } else {
        await login(username, password);
        showSuccess(`Welcome back, ${username}!`);
      }
      onClose();
    } catch (err) {
      showError(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-dialog" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px', border: '1px solid rgba(0, 240, 255, 0.25)', boxShadow: '0 0 35px rgba(0, 0, 0, 0.8)' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="brand-icon" style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg, #00f0ff 0%, #ff0844 100%)' }}>
              <Lock size={15} color="#ffffff" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
              {isRegister ? 'Create OmniVerse Account' : 'Sign In to OmniVerse'}
            </h3>
          </div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Security Banner */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            background: 'rgba(0, 240, 255, 0.07)',
            border: '1px solid rgba(0, 240, 255, 0.22)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            fontSize: '0.8rem',
            color: '#a5f3fc'
          }}>
            <ShieldCheck size={16} color="#00f0ff" style={{ flexShrink: 0 }} />
            <span>256-Bit Encrypted Nexus: Public registration enabled. Administrator credentials are authenticated exclusively.</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Username or Email</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. marvel_fan or admin"
                  style={{ paddingLeft: '38px' }}
                />
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
              </div>
            </div>

            {isRegister && (
              <>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      className="form-input"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tony@starkindustries.com"
                      style={{ paddingLeft: '38px' }}
                    />
                    <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Display Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Tony Stark"
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-input"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  style={{ paddingLeft: '38px' }}
                />
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{
                width: '100%',
                marginTop: '10px',
                padding: '12px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #ff0844 0%, #ff4e50 100%)',
                boxShadow: '0 4px 16px rgba(255, 8, 68, 0.4)'
              }}
            >
              {loading ? 'Authenticating...' : (
                isRegister ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <UserPlus size={16} /> Register Account
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <LogIn size={16} /> Secure Sign In
                  </span>
                )
              )}
            </button>
          </form>

          {/* Switch tab */}
          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {isRegister ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  style={{ background: 'none', border: 'none', color: '#00f0ff', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  style={{ background: 'none', border: 'none', color: '#00f0ff', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  Create one now
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
