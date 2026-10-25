import React from 'react';
import { Phone, Sparkles, Mic, CheckCircle, ShieldCheck } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface LivePreviewCardProps {
  businessName: string;
  agentName: string;
  voiceName: string;
  firstMessage: string;
  sampleQueries?: string[];
  status: 'active' | 'draft';
}

export const LivePreviewCard: React.FC<LivePreviewCardProps> = ({
  businessName,
  agentName,
  voiceName,
  firstMessage,
  sampleQueries = [],
  status
}) => {
  return (
    <Card
      style={{
        position: 'sticky',
        top: 'calc(var(--header-height) + 1.5rem)',
        background: 'linear-gradient(180deg, #111827 0%, #0B101C 100%)',
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-md)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Sparkles size={16} style={{ color: 'var(--cyan-400)' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)' }}>
            Live Receptionist Preview
          </span>
        </div>
        <Badge variant={status === 'active' ? 'active' : 'muted'} dot={status === 'active'}>
          {status === 'active' ? 'Ready to Deploy' : 'Draft'}
        </Badge>
      </div>

      {/* Simulated Phone Call Card */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '1.25rem',
          textAlign: 'center',
          marginBottom: '1.25rem'
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(6, 182, 212, 0.05) 100%)',
            border: '2px solid var(--cyan-400)',
            margin: '0 auto 0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--cyan-300)',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.25)'
          }}
        >
          <Phone size={24} />
        </div>

        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.15rem' }}>
          {agentName || 'AI Receptionist'}
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.65rem' }}>
          {businessName || 'Your Business Name'}
        </p>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--cyan-300)', background: 'var(--cyan-subtle)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--cyan-border)' }}>
          <Mic size={12} />
          <span>Voice: {voiceName || 'Rachel'} (ElevenLabs)</span>
        </div>
      </div>

      {/* Opening Greeting Speech Bubble */}
      <div style={{ marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 500 }}>
          Caller Greeting (First words spoken upon answer):
        </span>
        <div
          style={{
            background: 'var(--bg-surface-raised)',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            borderLeft: '3px solid var(--cyan-400)',
            fontSize: '0.825rem',
            color: 'var(--text-primary)',
            lineHeight: 1.5,
            fontStyle: 'italic'
          }}
        >
          "{firstMessage || 'Hello! Thank you for calling. How can I assist you today?'}"
        </div>
      </div>

      {/* Trained FAQs Preview */}
      {sampleQueries.length > 0 && (
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>
            Trained to handle customer queries like:
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {sampleQueries.map((query, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.78rem',
                  color: 'var(--text-secondary)'
                }}
              >
                <CheckCircle size={13} style={{ color: 'var(--cyan-400)', flexShrink: 0 }} />
                <span>"{query}"</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Safe integration footer note */}
      <div
        style={{
          marginTop: '1.25rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--border-hairline)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.72rem',
          color: 'var(--text-muted)'
        }}
      >
        <ShieldCheck size={14} style={{ color: 'var(--emerald-400)' }} />
        <span>ElevenLabs React SDK conversational ready</span>
      </div>
    </Card>
  );
};
