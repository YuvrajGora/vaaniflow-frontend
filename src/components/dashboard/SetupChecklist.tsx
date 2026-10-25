import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Sparkles, Wand2 } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export const SetupChecklist: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card
      style={{
        backgroundColor: 'var(--bg-surface-warm)',
        border: '1px solid var(--border-default)',
        marginBottom: '2rem',
        padding: '1.75rem 2rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>
            <Sparkles size={15} />
            <span style={{ fontSize: '0.74rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Receptionist Onboarding
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-display)', fontWeight: 500, color: 'var(--text-primary)' }}>
            Welcome to VaaniFlow AI Studio
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '680px', marginTop: '0.3rem', lineHeight: 1.5 }}>
            Configure human-sounding AI receptionists powered by ElevenLabs voice synthesis. Never miss an appointment booking, customer inquiry, or urgent after-hours request.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Wand2 size={14} />}
          onClick={() => navigate('/builder')}
          style={{ alignSelf: 'flex-start' }}
        >
          Create New Receptionist
        </Button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginTop: '1.5rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-default)'
        }}
      >
        {/* Step 1 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
          <CheckCircle2 size={17} style={{ color: 'var(--status-active)', marginTop: '0.15rem', flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>1. Plain-Language Prompt</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.45, marginTop: '0.15rem' }}>
              Describe your business requirements or start from a clinic, shop, or salon preset.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
          <CheckCircle2 size={17} style={{ color: 'var(--status-active)', marginTop: '0.15rem', flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>2. Curated ElevenLabs Voice</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.45, marginTop: '0.15rem' }}>
              Select a polite, reassuring voice with sample audio preview tailored for phone etiquette.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
          <div
            style={{
              width: '17px',
              height: '17px',
              borderRadius: '50%',
              border: '2px solid var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '0.15rem',
              flexShrink: 0
            }}
          >
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
              3. Interactive Voice Studio
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.45, marginTop: '0.15rem' }}>
              Test your receptionist live using your microphone and inspect conversational transcripts.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
