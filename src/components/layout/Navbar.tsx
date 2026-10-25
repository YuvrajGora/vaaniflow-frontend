import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bot, Mic, Clock, PlusCircle, Radio, Sparkles, Layers } from 'lucide-react';
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
        backgroundColor: 'rgba(11, 15, 25, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-default)',
        height: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div className="vf-container vf-flex vf-items-center vf-justify-between">
        {/* Left: Brand Identity */}
        <div className="vf-flex vf-items-center vf-gap-4">
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
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(6, 182, 212, 0.05) 100%)',
                border: '1px solid var(--cyan-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--cyan-400)',
                boxShadow: '0 0 12px rgba(6, 182, 212, 0.15)'
              }}
            >
              <Radio size={19} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
                  VaaniFlow
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    color: 'var(--cyan-400)',
                    background: 'var(--cyan-subtle)',
                    padding: '0.1rem 0.35rem',
                    borderRadius: '4px',
                    border: '1px solid var(--cyan-border)'
                  }}
                >
                  AI
                </span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1 }}>
                ElevenLabs Voice Receptionist
              </div>
            </div>
          </NavLink>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1.5rem' }}>
            <NavLink
              to="/"
              end
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--cyan-300)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--cyan-subtle)' : 'transparent',
                border: isActive ? '1px solid var(--cyan-border)' : '1px solid transparent',
                transition: 'all var(--transition-fast)'
              })}
            >
              <Layers size={16} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/builder"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--cyan-300)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--cyan-subtle)' : 'transparent',
                border: isActive ? '1px solid var(--cyan-border)' : '1px solid transparent',
                transition: 'all var(--transition-fast)'
              })}
            >
              <Bot size={16} />
              <span>Agent Builder</span>
            </NavLink>

            <NavLink
              to="/test"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--cyan-300)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--cyan-subtle)' : 'transparent',
                border: isActive ? '1px solid var(--cyan-border)' : '1px solid transparent',
                transition: 'all var(--transition-fast)'
              })}
            >
              <Mic size={16} />
              <span>Voice Testing</span>
              <span
                style={{
                  fontSize: '0.65rem',
                  padding: '0.1rem 0.35rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-muted)'
                }}
              >
                M2
              </span>
            </NavLink>

            <NavLink
              to="/sessions"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--cyan-300)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--cyan-subtle)' : 'transparent',
                border: isActive ? '1px solid var(--cyan-border)' : '1px solid transparent',
                transition: 'all var(--transition-fast)'
              })}
            >
              <Clock size={16} />
              <span>Sessions</span>
              <span
                style={{
                  fontSize: '0.65rem',
                  padding: '0.1rem 0.35rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-muted)'
                }}
              >
                M2
              </span>
            </NavLink>
          </nav>
        </div>

        {/* Right: Environment Info & Action */}
        <div className="vf-flex vf-items-center vf-gap-3">
          {IS_MOCK_MODE ? (
            <Badge variant="mock" dot>
              Mock Adapter
            </Badge>
          ) : (
            <Badge variant="active" dot>
              FastAPI Live
            </Badge>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.25rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-hairline)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)'
            }}
            title="ElevenLabs conversational agent integration prepared"
          >
            <Sparkles size={13} style={{ color: 'var(--cyan-400)' }} />
            <span>ElevenLabs Ready</span>
          </div>

          <Button
            size="sm"
            icon={<PlusCircle size={15} />}
            onClick={() => navigate('/builder')}
          >
            New Agent
          </Button>
        </div>
      </div>
    </header>
  );
};
