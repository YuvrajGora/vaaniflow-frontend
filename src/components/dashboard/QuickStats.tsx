import React from 'react';
import { PhoneIncoming, CheckCircle2, Clock, Bot, Info } from 'lucide-react';
import { Card } from '../common/Card';
import { IS_MOCK_MODE } from '../../services/agentService';
import type { DashboardMetrics } from '../../types/agent';

interface QuickStatsProps {
  metrics: DashboardMetrics;
}

export const QuickStats: React.FC<QuickStatsProps> = ({ metrics }) => {
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s.toString().padStart(2, '0')}s`;
  };

  return (
    <div style={{ marginBottom: '2.25rem' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem'
        }}
      >
        {/* 1. Active Agents */}
        <Card style={{ padding: '1.25rem 1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Active Receptionists
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--accent-subtle)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--accent-border)'
              }}
            >
              <Bot size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', lineHeight: 1.15 }}>
            {metrics.activeAgentsCount}
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Configured inbound voice agents
          </p>
        </Card>

        {/* 2. Total Inbound Calls */}
        <Card style={{ padding: '1.25rem 1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Calls Handled
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-surface-raised)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-default)'
              }}
            >
              <PhoneIncoming size={16} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', lineHeight: 1.15 }}>
              {metrics.totalCallsHandled.toLocaleString()}
            </span>
            {IS_MOCK_MODE && (
              <span
                style={{
                  fontSize: '0.68rem',
                  color: 'var(--status-mock)',
                  background: 'var(--status-mock-bg)',
                  border: '1px solid var(--status-mock-border)',
                  padding: '0.1rem 0.35rem',
                  borderRadius: 'var(--radius-xs)'
                }}
              >
                Sample Data
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Total caller sessions recorded
          </p>
        </Card>

        {/* 3. Autonomous Resolution */}
        <Card style={{ padding: '1.25rem 1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Autonomous Resolution
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--status-active-bg)',
                color: 'var(--status-active)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--status-active-border)'
              }}
            >
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', lineHeight: 1.15 }}>
            {metrics.resolutionRatePercent}%
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Inquiries resolved without staff transfer
          </p>
        </Card>

        {/* 4. Average Call Duration */}
        <Card style={{ padding: '1.25rem 1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Avg. Call Duration
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-surface-raised)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-default)'
              }}
            >
              <Clock size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', lineHeight: 1.15 }}>
            {formatDuration(metrics.avgCallDurationSeconds)}
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Average conversational duration
          </p>
        </Card>
      </div>

      {IS_MOCK_MODE ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            marginTop: '0.5rem',
            paddingLeft: '0.25rem'
          }}
        >
          <Info size={12} />
          <span>Metrics reflect simulated receptionist sessions from local demo dataset.</span>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            marginTop: '0.5rem',
            paddingLeft: '0.25rem'
          }}
        >
          <Info size={12} />
          <span>Active receptionists loaded live from FastAPI backend. Voice call sessions stream directly via WebSockets.</span>
        </div>
      )}
    </div>
  );
};
