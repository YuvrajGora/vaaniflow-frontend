import React, { useState } from 'react';
import {
  PhoneIncoming,
  CalendarCheck,
  CheckCircle2,
  PhoneForwarded,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { IS_MOCK_MODE } from '../../services/agentService';
import type { Session, SessionOutcome } from '../../types/agent';

interface RecentSessionsListProps {
  sessions: Session[];
  title?: string;
  subtitle?: string;
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
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--radius-xs)',
            background: 'var(--status-active-bg)',
            color: 'var(--status-active)',
            fontSize: '0.72rem',
            fontWeight: 600,
            border: '1px solid var(--status-active-border)'
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
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--radius-xs)',
            background: 'var(--status-info-bg)',
            color: 'var(--status-info)',
            fontSize: '0.72rem',
            fontWeight: 600,
            border: '1px solid var(--status-info-border)'
          }}
        >
          <CheckCircle2 size={12} />
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
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--radius-xs)',
            background: 'var(--status-warning-bg)',
            color: 'var(--status-warning)',
            fontSize: '0.72rem',
            fontWeight: 600,
            border: '1px solid var(--status-warning-border)'
          }}
        >
          <PhoneForwarded size={12} />
          Transferred to Staff
        </span>
      );
    case 'followup_required':
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--radius-xs)',
            background: 'var(--accent-subtle)',
            color: 'var(--accent-primary)',
            fontSize: '0.72rem',
            fontWeight: 600,
            border: '1px solid var(--accent-border)'
          }}
        >
          <Clock size={12} />
          Follow-up Required
        </span>
      );
    default:
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--radius-xs)',
            background: 'var(--bg-surface-raised)',
            color: 'var(--text-secondary)',
            fontSize: '0.72rem',
            fontWeight: 500,
            border: '1px solid var(--border-default)'
          }}
        >
          <AlertCircle size={12} />
          Completed
        </span>
      );
  }
};

export const RecentSessionsList: React.FC<RecentSessionsListProps> = ({
  sessions,
  title = 'Recent Receptionist Sessions',
  subtitle = 'Inbound caller recordings, customer inquiries, and scheduled appointments'
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s.toString().padStart(2, '0')}s`;
  };

  const formatDateTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Today';
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (sessions.length === 0) {
    return (
      <Card style={{ textAlign: 'center', padding: '3rem 2rem', backgroundColor: 'var(--bg-surface-warm)' }}>
        <Clock size={28} style={{ color: 'var(--text-muted)', margin: '0 auto 0.75rem' }} />
        <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>
          No session history recorded
        </h3>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          Inbound calls handled by your receptionists will appear here with summaries and transcript snippets.
        </p>
      </Card>
    );
  }

  return (
    <Card
      style={{
        backgroundColor: 'var(--bg-surface-warm)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        padding: '1.5rem'
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1.25rem'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-display)', fontWeight: 500, color: 'var(--text-primary)' }}>
            {title}
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            {subtitle}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {IS_MOCK_MODE && (
            <Badge variant="mock" dot>
              Sample Session Dataset
            </Badge>
          )}
        </div>
      </div>

      {/* Session Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {sessions.map((session) => {
          const isExpanded = expandedId === session.id;

          return (
            <div
              key={session.id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem 1.15rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                transition: 'border-color var(--transition-fast)'
              }}
            >
              {/* Top Row: Caller, Receptionist, Outcome Badge, Timestamp */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-xs)',
                      backgroundColor: 'var(--bg-surface-raised)',
                      border: '1px solid var(--border-default)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-secondary)'
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
                        via <strong style={{ color: 'var(--text-secondary)' }}>{session.agentName}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  {getOutcomeBadge(session.outcome)}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)'
                    }}
                  >
                    <Clock size={12} />
                    <span>{formatSeconds(session.durationSeconds)}</span>
                    <span>•</span>
                    <span>{formatDateTime(session.startedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Middle Row: Summary */}
              <p
                style={{
                  fontSize: '0.835rem',
                  color: 'var(--text-secondary)',
                  margin: 0,
                  lineHeight: 1.5
                }}
              >
                {session.summary}
              </p>

              {/* Bottom Row: Transcript Toggle */}
              {session.transcriptSnippet && (
                <div>
                  <button
                    type="button"
                    onClick={() => toggleExpand(session.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--accent-primary)',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: 0
                    }}
                  >
                    <FileText size={12} />
                    <span>{isExpanded ? 'Hide transcript snippet' : 'View transcript snippet'}</span>
                    {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>

                  {isExpanded && (
                    <div
                      style={{
                        marginTop: '0.5rem',
                        fontSize: '0.78rem',
                        color: 'var(--text-secondary)',
                        fontFamily: 'var(--font-mono)',
                        backgroundColor: 'var(--bg-surface-raised)',
                        padding: '0.6rem 0.85rem',
                        borderRadius: 'var(--radius-xs)',
                        borderLeft: '2px solid var(--accent-primary)',
                        lineHeight: 1.5
                      }}
                    >
                      {session.transcriptSnippet}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
