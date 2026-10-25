import React from 'react';
import { ArrowRight, Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '../common/Button';

interface StarterChip {
  id: string;
  categoryName: string;
  promptText: string;
}

const STARTER_CHIPS: StarterChip[] = [
  {
    id: 'dental-bilingual',
    categoryName: 'Bilingual Dental Clinic',
    promptText:
      'Create a friendly receptionist for my dental clinic who speaks Hindi and English, answers common appointment questions, collects appointment preferences, and escalates emergencies to a human.'
  },
  {
    id: 'auto-service',
    categoryName: 'Automotive Service Advisor',
    promptText:
      'Build an automotive service advisor that greets vehicle owners, gives synthetic oil change estimates, gathers car make, model and year, and routes emergency tow requests.'
  },
  {
    id: 'real-estate',
    categoryName: 'Property Leasing Concierge',
    promptText:
      'Create a luxury leasing agent for an apartment community that answers pet policy questions, pre-qualifies budget and move-in dates, and schedules private property tours.'
  },
  {
    id: 'customer-support',
    categoryName: 'Technical Support Desk',
    promptText:
      'Build a polite technical support agent that verifies customer order numbers, handles warranty claims, troubleshoots connection issues, and escalates angry callers to management.'
  },
  {
    id: 'education-admissions',
    categoryName: 'University Admissions',
    promptText:
      'Create an admissions counselor who informs prospective students about application deadlines, tuition fees, course prerequisites, and campus open house tours.'
  }
];

interface PromptInputHeroProps {
  prompt: string;
  onChangePrompt: (val: string) => void;
  onGenerate: () => void;
  loading: boolean;
  showTemplatesToggle?: boolean;
  showingTemplates?: boolean;
  onToggleTemplates?: () => void;
}

export const PromptInputHero: React.FC<PromptInputHeroProps> = ({
  prompt,
  onChangePrompt,
  onGenerate,
  loading,
  showTemplatesToggle = true,
  showingTemplates = false,
  onToggleTemplates
}) => {
  const maxLength = 1000;
  const charsRemaining = maxLength - prompt.length;

  const handleChipClick = (chipPrompt: string) => {
    onChangePrompt(chipPrompt);
  };

  const handleClear = () => {
    onChangePrompt('');
  };

  return (
    <section
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem',
        marginBottom: '2.5rem',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Editorial Title & Supporting Copy */}
      <div style={{ maxWidth: '820px', marginBottom: '1.75rem' }}>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--accent-primary)',
            display: 'block',
            marginBottom: '0.5rem'
          }}
        >
          Prompt-First Agent Studio
        </span>
        <h1
          style={{
            fontSize: '2.4rem',
            lineHeight: 1.15,
            color: 'var(--text-primary)',
            marginBottom: '0.75rem'
          }}
        >
          Your next receptionist starts with a sentence.
        </h1>
        <p
          style={{
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            margin: 0
          }}
        >
          Describe what you need. We'll help you build, test, and launch your voice assistant.
        </p>
      </div>

      {/* Starter Examples */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>
          Example prompts to start from:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {STARTER_CHIPS.map((chip) => {
            const isActive = prompt.trim() === chip.promptText.trim();
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => handleChipClick(chip.promptText)}
                style={{
                  background: isActive ? 'var(--accent-subtle)' : 'var(--bg-surface-raised)',
                  border: isActive ? '1px solid var(--accent-border)' : '1px solid var(--border-default)',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {chip.categoryName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Large Multiline Textarea */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <textarea
          rows={4}
          value={prompt}
          maxLength={maxLength}
          onChange={(e) => onChangePrompt(e.target.value)}
          placeholder='e.g. "Create a friendly receptionist for my dental clinic who speaks Hindi and English, answers common appointment questions, collects appointment preferences, and escalates emergencies to a human."'
          className="vf-textarea"
          style={{
            fontSize: '1rem',
            lineHeight: 1.6,
            padding: '1.15rem',
            background: 'var(--bg-surface-warm)',
            borderColor: prompt.length > 0 ? 'var(--border-strong)' : 'var(--border-default)',
            minHeight: '120px'
          }}
        />

        {/* Counter and Clear row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '0.4rem',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}
        >
          <span>Include business context, languages, hours, and when to transfer calls.</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {prompt && (
              <button
                type="button"
                onClick={handleClear}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: 0
                }}
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}
            <span style={{ color: charsRemaining < 50 ? 'var(--status-warning)' : 'var(--text-muted)' }}>
              {prompt.length} / {maxLength}
            </span>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingTop: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Button
            variant="primary"
            icon={loading ? <Sparkles size={15} /> : <ArrowRight size={15} />}
            loading={loading}
            disabled={!prompt.trim()}
            onClick={onGenerate}
          >
            {loading ? 'Synthesizing Voice Agent...' : 'Generate My Agent'}
          </Button>

          {showTemplatesToggle && onToggleTemplates && (
            <button
              type="button"
              onClick={onToggleTemplates}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '0.825rem',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: '0.4rem 0'
              }}
            >
              {showingTemplates ? 'Hide industry archetypes' : 'Or browse industry archetypes'}
            </button>
          )}
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Synthesizes persona, guardrails, conversation steps & recommended voice
        </div>
      </div>
    </section>
  );
};
