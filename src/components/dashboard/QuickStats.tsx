import React from 'react';
import { PhoneCall, CheckCircle2, Clock, Zap, TrendingUp } from 'lucide-react';
import { Card } from '../common/Card';
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
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}
    >
      {/* 1. Total Calls */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Total Calls Handled
          </span>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--cyan-subtle)',
              border: '1px solid var(--cyan-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--cyan-400)'
            }}
          >
            <PhoneCall size={17} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem' }}>
          <span style={{ fontSize: '1.85rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
            {metrics.totalCallsHandled.toLocaleString()}
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--emerald-400)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem',
              fontWeight: 600
            }}
          >
            <TrendingUp size={13} />
            +{metrics.callsChangePercent}%
          </span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
          Across all active AI receptionists
        </p>
      </Card>

      {/* 2. Resolution Rate */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Resolution Rate
          </span>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--emerald-subtle)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--emerald-400)'
            }}
          >
            <CheckCircle2 size={17} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.85rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
            {metrics.resolutionRatePercent}%
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--emerald-400)', fontWeight: 500 }}>
            Resolved without escalation
          </span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
          Triaged & verified autonomously
        </p>
      </Card>

      {/* 3. Avg Call Duration */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Avg. Call Duration
          </span>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-default)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)'
            }}
          >
            <Clock size={17} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.85rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
            {formatDuration(metrics.avgCallDurationSeconds)}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Per caller session
          </span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
          Low latency natural voice turn-taking
        </p>
      </Card>

      {/* 4. Staff Time Saved */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Front Desk Hours Saved
          </span>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(139, 92, 246, 0.12)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--violet-400)'
            }}
          >
            <Zap size={17} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.85rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
            {metrics.totalTimeSavedHours}h
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--violet-400)', fontWeight: 500 }}>
            This month
          </span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
          Equals ~1.2 full-time front desk shifts
        </p>
      </Card>
    </div>
  );
};
