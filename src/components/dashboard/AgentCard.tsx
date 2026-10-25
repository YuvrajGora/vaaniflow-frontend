import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic,
  Sliders,
  Play,
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
      return <Stethoscope size={16} />;
    case 'auto_repair':
      return <Wrench size={16} />;
    case 'real_estate':
      return <Building size={16} />;
    case 'law_firm':
      return <Scale size={16} />;
    case 'salon_spa':
      return <Sparkles size={16} />;
    case 'restaurant':
      return <Utensils size={16} />;
    default:
      return <Bot size={16} />;
  }
};

const formatCategoryName = (category: BusinessCategory) => {
  switch (category) {
    case 'dental':
      return 'Dental & Medical';
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
    <Card interactive style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                color: 'var(--cyan-400)',
                background: 'var(--cyan-subtle)',
                padding: '0.2rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--cyan-border)'
              }}
            >
              {getCategoryIcon(agent.businessType)}
              <span>{formatCategoryName(agent.businessType)}</span>
            </span>

            {agent.status === 'active' ? (
              <Badge variant="active" dot>
                Live Receptionist
              </Badge>
            ) : (
              <Badge variant="muted">Draft</Badge>
            )}
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {agent.name}
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            {agent.businessName}
          </p>
        </div>

        {/* ElevenLabs Voice Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.55rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-hairline)',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)'
          }}
          title="ElevenLabs Curated Voice"
        >
          <Mic size={13} style={{ color: 'var(--cyan-400)' }} />
          <span style={{ textTransform: 'capitalize' }}>{agent.voiceId}</span>
        </div>
      </div>

      {/* Greeting Preview */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.25)',
          padding: '0.75rem 0.9rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-hairline)',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
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

      {/* Stats Summary */}
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
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Calls Handled</span>
          <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {agent.stats.totalCalls}
          </span>
        </div>
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Resolution</span>
          <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--emerald-400)' }}>
            {agent.stats.resolutionRate}%
          </span>
        </div>
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Last Call</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {agent.stats.lastActive}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto' }}>
        <Button
          variant="primary"
          size="sm"
          icon={<Play size={14} />}
          onClick={handleTestClick}
          style={{ flex: 1 }}
        >
          Test Voice Call
        </Button>

        <Button
          variant="secondary"
          size="sm"
          icon={<Sliders size={14} />}
          onClick={handleEditClick}
        >
          Edit
        </Button>
      </div>
    </Card>
  );
};
