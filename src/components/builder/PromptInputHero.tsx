import React from 'react';
import { Sparkles, Wand2, Lightbulb, RotateCcw } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface StarterChip {
  id: string;
  categoryName: string;
  icon: string;
  promptText: string;
}

const STARTER_CHIPS: StarterChip[] = [
  {
    id: 'dental-hindi',
    categoryName: 'Dental & Medical (Bilingual)',
    icon: '🦷',
    promptText:
      'Create a friendly receptionist for my dental clinic who speaks Hindi and English, answers common appointment questions, collects appointment preferences, and escalates emergencies to a human.'
  },
  {
    id: 'auto-service',
    categoryName: 'Auto Repair & Service',
    icon: '🚗',
    promptText:
      'Build an automotive service advisor that greets vehicle owners, gives synthetic oil change estimates, gathers car make, model and year, and routes emergency tow requests.'
  },
  {
    id: 'real-estate',
    categoryName: 'Real Estate & Leasing',
    icon: '🏠',
    promptText:
      'Create a luxury leasing agent for an apartment community that answers pet policy questions, pre-qualifies budget and move-in dates, and schedules private property tours.'
  },
  {
    id: 'customer-support',
    categoryName: 'Customer Support Desk',
    icon: '🛠️',
    promptText:
      'Build a polite technical support agent that verifies customer order numbers, handles warranty claims, troubleshoots connection issues, and escalates angry callers to management.'
  },
  {
    id: 'education-admissions',
    categoryName: 'University Admissions',
    icon: '🎓',
    promptText:
      'Create an admissions counselor who informs prospective students about application deadlines, tuition fees, course prerequisites, and campus open house tours.'
  }
];

interface PromptInputHeroProps {
  prompt: string;
  onChangePrompt: (val: string) => void;
  onGenerate: () => void;
  loading: boolean;
  onSelectStarter?: (promptText: string) => void;
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
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(17, 24, 39, 0.95) 100%)',
        border: '1px solid var(--cyan-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 25px -5px rgba(6, 182, 212, 0.15)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--cyan-subtle)',
                border: '1px solid var(--cyan-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--cyan-400)'
              }}
            >
              <Wand2 size={16} />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Describe Your Voice AI Assistant
            </h2>
            <Badge variant="cyan">Prompt-First</Badge>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '720px' }}>
            Describe your business, language preference, caller questions, and emergency rules. VaaniFlow will synthesize an editable persona, conversation steps, and guardrails.
          </p>
        </div>

        {prompt && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-default)',
              color: 'var(--text-muted)',
              borderRadius: 'var(--radius-md)',
              padding: '0.35rem 0.65rem',
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all var(--transition-fast)'
            }}
          >
            <RotateCcw size={13} />
            <span>Clear Prompt</span>
          </button>
        )}
      </div>

      {/* Starter Chips */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <Lightbulb size={13} style={{ color: 'var(--amber-400)' }} />
          <span>Quick Starters (Click to load prompt):</span>
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
                  background: isActive ? 'var(--cyan-subtle)' : 'var(--bg-surface-raised)',
                  border: isActive ? '1px solid var(--cyan-400)' : '1px solid var(--border-hairline)',
                  color: isActive ? 'var(--cyan-300)' : 'var(--text-secondary)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <span>{chip.icon}</span>
                <span style={{ fontWeight: 500 }}>{chip.categoryName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Large Multiline Prompt Textarea */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <textarea
          rows={4}
          value={prompt}
          maxLength={maxLength}
          onChange={(e) => onChangePrompt(e.target.value)}
          placeholder='e.g., "Create a friendly receptionist for my dental clinic who speaks Hindi and English, answers common appointment questions, collects appointment preferences, and escalates emergencies to a human."'
          className="vf-textarea"
          style={{
            fontSize: '0.95rem',
            lineHeight: 1.55,
            padding: '1rem',
            background: 'var(--bg-base)',
            borderColor: prompt.length > 0 ? 'var(--cyan-border)' : 'var(--border-default)',
            minHeight: '110px'
          }}
        />

        {/* Character Count */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '0.35rem',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}
        >
          <span>Use specific details: business name, languages, questions to handle, and escalation rules.</span>
          <span style={{ color: charsRemaining < 50 ? 'var(--amber-400)' : 'var(--text-muted)' }}>
            {prompt.length} / {maxLength}
          </span>
        </div>
      </div>

      {/* Action Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button
            variant="primary"
            icon={<Sparkles size={16} />}
            loading={loading}
            disabled={!prompt.trim()}
            onClick={onGenerate}
          >
            {loading ? 'Synthesizing Agent Configuration...' : 'Generate My Agent'}
          </Button>

          {showTemplatesToggle && onToggleTemplates && (
            <button
              type="button"
              onClick={onToggleTemplates}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--cyan-400)',
                fontSize: '0.825rem',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: '0.4rem 0.6rem'
              }}
            >
              {showingTemplates ? 'Hide industry template cards' : 'Or browse industry template cards'}
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <span className="vf-status-dot vf-status-dot-cyan" />
          <span>Generates persona, dialogue, conversation steps & guardrails</span>
        </div>
      </div>
    </div>
  );
};
