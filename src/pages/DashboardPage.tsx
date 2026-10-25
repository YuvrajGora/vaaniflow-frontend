import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, RefreshCw, Bot, AlertCircle } from 'lucide-react';
import { agentService } from '../services/agentService';
import type { Agent, DashboardMetrics, Session } from '../types/agent';
import { QuickStats } from '../components/dashboard/QuickStats';
import { AgentCard } from '../components/dashboard/AgentCard';
import { RecentSessionsList } from '../components/dashboard/RecentSessionsList';
import { SetupChecklist } from '../components/dashboard/SetupChecklist';
import { Button } from '../components/common/Button';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleManualRefresh = async () => {
    setError(null);
    setLoading(true);
    try {
      const [fetchedMetrics, fetchedAgents, fetchedSessions] = await Promise.all([
        agentService.getDashboardMetrics(),
        agentService.getAgents(),
        agentService.getSessions(5)
      ]);
      setMetrics(fetchedMetrics);
      setAgents(fetchedAgents);
      setSessions(fetchedSessions);
    } catch (err: any) {
      setError(err?.message || 'Failed to refresh dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      agentService.getDashboardMetrics(),
      agentService.getAgents(),
      agentService.getSessions(5)
    ])
      .then(([fetchedMetrics, fetchedAgents, fetchedSessions]) => {
        if (!isMounted) return;
        setMetrics(fetchedMetrics);
        setAgents(fetchedAgents);
        setSessions(fetchedSessions);
      })
      .catch((err: any) => {
        if (isMounted) {
          setError(err?.message || 'Failed to load dashboard data.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="vf-container" style={{ paddingBottom: '3.5rem' }}>
      {/* Top Welcome & Setup Guidance */}
      <SetupChecklist />

      {/* KPI Stats */}
      {metrics && <QuickStats metrics={metrics} />}

      {/* Agents Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.25rem'
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.55rem', fontFamily: 'var(--font-display)', fontWeight: 500, color: 'var(--text-primary)' }}>
              Configured Receptionists ({agents.length})
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Inbound voice agents handling caller inquiries and appointments for your businesses
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
              Create Receptionist
            </Button>
          </div>
        </div>

        {loading ? (
          <div
            style={{
              padding: '3rem',
              textAlign: 'center',
              backgroundColor: 'var(--bg-surface-warm)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-secondary)'
            }}
          >
            <div
              style={{
                width: '30px',
                height: '30px',
                border: '3px solid var(--accent-primary)',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                margin: '0 auto 1rem',
                animation: 'vf-spin 0.8s linear infinite'
              }}
            />
            <p style={{ fontSize: '0.875rem' }}>Loading configured voice receptionists...</p>
          </div>
        ) : error ? (
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--status-danger-bg)',
              border: '1px solid var(--status-danger-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--status-danger)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <AlertCircle size={20} />
            <div>
              <h4 style={{ fontWeight: 600, fontSize: '0.9rem' }}>Error connecting to receptionist service</h4>
              <p style={{ fontSize: '0.825rem', marginTop: '0.15rem' }}>{error}</p>
            </div>
          </div>
        ) : agents.length === 0 ? (
          <div
            style={{
              padding: '3.5rem 2rem',
              textAlign: 'center',
              backgroundColor: 'var(--bg-surface-warm)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-default)'
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'var(--accent-subtle)',
                color: 'var(--accent-primary)',
                border: '1px solid var(--accent-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}
            >
              <Bot size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', marginBottom: '0.35rem' }}>
              No AI receptionists found
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.25rem' }}>
              Create your first voice receptionist in under 2 minutes using a plain-language prompt or industry template.
            </p>
            <Button icon={<Plus size={14} />} onClick={() => navigate('/builder')}>
              Build Your First Receptionist
            </Button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Sessions List */}
      {sessions.length > 0 && <RecentSessionsList sessions={sessions} />}
    </div>
  );
};
