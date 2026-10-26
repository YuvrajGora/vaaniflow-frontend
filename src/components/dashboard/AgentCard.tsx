import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic,
  Sliders,
  Phone,
  Building,
  Wrench,
  Stethoscope,
  Scale,
  Sparkles,
  Utensils,
  Bot
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import type { Agent, BusinessCategory } from '../../types/agent';

interface AgentCardProps {
  agent: Agent;
}

const getCategoryIcon = (category: BusinessCategory) => {
  switch (category) {
    case 'dental':
      return <Stethoscope size={14} />;
    case 'auto_repair':
      return <Wrench size={14} />;
    case 'real_estate':
      return <Building size={14} />;
    case 'law_firm':
      return <Scale size={14} />;
    case 'salon_spa':
      return <Sparkles size={14} />;
    case 'restaurant':
      return <Utensils size={14} />;
    default:
      return <Bot size={14} />;
  }
};

const formatCategoryName = (category: BusinessCategory) => {
  switch (category) {
    case 'dental':
      return 'Dental & Clinic';
    case 'auto_repair':
      return 'Auto Repair';
    case 'real_estate':
      return 'Real Estate';
    case 'law_firm':
      return 'Legal & Intake';
    case 'salon_spa':
      return 'Salon & Spa';
    case 'restaurant':
      return 'Restaurant';
    default:
      return 'Custom Business';
  }
};

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const navigate = useNavigate();

  const handleTestClick = () => {
    navigate(`/test?agentId=${agent.id}`);
  };

  const handleEditClick = () => {
    navigate(`/builder?agentId=${agent.id}`);
  };

  return (
    <Card
      interactive
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--bg-surface-warm)',
        padding: '1.5rem',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)'
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '0.75rem',
          marginBottom: '0.85rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'var(--accent-primary)',
                background: 'var(--accent-subtle)',
                padding: '0.15rem 0.45rem',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--accent-border)',
                textTransform: 'uppercase',
                letterSpacing: '0.03em'
              }}
            >
              {getCategoryIcon(agent.businessType)}
              <span>{formatCategoryName(agent.businessType)}</span>
            </span>

            {agent.isBackendProvisioned || agent.agent_id ? (
              <Badge variant="active" dot>
                ElevenLabs Live
              </Badge>
            ) : agent.status === 'active' ? (
              <Badge variant="active" dot>
                Live Receptionist
              </Badge>
            ) : (
              <Badge variant="muted">Local Draft</Badge>
            )}
          </div>

          <h3
            style={{
              fontSize: '1.2rem',
              fontWeight: 600,
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
              lineHeight: 1.25
            }}
          >
            {agent.name}
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            {agent.businessName}
          </p>

          {agent.agent_id && (
            <div
              style={{
                fontSize: '0.68rem',
                fontFamily: 'monospace',
                color: 'var(--text-muted)',
                marginTop: '0.25rem',
                wordBreak: 'break-all'
              }}
            >
              ID: {agent.agent_id}
            </div>
          )}
        </div>

        {/* ElevenLabs Voice Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.55rem',
            borderRadius: 'var(--radius-xs)',
            background: 'var(--bg-surface-raised)',
            border: '1px solid var(--border-default)',
            fontSize: '0.72rem',
            color: 'var(--text-secondary)',
            maxWidth: '130px'
          }}
          title={`Configured Voice: ${agent.voiceId}`}
        >
          <Mic size={12} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
            {agent.voiceId === 'SZfY4K69FwXus87eayHK' ? 'Aarav (Live)' : agent.voiceId}
          </span>
        </div>
      </div>

      {/* Greeting Preview */}
      <div
        style={{
          background: 'var(--bg-surface-raised)',
          padding: '0.75rem 0.95rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-hairline)',
          fontSize: '0.825rem',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          lineHeight: 1.45,
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        "{agent.firstMessage}"
      </div>

      {/* Stats Summary - Truthful display for backend provisioned agents vs mock agents */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          padding: '0.75rem 0',
          borderTop: '1px solid var(--border-hairline)',
          borderBottom: '1px solid var(--border-hairline)',
          marginBottom: '1.25rem'
        }}
      >
        {agent.isBackendProvisioned || agent.agent_id ? (
          <>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                Channel
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                WebSocket
              </span>
            </div>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                Audio Provider
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--status-active)' }}>
                ElevenLabs
              </span>
            </div>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                Created
              </span>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                {agent.createdAt ? new Date(agent.createdAt).toLocaleDateString() : 'Active'}
              </span>
            </div>
          </>
        ) : (
          <>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                Calls Handled
              </span>
              <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {agent.stats.totalCalls}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                Resolution
              </span>
              <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--status-active)' }}>
                {agent.stats.resolutionRate}%
              </span>
            </div>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                Last Session
              </span>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                {agent.stats.lastActive}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto' }}>
        <Button
          variant="primary"
          size="sm"
          icon={<Phone size={13} />}
          onClick={handleTestClick}
          style={{ flex: 1 }}
        >
          Test Voice Studio
        </Button>

        <Button
          variant="secondary"
          size="sm"
          icon={<Sliders size={13} />}
          onClick={handleEditClick}
          title={agent.isBackendProvisioned ? 'Clone or customize this agent configuration' : 'Edit Configuration'}
        >
          {agent.isBackendProvisioned ? 'Customize' : 'Configure'}
        </Button>
      </div>
    </Card>
  );
};
