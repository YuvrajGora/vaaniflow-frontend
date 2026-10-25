import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Mic, ArrowLeft, Sparkles } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { agentService } from '../services/agentService';
import type { Agent } from '../types/agent';

export const VoiceTestingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const agentId = searchParams.get('agentId');
  const [agent, setAgent] = useState<Agent | null>(null);

  useEffect(() => {
    const fetchAgent = async () => {
      const agents = await agentService.getAgents();
      if (agentId) {
        const found = agents.find((a) => a.id === agentId);
        if (found) setAgent(found);
      } else if (agents.length > 0) {
        setAgent(agents[0]);
      }
    };
    fetchAgent();
  }, [agentId]);

  return (
    <div className="vf-container" style={{ maxWidth: '900px' }}>
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

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Live Voice Testing Studio</h1>
            <Badge variant="cyan">Milestone 2 Next</Badge>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Real-time interactive voice testing room with microphone controls, audio visualizer & live transcript
          </p>
        </div>
      </div>

      <Card style={{ textAlign: 'center', padding: '3rem 2rem', marginBottom: '2rem' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(6, 182, 212, 0.04) 100%)',
            border: '2px solid var(--cyan-400)',
            color: 'var(--cyan-400)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 0 25px rgba(6, 182, 212, 0.25)'
          }}
        >
          <Mic size={36} />
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Testing Target: {agent?.name || 'Receptionist'}
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '550px', margin: '0 auto 1.5rem' }}>
          {agent?.businessName} • ElevenLabs voice: <strong style={{ color: 'var(--cyan-300)' }}>{agent?.voiceId}</strong>
        </p>

        {/* Status Notice */}
        <div
          style={{
            maxWidth: '560px',
            margin: '0 auto 2rem',
            padding: '1rem 1.25rem',
            backgroundColor: 'var(--bg-surface-raised)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--cyan-400)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
            <Sparkles size={16} />
            <span>Milestone 1 Complete — Milestone 2 Preview</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            In Milestone 2, this screen connects directly to the ElevenLabs Conversational React SDK (`@elevenlabs/react`) and your teammate's backend session token endpoint. It will provide:
          </p>
          <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
            <li>Direct WebRTC microphone streaming with mute/unmute</li>
            <li>Real-time dynamic voice visualizer & latency monitor</li>
            <li>Bi-directional live conversation transcript feed</li>
            <li>Zero frontend secret exposure (token relayed via FastAPI)</li>
          </ul>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Button variant="primary" onClick={() => navigate('/builder')}>
            Customize Receptionist Instructions
          </Button>
          <Button variant="secondary" onClick={() => navigate('/')}>
            Return to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};
