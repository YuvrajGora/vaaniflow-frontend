import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Info, X, ShieldCheck } from 'lucide-react';
import { IS_MOCK_MODE, API_BASE_URL } from '../../services/agentService';

export const AppLayout: React.FC = () => {
  const [bannerDismissed, setBannerDismissed] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-canvas)' }}>
      {/* Truthful Mode Banner */}
      {!bannerDismissed && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface-raised)',
            borderBottom: '1px solid var(--border-default)',
            padding: '0.45rem 1.5rem',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Info size={14} style={{ color: IS_MOCK_MODE ? 'var(--status-mock)' : 'var(--status-active)', flexShrink: 0 }} />
            <span>
              {IS_MOCK_MODE ? (
                <>
                  <strong style={{ color: 'var(--text-primary)' }}>Demo Mode:</strong> Running with a local mock adapter. To connect your teammate's FastAPI backend, configure{' '}
                  <code style={{ background: 'var(--bg-surface-muted)', padding: '0.1rem 0.35rem', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' }}>
                    VITE_USE_MOCK=false
                  </code>{' '}
                  pointing to <code style={{ color: 'var(--accent-primary)' }}>{API_BASE_URL}</code>.
                </>
              ) : (
                <>
                  <strong style={{ color: 'var(--status-active)' }}>Live API Connected:</strong> Routing requests to{' '}
                  <code style={{ color: 'var(--accent-primary)' }}>{API_BASE_URL}</code>.
                </>
              )}
            </span>
          </div>

          <button
            onClick={() => setBannerDismissed(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '0.2rem'
            }}
            title="Dismiss notice"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Navigation Header */}
      <Navbar />

      {/* Page Content */}
      <main style={{ flex: 1, padding: '2.5rem 0 4rem' }}>
        <Outlet />
      </main>

      {/* Quiet Editorial Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-default)',
          backgroundColor: 'var(--bg-surface-warm)',
          padding: '1.5rem 0',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}
      >
        <div className="vf-container vf-flex vf-items-center vf-justify-between" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={16} style={{ color: 'var(--accent-primary)' }} />
            <span>VaaniFlow — HackBriven Build Arena ElevenLabs Voice AI Challenge</span>
          </div>
          <div>
            <span>Client-safe typed service layer • No API secrets stored in frontend code</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
