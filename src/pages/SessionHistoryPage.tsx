import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  RefreshCw,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { RecentSessionsList } from '../components/dashboard/RecentSessionsList';
import { agentService, IS_MOCK_MODE } from '../services/agentService';
import type { Session, SessionOutcome } from '../types/agent';

export const SessionHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState<'all' | SessionOutcome>('all');

  const handleManualRefresh = async () => {
    setLoading(true);
    try {
      const data = await agentService.getSessions(25);
      setSessions(data);
    } catch {
      // Keep existing sessions on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    agentService
      .getSessions(25)
      .then((data) => {
        if (isMounted) {
          setSessions(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter sessions by outcome and query
  const filteredSessions = sessions.filter((s) => {
    const matchesOutcome = outcomeFilter === 'all' || s.outcome === outcomeFilter;
    const matchesQuery =
      searchQuery.trim() === '' ||
      s.callerNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesOutcome && matchesQuery;
  });

  // Calculate real metrics from sessions list
  const totalDuration = sessions.reduce((sum, s) => sum + s.durationSeconds, 0);
  const appointmentsCount = sessions.filter((s) => s.outcome === 'appointment_booked').length;
  const escalationsCount = sessions.filter((s) => s.outcome === 'transferred_to_human').length;

  const formatTotalTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    return `${mins}m`;
  };

  return (
    <div className="vf-container" style={{ paddingBottom: '3.5rem' }}>
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.85rem',
          marginBottom: '1rem',
          padding: 0,
          transition: 'color var(--transition-fast)'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
      >
        <ArrowLeft size={15} />
        <span>Back to Receptionist Dashboard</span>
      </button>

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.85rem' }}>Call Session Logs</h1>
            {IS_MOCK_MODE && <Badge variant="mock">Sample Session Feed</Badge>}
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Review past caller conversations, appointment outcomes, and transcript audits
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Button
            variant="ghost"
            size="sm"
            icon={<RefreshCw size={13} />}
            onClick={handleManualRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => navigate('/builder')}
          >
            New Receptionist
          </Button>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '1.75rem',
          padding: '1rem 1.25rem',
          backgroundColor: 'var(--bg-surface-warm)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)'
        }}
      >
        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            Total Calls Logged
          </span>
          <div style={{ fontSize: '1.4rem', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            {sessions.length}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            Appointments Scheduled
          </span>
          <div style={{ fontSize: '1.4rem', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--status-active)' }}>
            {appointmentsCount}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            Transferred to Staff
          </span>
          <div style={{ fontSize: '1.4rem', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--status-warning)' }}>
            {escalationsCount}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            Total Recorded Talk Time
          </span>
          <div style={{ fontSize: '1.4rem', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            {formatTotalTime(totalDuration)}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem'
        }}
      >
        {/* Outcome Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginRight: '0.25rem' }}>
            <Filter size={13} /> Filter:
          </span>
          {(
            [
              { id: 'all', label: 'All Sessions' },
              { id: 'appointment_booked', label: 'Appointments' },
              { id: 'query_resolved', label: 'Inquiries' },
              { id: 'transferred_to_human', label: 'Escalations' }
            ] as const
          ).map((tab) => {
            const isActive = outcomeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setOutcomeFilter(tab.id)}
                style={{
                  background: isActive ? 'var(--accent-subtle)' : 'var(--bg-surface-warm)',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  border: `1px solid ${isActive ? 'var(--accent-border)' : 'var(--border-default)'}`,
                  borderRadius: 'var(--radius-xs)',
                  padding: '0.3rem 0.65rem',
                  fontSize: '0.78rem',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by caller, receptionist, or note..."
            className="vf-input"
            style={{
              paddingLeft: '2.2rem',
              fontSize: '0.8rem',
              paddingTop: '0.4rem',
              paddingBottom: '0.4rem'
            }}
          />
        </div>
      </div>

      {/* Sessions Feed */}
      <RecentSessionsList
        sessions={filteredSessions}
        title={
          outcomeFilter === 'all'
            ? `Logged Sessions (${filteredSessions.length})`
            : `${outcomeFilter.replace(/_/g, ' ')} (${filteredSessions.length})`
        }
        subtitle="Individual caller sessions recorded in chronological order"
      />
    </div>
  );
};
