import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Info, X, ShieldCheck } from 'lucide-react';
import { IS_MOCK_MODE, API_BASE_URL } from '../../services/agentService';

export const AppLayout: React.FC = () => {
  const [bannerDismissed, setBannerDismissed] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Informative Environment Banner */}
      {!bannerDismissed && (
        <div
          style={{
            background: IS_MOCK_MODE
              ? 'linear-gradient(90deg, #131127 0%, #0E1626 100%)'
              : 'linear-gradient(90deg, #091D1A 0%, #0B1E29 100%)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '0.4rem 1.5rem',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Info size={14} style={{ color: IS_MOCK_MODE ? 'var(--violet-400)' : 'var(--emerald-400)' }} />
            <span>
              {IS_MOCK_MODE ? (
                <>
                  <strong style={{ color: 'var(--violet-400)' }}>Mock Adapter Active:</strong> Frontend running in isolated mode. When your teammate's FastAPI backend is running, set{' '}
                  <code style={{ background: 'rgba(255,255,255,0.08)', padding: '0.1rem 0.35rem', borderRadius: '4px', color: '#fff' }}>
                    VITE_USE_MOCK=false
                  </code>{' '}
                  to connect to <code style={{ color: 'var(--cyan-400)' }}>{API_BASE_URL}</code>.
                </>
              ) : (
                <>
                  <strong style={{ color: 'var(--emerald-400)' }}>Live Backend Mode:</strong> Connecting to{' '}
                  <code style={{ color: 'var(--cyan-400)' }}>{API_BASE_URL}</code>.
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
              padding: '0.15rem'
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
      <main style={{ flex: 1, padding: '2rem 0 3.5rem' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-hairline)',
          backgroundColor: 'rgba(6, 8, 13, 0.7)',
          padding: '1.25rem 0',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}
      >
        <div className="vf-container vf-flex vf-items-center vf-justify-between" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={16} style={{ color: 'var(--cyan-400)' }} />
            <span>VaaniFlow AI — HackBriven Build Arena ElevenLabs Voice AI Challenge</span>
          </div>
          <div>
            <span>No API secrets exposed on frontend • Typed adapter architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
