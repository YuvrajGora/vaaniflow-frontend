import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Layers, Wand2, Mic, Clock, Plus } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { IS_MOCK_MODE } from '../../services/agentService';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backgroundColor: 'var(--bg-surface-warm)',
        borderBottom: '1px solid var(--border-default)',
        height: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div className="vf-container vf-flex vf-items-center vf-justify-between">
        {/* Left: Brand Identity */}
        <div className="vf-flex vf-items-center vf-gap-6">
          <NavLink
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              color: 'var(--text-primary)',
              textDecoration: 'none'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}
            >
              <Mic size={17} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: '1.35rem',
                    letterSpacing: '-0.02em',
                    color: 'var(--text-primary)',
                    lineHeight: 1
                  }}
                >
                  VaaniFlow
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    color: 'var(--accent-primary)',
                    background: 'var(--accent-subtle)',
                    padding: '0.1rem 0.35rem',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--accent-border)',
                    textTransform: 'uppercase'
                  }}
                >
                  Studio
                </span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: 1.2, marginTop: '2px' }}>
                Voice AI Agent Platform
              </div>
            </div>
          </NavLink>

          {/* Editorial Navigation Tabs */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: '1rem' }}>
            <NavLink
              to="/"
              end
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.75rem',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.825rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--bg-surface-raised)' : 'transparent',
                borderBottom: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent',
                transition: 'all var(--transition-fast)'
              })}
            >
              <Layers size={14} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/builder"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.75rem',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.825rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--bg-surface-raised)' : 'transparent',
                borderBottom: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent',
                transition: 'all var(--transition-fast)'
              })}
            >
              <Wand2 size={14} />
              <span>Agent Builder</span>
            </NavLink>

            <NavLink
              to="/test"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.75rem',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.825rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--bg-surface-raised)' : 'transparent',
                borderBottom: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent',
                transition: 'all var(--transition-fast)'
              })}
            >
              <Mic size={14} />
              <span>Voice Studio</span>
            </NavLink>

            <NavLink
              to="/sessions"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.75rem',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.825rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--bg-surface-raised)' : 'transparent',
                borderBottom: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent',
                transition: 'all var(--transition-fast)'
              })}
            >
              <Clock size={14} />
              <span>Session Logs</span>
            </NavLink>
          </nav>
        </div>

        {/* Right Controls */}
        <div className="vf-flex vf-items-center vf-gap-3">
          {IS_MOCK_MODE ? (
            <Badge variant="mock" dot>
              Demo Adapter
            </Badge>
          ) : (
            <Badge variant="active" dot>
              FastAPI Live
            </Badge>
          )}

          <Button
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => navigate('/builder')}
          >
            Create Agent
          </Button>
        </div>
      </div>
    </header>
  );
};
