import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { RecentSessionsList } from '../components/dashboard/RecentSessionsList';
import { agentService } from '../services/agentService';
import type { Session } from '../types/agent';

export const SessionHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const handleManualRefresh = async () => {
    setLoading(true);
    const data = await agentService.getSessions(20);
    setSessions(data);
    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    agentService.getSessions(20).then((data) => {
      if (isMounted) {
        setSessions(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="vf-container">
      <button
        onClick={() => navigate('/')}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--cyan-400)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.85rem',
          marginBottom: '1rem',
          padding: 0
        }}
      >
        <ArrowLeft size={15} />
        <span>Back to Receptionist Dashboard</span>
      </button>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Call Session Logs</h1>
            <Badge variant="cyan">Milestone 2 Next</Badge>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Review past caller conversations, appointment outcomes, and transcript audits
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button variant="ghost" size="sm" icon={<RefreshCw size={14} />} onClick={handleManualRefresh} disabled={loading}>
            Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/builder')}>
            New Receptionist
          </Button>
        </div>
      </div>

      <RecentSessionsList sessions={sessions} />
    </div>
  );
};
