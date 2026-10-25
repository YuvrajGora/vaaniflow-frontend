import React, { useState } from 'react';
import { Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

interface PromptRefinementBarProps {
  onRefine: (refinementText: string) => Promise<void>;
  loading: boolean;
}

const REFINEMENT_SHORTCUTS = [
  'Make the greeting shorter.',
  'Speak Hindi by default.',
  'Escalate complaints to a human.',
  'Add 24-hr cancellation fee rule.'
];

export const PromptRefinementBar: React.FC<PromptRefinementBarProps> = ({
  onRefine,
  loading
}) => {
  const [refinementText, setRefinementText] = useState('');
  const [lastApplied, setLastApplied] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinementText.trim() || loading) return;

    const appliedText = refinementText.trim();
    await onRefine(appliedText);
    setLastApplied(appliedText);
    setRefinementText('');
    setTimeout(() => setLastApplied(null), 4000);
  };

  const handleShortcutClick = async (text: string) => {
    if (loading) return;
    await onRefine(text);
    setLastApplied(text);
    setTimeout(() => setLastApplied(null), 4000);
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface-raised)',
        border: '1px solid var(--cyan-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 12px rgba(6, 182, 212, 0.1)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Sparkles size={16} style={{ color: 'var(--cyan-400)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Refine Configuration with Natural Language
          </span>
          <span
            style={{
              fontSize: '0.68rem',
              color: 'var(--violet-400)',
              background: 'rgba(139, 92, 246, 0.12)',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              padding: '0.1rem 0.45rem',
              borderRadius: 'var(--radius-full)'
            }}
          >
            AI Refinement Adapter
          </span>
        </div>

        {lastApplied && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--emerald-400)', fontSize: '0.78rem' }}>
            <CheckCircle2 size={14} />
            <span>Applied: "{lastApplied}"</span>
          </div>
        )}
      </div>

      {/* Input row */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.65rem', marginBottom: '0.75rem' }}>
        <input
          type="text"
          className="vf-input"
          value={refinementText}
          onChange={(e) => setRefinementText(e.target.value)}
          placeholder='e.g., "Make the greeting shorter", "Speak Hindi by default", "Escalate complaints to a human"...'
          style={{ flex: 1, fontSize: '0.875rem' }}
          disabled={loading}
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          icon={<RefreshCw size={14} />}
          loading={loading}
          disabled={!refinementText.trim() || loading}
        >
          Apply Refinement
        </Button>
      </form>

      {/* Suggested quick refinement pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Quick tweaks:</span>
        {REFINEMENT_SHORTCUTS.map((shortcut, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleShortcutClick(shortcut)}
            disabled={loading}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-hairline)',
              color: 'var(--text-secondary)',
              padding: '0.2rem 0.55rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.74rem',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--cyan-400)';
              e.currentTarget.style.color = 'var(--cyan-300)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-hairline)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            + {shortcut}
          </button>
        ))}
      </div>
    </div>
  );
};
