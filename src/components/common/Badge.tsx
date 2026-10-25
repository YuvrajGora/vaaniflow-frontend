import React from 'react';

export type BadgeVariant = 'active' | 'cyan' | 'amber' | 'rose' | 'muted' | 'mock';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'muted',
  dot = false,
  className = ''
}) => {
  const variantClass = {
    active: 'vf-badge-active',
    cyan: 'vf-badge-cyan',
    amber: 'vf-badge-amber',
    rose: 'vf-badge-rose',
    muted: 'vf-badge-muted',
    mock: 'vf-badge-mock'
  }[variant];

  return (
    <span className={`vf-badge ${variantClass} ${className}`}>
      {dot && (
        <span
          className={`vf-status-dot ${
            variant === 'active'
              ? 'vf-status-dot-active'
              : variant === 'cyan'
              ? 'vf-status-dot-cyan'
              : ''
          }`}
          style={{
            backgroundColor:
              variant === 'amber'
                ? 'var(--amber-400)'
                : variant === 'rose'
                ? 'var(--rose-400)'
                : variant === 'mock'
                ? 'var(--violet-400)'
                : undefined
          }}
        />
      )}
      {children}
    </span>
  );
};
