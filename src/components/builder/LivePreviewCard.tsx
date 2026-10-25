import React from 'react';
import { Phone, Mic, CheckCircle, PhoneForwarded, Globe, Info } from 'lucide-react';
import { Badge } from '../common/Badge';

interface LivePreviewCardProps {
  businessName: string;
  agentName: string;
  voiceName: string;
  firstMessage: string;
  sampleQueries?: string[];
  status: 'active' | 'draft';
  language?: string;
  persona?: string;
  requiredFields?: string[];
  escalationPhone?: string;
  isAiGenerated?: boolean;
}

export const LivePreviewCard: React.FC<LivePreviewCardProps> = ({
  businessName,
  agentName,
  voiceName,
  firstMessage,
  sampleQueries = [],
  status,
  language = 'en-US',
  persona,
  requiredFields = [],
  escalationPhone
}) => {
  const formatLanguageLabel = (code: string) => {
    switch (code) {
      case 'hi-IN':
        return 'Hindi & English (Bilingual)';
      case 'es-ES':
        return 'Spanish (Español)';
      case 'fr-FR':
        return 'French (Français)';
      case 'en-GB':
        return 'British English';
      default:
        return 'English (US)';
    }
  };

  return (
    <div
      style={{
        position: 'sticky',
        top: 'calc(var(--header-height) + 1.5rem)',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent-primary)' }}>
            Caller Experience Simulation
          </span>
        </div>
        <Badge variant={status === 'active' ? 'active' : 'muted'} dot={status === 'active'}>
          {status === 'active' ? 'Ready to Save' : 'Draft'}
        </Badge>
      </div>

      {/* Agent Call Identity Banner */}
      <div
        style={{
          background: 'var(--bg-surface-raised)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-default)',
          padding: '1.25rem',
          textAlign: 'center',
          marginBottom: '1.25rem'
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'var(--accent-subtle)',
            border: '1px solid var(--accent-border)',
            margin: '0 auto 0.65rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-primary)'
          }}
        >
          <Phone size={19} />
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '0.15rem'
          }}
        >
          {agentName || 'Voice AI Receptionist'}
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.65rem' }}>
          {businessName || 'Your Business Name'}
        </p>

        {/* Voice and Language pills */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {voiceName && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: 'var(--text-secondary)', background: 'var(--bg-surface)', padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-default)' }}>
              <Mic size={11} style={{ color: 'var(--accent-primary)' }} />
              <span>Voice: {voiceName}</span>
            </div>
          )}

          {language && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: 'var(--text-secondary)', background: 'var(--bg-surface)', padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-default)' }}>
              <Globe size={11} />
              <span>{formatLanguageLabel(language)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Opening Greeting Speech Box */}
      <div style={{ marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 500 }}>
          Caller Greeting (First words spoken upon answer):
        </span>
        <div
          style={{
            background: 'var(--bg-surface-raised)',
            padding: '0.9rem 1.05rem',
            borderRadius: 'var(--radius-sm)',
            borderLeft: '3px solid var(--accent-primary)',
            borderTop: '1px solid var(--border-hairline)',
            borderRight: '1px solid var(--border-hairline)',
            borderBottom: '1px solid var(--border-hairline)',
            fontSize: '0.875rem',
            color: 'var(--text-primary)',
            lineHeight: 1.55,
            fontStyle: 'italic'
          }}
        >
          "{firstMessage || 'Hello! Thank you for calling. How can I assist you today?'}"
        </div>
      </div>

      {/* Persona excerpt */}
      {persona && (
        <div style={{ marginBottom: '1rem', padding: '0.65rem 0.75rem', background: 'var(--bg-surface-raised)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-default)' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
            Persona Demeanor
          </span>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, marginTop: '0.2rem', lineHeight: 1.45 }}>
            {persona}
          </p>
        </div>
      )}

      {/* Required Information tags */}
      {requiredFields.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 500 }}>
            Information collected from caller:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {requiredFields.slice(0, 4).map((field, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.7rem',
                  padding: '0.15rem 0.45rem',
                  borderRadius: 'var(--radius-xs)',
                  background: 'var(--bg-surface-raised)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-default)'
                }}
              >
                ✓ {field}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sample Queries */}
      {sampleQueries.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 500 }}>
            Trained to answer inquiries like:
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {sampleQueries.map((query, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.76rem',
                  color: 'var(--text-secondary)'
                }}
              >
                <CheckCircle size={12} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                <span>"{query}"</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Escalation Route */}
      {escalationPhone && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: 'var(--status-warning)', marginBottom: '0.75rem' }}>
          <PhoneForwarded size={12} />
          <span>Emergency Handoff Line: {escalationPhone}</span>
        </div>
      )}

      {/* Truthful Preview Disclaimer Footer */}
      <div
        style={{
          marginTop: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-default)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.72rem',
          color: 'var(--text-muted)'
        }}
      >
        <Info size={13} style={{ flexShrink: 0 }} />
        <span>Simulated preview • Reflects draft dialogue, voice & rules</span>
      </div>
    </div>
  );
};
