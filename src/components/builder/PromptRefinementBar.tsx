import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

interface PromptRefinementBarProps {
  onRefine: (refinementText: string) => Promise<void>;
  loading: boolean;
}

const SUGGESTED_REFINEMENTS = [
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
  const [refinementError, setRefinementError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinementText.trim() || loading) return;

    const appliedText = refinementText.trim();
    setRefinementError(null);

    try {
      await onRefine(appliedText);
      setLastApplied(appliedText);
      setRefinementText('');
      setTimeout(() => setLastApplied(null), 5000);
    } catch (err: any) {
      setRefinementError(err?.message || 'Refinement service was unable to apply this change.');
    }
  };

  const handleShortcutClick = async (text: string) => {
    if (loading) return;
    setRefinementError(null);

    try {
      await onRefine(text);
      setLastApplied(text);
      setTimeout(() => setLastApplied(null), 5000);
    } catch (err: any) {
      setRefinementError(err?.message || 'Refinement service was unable to apply this change.');
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface-warm)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Header and status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={15} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Refine with Natural Language
          </span>
          <span
            style={{
              fontSize: '0.68rem',
              color: 'var(--status-mock)',
              background: 'var(--status-mock-bg)',
              border: '1px solid var(--status-mock-border)',
              padding: '0.1rem 0.45rem',
              borderRadius: 'var(--radius-xs)',
              letterSpacing: '0.02em'
            }}
          >
            Refinement Adapter
          </span>
        </div>

        {lastApplied && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--status-active)', fontSize: '0.78rem', fontWeight: 500 }}>
            <CheckCircle2 size={14} />
            <span>Applied: "{lastApplied}"</span>
          </div>
        )}
      </div>

      {refinementError && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 0.75rem',
            backgroundColor: 'var(--status-danger-bg)',
            border: '1px solid var(--status-danger-border)',
            borderRadius: 'var(--radius-xs)',
            color: 'var(--status-danger)',
            fontSize: '0.78rem',
            marginBottom: '0.75rem'
          }}
        >
          <AlertCircle size={14} />
          <span>{refinementError}</span>
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <input
          type="text"
          className="vf-input"
          value={refinementText}
          onChange={(e) => setRefinementText(e.target.value)}
          placeholder="What would you like to change? (e.g., 'Make greeting shorter', 'Speak Hindi by default')..."
          style={{ flex: 1, fontSize: '0.875rem' }}
          disabled={loading}
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          icon={<RefreshCw size={13} />}
          loading={loading}
          disabled={!refinementText.trim() || loading}
        >
          Refine
        </Button>
      </form>

      {/* Suggested examples */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Suggested refinements:</span>
        {SUGGESTED_REFINEMENTS.map((shortcut, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleShortcutClick(shortcut)}
            disabled={loading}
            style={{
              background: 'var(--bg-surface-raised)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-secondary)',
              padding: '0.2rem 0.55rem',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.74rem',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.color = 'var(--accent-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-default)';
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
