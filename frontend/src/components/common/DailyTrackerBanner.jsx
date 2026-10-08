import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Flame, Sparkles, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { formatCurrentDate, calculateLiveCountdown } from '../../services/dateTracker';

export default function DailyTrackerBanner({ compact = false }) {
  const [currentDateStr, setCurrentDateStr] = useState(formatCurrentDate());
  // Countdown to Avengers: Doomsday (Dec 18, 2026)
  const [countdown, setCountdown] = useState(calculateLiveCountdown('2026-12-18'));
  // Countdown to VisionQuest (Oct 14, 2026)
  const [visionCountdown, setVisionCountdown] = useState(calculateLiveCountdown('2026-10-14'));

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateLiveCountdown('2026-12-18'));
      setVisionCountdown(calculateLiveCountdown('2026-10-14'));
      setCurrentDateStr(formatCurrentDate());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(10, 12, 22, 0.95) 0%, rgba(20, 24, 45, 0.88) 50%, rgba(10, 12, 22, 0.95) 100%)',
      borderBottom: '1px solid rgba(0, 240, 255, 0.2)',
      backdropFilter: 'blur(20px)',
      padding: compact ? '8px 0' : '10px 0',
      position: 'relative',
      zIndex: 40,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
    }}>
      <div className="container" style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        {/* Left: Current Date & Daily Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.06)',
            padding: '5px 12px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }}>
            <span className="pulse-dot pulse-dot-emerald" />
            <Calendar size={13} color="var(--accent-emerald)" />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.02em', color: '#ffffff' }}>
              {currentDateStr}
            </span>
          </div>

          {/* Immediate 7-Day Alert: VisionQuest on Oct 14 */}
          <Link to="/content/visionquest" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
              border: '1px solid rgba(0, 240, 255, 0.5)',
              borderRadius: 'var(--radius-full)',
              color: '#00f0ff',
              fontSize: '0.72rem',
              fontWeight: 800,
              boxShadow: '0 0 12px rgba(0, 240, 255, 0.25)',
              letterSpacing: '0.02em'
            }}>
              <Zap size={12} fill="#00f0ff" />
              <span>VisionQuest: Disney+ Premiere in 7 Days (Oct 14, 2026)</span>
            </span>
          </Link>

          {/* Spidey & F4 Status Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="hidden-mobile">
            <span className="badge badge-emerald" style={{ fontSize: '0.68rem', padding: '3px 8px' }}>
              <CheckCircle2 size={11} /> Spidey Brand New Day: Now in Theaters (Sep 30)
            </span>
            <span className="badge badge-info" style={{ fontSize: '0.68rem', padding: '3px 8px' }}>
              Fantastic Four: Released
            </span>
          </div>
        </div>

        {/* Right: Live Countdown to Avengers: Doomsday & Beginner Guide CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--accent-amber)'
            }}>
              <Flame size={14} color="var(--accent-amber)" />
              <span className="hidden-mobile">Doomsday (Dec 18):</span>
            </span>

            {/* Countdown digits */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              <div style={{
                background: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                padding: '2px 5px',
                borderRadius: '4px',
                color: '#fbbf24'
              }}>
                {String(countdown.days).padStart(2, '0')}d
              </div>
              <span style={{ color: 'var(--text-muted)' }}>:</span>
              <div style={{
                background: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                padding: '2px 5px',
                borderRadius: '4px',
                color: '#fbbf24'
              }}>
                {String(countdown.hours).padStart(2, '0')}h
              </div>
              <span style={{ color: 'var(--text-muted)' }}>:</span>
              <div style={{
                background: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                padding: '2px 5px',
                borderRadius: '4px',
                color: '#fbbf24'
              }}>
                {String(countdown.minutes).padStart(2, '0')}m
              </div>
              <span style={{ color: 'var(--text-muted)' }}>:</span>
              <div style={{
                background: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                padding: '2px 5px',
                borderRadius: '4px',
                color: '#fbbf24'
              }}>
                {String(countdown.seconds).padStart(2, '0')}s
              </div>
            </div>
          </div>

          <Link
            to="/starter-guide"
            className="btn btn-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(230, 36, 41, 0.3) 0%, rgba(99, 102, 241, 0.3) 100%)',
              border: '1px solid rgba(230, 36, 41, 0.5)',
              color: '#ffffff',
              padding: '4px 10px',
              fontSize: '0.74rem',
              fontWeight: 700,
              gap: '4px',
              boxShadow: '0 0 10px rgba(230, 36, 41, 0.25)'
            }}
          >
            <Sparkles size={12} color="#00f0ff" />
            <span>New to Marvel? Start Here</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
