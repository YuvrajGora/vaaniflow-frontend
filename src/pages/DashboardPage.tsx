import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, RefreshCw, Bot, AlertCircle } from 'lucide-react';
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
      setError(err?.message || 'Failed to load dashboard data.');
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
    <div className="vf-container">
      {/* Top Welcome & Setup Guidance */}
      <SetupChecklist />

      {/* KPI Stats */}
      {metrics && <QuickStats metrics={metrics} />}

      {/* Agents Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              AI Receptionists ({agents.length})
            </h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Configured voice agents answering customer calls for your businesses
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Button
              variant="ghost"
              size="sm"
              icon={<RefreshCw size={14} />}
              onClick={handleManualRefresh}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<PlusCircle size={15} />}
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
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-secondary)'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                border: '3px solid var(--cyan-500)',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                margin: '0 auto 1rem',
                animation: 'vf-spin 0.8s linear infinite'
              }}
            />
            <p style={{ fontSize: '0.9rem' }}>Loading configured voice receptionists...</p>
          </div>
        ) : error ? (
          <div
            style={{
              padding: '2rem',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-lg)',
              color: 'var(--rose-400)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <AlertCircle size={20} />
            <div>
              <h4 style={{ fontWeight: 600 }}>Error connecting to receptionist service</h4>
              <p style={{ fontSize: '0.85rem' }}>{error}</p>
            </div>
          </div>
        ) : agents.length === 0 ? (
          <div
            style={{
              padding: '3rem 2rem',
              textAlign: 'center',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--border-default)'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--cyan-subtle)',
                color: 'var(--cyan-400)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}
            >
              <Bot size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>No AI receptionists found</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Create your first voice receptionist in under 2 minutes using an industry template.
            </p>
            <Button icon={<PlusCircle size={15} />} onClick={() => navigate('/builder')}>
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
