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
    cyan: 'vf-badge-accent',
    amber: 'vf-badge-amber',
    rose: 'vf-badge-rose',
    muted: 'vf-badge-muted',
    mock: 'vf-badge-mock'
  }[variant];

  const dotColor = {
    active: 'var(--status-active)',
    cyan: 'var(--accent-primary)',
    amber: 'var(--status-warning)',
    rose: 'var(--status-danger)',
    muted: 'var(--text-muted)',
    mock: 'var(--status-mock)'
  }[variant];

  return (
    <span className={`vf-badge ${variantClass} ${className}`}>
      {dot && (
        <span
          className="vf-status-dot"
          style={{ backgroundColor: dotColor }}
        />
      )}
      {children}
    </span>
  );
};
