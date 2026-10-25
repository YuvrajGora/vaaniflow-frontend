import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Sparkles, Sliders } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export const SetupChecklist: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card
      style={{
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.07) 0%, rgba(14, 23, 42, 0.6) 100%)',
        border: '1px solid var(--cyan-border)',
        marginBottom: '2rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--cyan-400)', marginBottom: '0.35rem' }}>
            <Sparkles size={16} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Small Business Receptionist Setup
            </span>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Welcome to VaaniFlow AI
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '650px', marginTop: '0.25rem' }}>
            Configure an intelligent, human-sounding AI receptionist powered by ElevenLabs voice synthesis. Never miss an appointment, client lead, or emergency after-hours call.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Sliders size={15} />}
          onClick={() => navigate('/builder')}
        >
          Create New Receptionist
        </Button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginTop: '1.25rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-hairline)'
        }}
      >
        {/* Step 1 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
          <CheckCircle2 size={18} style={{ color: 'var(--emerald-400)', marginTop: '0.15rem', flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>1. Pick Industry Template</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Dental, auto repair, legal, salons, or custom business profiles.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
          <CheckCircle2 size={18} style={{ color: 'var(--emerald-400)', marginTop: '0.15rem', flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>2. Select ElevenLabs Voice</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Curated warm, reassuring voices tailored for polite phone etiquette.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
          <div
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              border: '2px solid var(--cyan-400)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '0.15rem',
              flexShrink: 0
            }}
          >
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--cyan-400)' }} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--cyan-300)' }}>
              3. Test Voice Interaction
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Simulate customer questions over live audio in the testing studio.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
