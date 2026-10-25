import React from 'react';
import { PhoneIncoming, CalendarCheck, HelpCircle, PhoneForwarded, AlertCircle, Clock } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import type { Session, SessionOutcome } from '../../types/agent';

interface RecentSessionsListProps {
  sessions: Session[];
}

const getOutcomeBadge = (outcome: SessionOutcome) => {
  switch (outcome) {
    case 'appointment_booked':
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.2rem 0.55rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--emerald-subtle)',
            color: 'var(--emerald-400)',
            fontSize: '0.72rem',
            fontWeight: 600,
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}
        >
          <CalendarCheck size={12} />
          Appointment Booked
        </span>
      );
    case 'query_resolved':
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.2rem 0.55rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--cyan-subtle)',
            color: 'var(--cyan-300)',
            fontSize: '0.72rem',
            fontWeight: 600,
            border: '1px solid var(--cyan-border)'
          }}
        >
          <HelpCircle size={12} />
          Inquiry Resolved
        </span>
      );
    case 'transferred_to_human':
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.2rem 0.55rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--amber-subtle)',
            color: 'var(--amber-400)',
            fontSize: '0.72rem',
            fontWeight: 600,
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}
        >
          <PhoneForwarded size={12} />
          Transferred to Staff
        </span>
      );
    default:
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.2rem 0.55rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--text-secondary)',
            fontSize: '0.72rem',
            fontWeight: 500
          }}
        >
          <AlertCircle size={12} />
          Completed
        </span>
      );
  }
};

export const RecentSessionsList: React.FC<RecentSessionsListProps> = ({ sessions }) => {
  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s.toString().padStart(2, '0')}s`;
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Today';
    }
  };

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Recent Receptionist Sessions</h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Autonomously handled caller recordings, inquiries, and scheduled appointments
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Badge variant="mock">Mock Session Feed</Badge>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {sessions.map((session) => (
          <div
            key={session.id}
            style={{
              padding: '0.9rem 1rem',
              backgroundColor: 'var(--bg-surface-raised)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              transition: 'border-color var(--transition-fast)'
            }}
          >
            {/* Top row: Caller, Agent, Outcome, Timestamp */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--cyan-400)'
                  }}
                >
                  <PhoneIncoming size={15} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      {session.callerNumber}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      via {session.agentName}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                {getOutcomeBadge(session.outcome)}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <Clock size={12} />
                  <span>{formatSeconds(session.durationSeconds)}</span>
                  <span>•</span>
                  <span>{formatRelativeTime(session.startedAt)}</span>
                </div>
              </div>
            </div>

            {/* Middle: Summary */}
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
              {session.summary}
            </p>

            {/* Snippet if present */}
            {session.transcriptSnippet && (
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  padding: '0.35rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  borderLeft: '2px solid var(--cyan-500)'
                }}
              >
                {session.transcriptSnippet}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
