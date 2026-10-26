import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useConversation } from '@elevenlabs/react';
import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  ArrowLeft,
  Volume2,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Send,
  AlertCircle,
  Bot,
  User,
  Clock,
  Radio
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { agentService, IS_MOCK_MODE } from '../services/agentService';
import type { Agent, VoiceOption } from '../types/agent';

type CallState =
  | 'idle'
  | 'requesting_permission'
  | 'connecting'
  | 'connected'
  | 'ended'
  | 'permission_denied'
  | 'unsupported'
  | 'error';

interface TranscriptItem {
  id: string;
  sender: 'agent' | 'caller';
  text: string;
  timestamp: string;
}

export const VoiceTestingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const agentId = searchParams.get('agentId');

  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Call session states
  const [callState, setCallState] = useState<CallState>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [isCallerSpeaking, setIsCallerSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0); // 0 to 100 for actual mic volume
  const [frequencyBars, setFrequencyBars] = useState<number[]>([4, 4, 4, 4, 4, 4, 4]);

  // Transcript and user message input
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [customInput, setCustomInput] = useState('');

  // Audio refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const callTimerRef = useRef<number | null>(null);
  const transcriptBottomRef = useRef<HTMLDivElement | null>(null);

  // Clean up audio resources on unmount or session end
  const cleanupAudio = useCallback(() => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setIsAgentSpeaking(false);
    setIsCallerSpeaking(false);
    setAudioLevel(0);
    setFrequencyBars([4, 4, 4, 4, 4, 4, 4]);
  }, []);

  // Official ElevenLabs React conversation hook for live WebSocket audio
  const conversation = useConversation({
    onConnect: () => {
      setCallState('connected');
      setCallDuration(0);
      setIsMuted(false);
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      callTimerRef.current = window.setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    },
    onDisconnect: () => {
      cleanupAudio();
      setCallState('ended');
    },
    onError: (errMessage: string) => {
      cleanupAudio();
      setCallState('error');
      setErrorMessage(typeof errMessage === 'string' ? errMessage : 'ElevenLabs session error occurred.');
    },
    onMessage: (payload: any) => {
      if (payload && payload.message) {
        const isAgent = payload.role === 'agent' || payload.source === 'ai';
        setTranscript((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}-${isAgent ? 'agent' : 'caller'}`,
            sender: isAgent ? 'agent' : 'caller',
            text: payload.message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          }
        ]);
      }
    },
    onModeChange: ({ mode }: { mode: 'speaking' | 'listening' }) => {
      setIsAgentSpeaking(mode === 'speaking');
      setIsCallerSpeaking(mode === 'listening');
    }
  });

  // Load agents and voices
  useEffect(() => {
    let isMounted = true;
    Promise.all([agentService.getAgents(), agentService.getVoices()])
      .then(([fetchedAgents, fetchedVoices]) => {
        if (!isMounted) return;
        setAgents(fetchedAgents);
        setVoices(fetchedVoices);

        if (agentId) {
          const match = fetchedAgents.find((a) => a.id === agentId || a.agent_id === agentId);
          if (match) setSelectedAgent(match);
          else if (fetchedAgents.length > 0) setSelectedAgent(fetchedAgents[0]);
        } else if (fetchedAgents.length > 0) {
          setSelectedAgent(fetchedAgents[0]);
        }
      })
      .catch((err) => {
        if (isMounted) setErrorMessage(err?.message || 'Failed to load agent configuration.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [agentId]);

  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  // Auto-scroll transcript to bottom
  useEffect(() => {
    transcriptBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Speak agent message using browser TTS (Mock mode only)
  const speakAgentMessage = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsAgentSpeaking(true);
    };

    utterance.onend = () => {
      setIsAgentSpeaking(false);
    };

    utterance.onerror = () => {
      setIsAgentSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  // Handle agent response simulation based on prompt & instructions (Mock mode only)
  const generateAgentReply = useCallback(
    (callerText: string) => {
      if (!selectedAgent) return;

      const lower = callerText.toLowerCase();
      let reply = '';

      if (lower.includes('emergency') || lower.includes('pain') || lower.includes('bleeding')) {
        reply =
          selectedAgent.fallbackMessage ||
          `I understand this is urgent. I am immediately flagging your contact details for on-call priority assistance. Please stay on the line.`;
      } else if (lower.includes('insurance') || lower.includes('delta') || lower.includes('accept')) {
        reply = `We work with leading providers including Delta Dental, Cigna, and MetLife PPO. May I take down your subscriber ID to confirm your active benefits?`;
      } else if (lower.includes('appointment') || lower.includes('schedule') || lower.includes('book') || lower.includes('opening')) {
        reply = `I would be happy to schedule that for you. What day and time work best for you, and could I confirm your full name and phone number?`;
      } else if (lower.includes('hour') || lower.includes('open') || lower.includes('saturday')) {
        reply = selectedAgent.businessHours
          ? `Our hours are ${selectedAgent.businessHours}. We also provide emergency coverage when scheduled in advance.`
          : `We are open Monday through Friday from 8:00 AM to 5:30 PM, and Saturday from 9:00 AM to 1:00 PM.`;
      } else if (lower.includes('cost') || lower.includes('price') || lower.includes('estimate') || lower.includes('oil change')) {
        reply = `Our standard diagnostic inspection starts at $95, which is credited toward any repairs. Standard services begin at $79.99 with complimentary safety inspection.`;
      } else if (lower.includes('ready') || lower.includes('status') || lower.includes('pickup')) {
        reply = `Let me look up your job status. Could you please provide your last name or vehicle license plate number?`;
      } else {
        reply = `Thank you for sharing that. I've noted that detail for our team. Is there anything else about ${selectedAgent.businessName} I can help verify for you today?`;
      }

      const agentItem: TranscriptItem = {
        id: `msg-${Date.now()}-agent`,
        sender: 'agent',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };

      setTranscript((prev) => [...prev, agentItem]);
      speakAgentMessage(reply);
    },
    [selectedAgent, speakAgentMessage]
  );

  // Send a caller message (via ElevenLabs WebSocket in live mode, or simulation in mock mode)
  const handleSendCallerMessage = useCallback(
    (textToSend: string) => {
      if (!textToSend.trim() || callState !== 'connected') return;

      const callerItem: TranscriptItem = {
        id: `msg-${Date.now()}-caller`,
        sender: 'caller',
        text: textToSend.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };

      setTranscript((prev) => [...prev, callerItem]);
      setCustomInput('');

      if (!IS_MOCK_MODE) {
        // Send directly to ElevenLabs WebSocket conversation
        try {
          conversation.sendUserMessage(textToSend.trim());
        } catch (err: any) {
          console.warn('Failed to send text message to ElevenLabs:', err);
        }
      } else {
        // Mock simulation turn-taking
        setTimeout(() => {
          generateAgentReply(textToSend);
        }, 750);
      }
    },
    [callState, conversation, generateAgentReply]
  );

  // Start Voice Test Call (Live ElevenLabs or Mock)
  const handleStartCall = async () => {
    if (!selectedAgent) return;

    setErrorMessage(null);
    setCallState('requesting_permission');

    // Check browser compatibility for getUserMedia
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== 'function'
    ) {
      setCallState('unsupported');
      return;
    }

    try {
      // 1. Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      mediaStreamRef.current = stream;

      // 2. Setup Web Audio API analyser for genuine real-time audio input visualizer
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Live volume & bar animation loop
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateAudioVisuals = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setAudioLevel(normalized);

        // Generate 7 frequency bar heights (4px min, 36px max)
        const step = Math.floor(dataArray.length / 7) || 1;
        const bars: number[] = [];
        for (let i = 0; i < 7; i++) {
          const val = dataArray[i * step] || 0;
          const barHeight = Math.max(4, Math.round((val / 255) * 36));
          bars.push(barHeight);
        }
        setFrequencyBars(bars);

        animFrameRef.current = requestAnimationFrame(updateAudioVisuals);
      };

      animFrameRef.current = requestAnimationFrame(updateAudioVisuals);

      if (!IS_MOCK_MODE) {
        // --- REAL ELEVENLABS BROWSER SESSION VIA FASTAPI AUTHORIZATION ---
        setCallState('connecting');

        const targetAgentId = selectedAgent.agent_id || selectedAgent.id;
        if (!targetAgentId) {
          throw new Error('Selected agent does not have a provisioned ElevenLabs agent_id.');
        }

        // Authorize with backend without exposing secrets
        const sessionData = await agentService.authorizeSession(targetAgentId);
        if (!sessionData || !sessionData.signed_url) {
          throw new Error('Backend failed to return an authorized signed WebSocket URL.');
        }

        // Connect directly to ElevenLabs WebSocket using official SDK hook
        setTranscript([]);
        await conversation.startSession({
          signedUrl: sessionData.signed_url
        });
      } else {
        // --- SIMULATED MOCK MODE ---
        setCallState('connected');
        setCallDuration(0);
        setIsMuted(false);

        callTimerRef.current = window.setInterval(() => {
          setCallDuration((prev) => prev + 1);
        }, 1000);

        const greeting = selectedAgent.firstMessage || 'Hello! How may I assist you today?';
        const initialItem: TranscriptItem = {
          id: `msg-initial-${Date.now()}`,
          sender: 'agent',
          text: greeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };
        setTranscript([initialItem]);
        speakAgentMessage(greeting);
      }
    } catch (err: any) {
      cleanupAudio();
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCallState('permission_denied');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCallState('error');
        setErrorMessage('No microphone audio input device was found on this system.');
      } else {
        setCallState('error');
        setErrorMessage(err.message || 'Unable to establish voice session with ElevenLabs.');
      }
    }
  };

  // End Call
  const handleEndCall = async () => {
    if (!IS_MOCK_MODE) {
      try {
        await conversation.endSession();
      } catch {
        // Safe clean teardown
      }
    }
    cleanupAudio();
    setCallState('ended');
  };

  // Toggle Microphone Mute
  const toggleMute = () => {
    const nextMuteState = !isMuted;
    if (!IS_MOCK_MODE) {
      try {
        conversation.setMuted(nextMuteState);
      } catch {
        // Fallback
      }
    }

    if (mediaStreamRef.current) {
      const audioTracks = mediaStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !nextMuteState;
      });
    }

    setIsMuted(nextMuteState);
    if (nextMuteState) {
      setAudioLevel(0);
      setFrequencyBars([4, 4, 4, 4, 4, 4, 4]);
    }
  };

  // Switch agent
  const handleAgentSelect = (newAgentId: string) => {
    if (callState === 'connected') {
      handleEndCall();
    }
    setSearchParams({ agentId: newAgentId });
    const match = agents.find((a) => a.id === newAgentId || a.agent_id === newAgentId);
    if (match) {
      setSelectedAgent(match);
      setTranscript([]);
      setCallState('idle');
    }
  };

  // Sample prompt chips for the current business type
  const samplePrompts =
    selectedAgent?.businessType === 'dental'
      ? [
          'Do you accept Delta Dental insurance?',
          'I have a toothache, do you have an opening today?',
          'What are your Saturday office hours?'
        ]
      : selectedAgent?.businessType === 'auto_repair'
      ? [
          'How much is a synthetic oil change?',
          'My check engine light is flashing.',
          'Is my car ready for pickup?'
        ]
      : [
          'What are your business hours?',
          'Can I schedule a consultation this week?',
          'Who can I speak with regarding my account?'
        ];

  const selectedVoiceInfo = voices.find(
    (v) => v.id === selectedAgent?.voiceId || v.elevenLabsVoiceId === selectedAgent?.voiceId
  );

  return (
    <div className="vf-container" style={{ maxWidth: '1060px', paddingBottom: '3rem' }}>
      {/* Back Link */}
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

      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid var(--border-default)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.85rem' }}>Voice Testing Studio</h1>
            {IS_MOCK_MODE ? (
              <Badge variant="mock">Simulation Mode</Badge>
            ) : (
              <Badge variant="active" dot>ElevenLabs Live Stream</Badge>
            )}
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Real-time interactive audio room with live microphone frequency detection & conversational turn-taking
          </p>
        </div>

        {/* Agent Selector Dropdown */}
        {agents.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label htmlFor="agent-select" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Target Agent:
            </label>
            <select
              id="agent-select"
              value={selectedAgent?.id || selectedAgent?.agent_id || ''}
              onChange={(e) => handleAgentSelect(e.target.value)}
              className="vf-select"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.825rem', minWidth: '220px' }}
            >
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.businessName})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Honest Mode Notice Banner */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface-raised)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.75rem 1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)'
        }}
      >
        <Radio size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
        <div>
          {IS_MOCK_MODE ? (
            <>
              <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Local Studio Testing: </strong>
              Microphone input and audio levels are real-time Web Audio API streams. Voice replies use browser speech synthesis.
            </>
          ) : (
            <>
              <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>ElevenLabs Conversational AI: </strong>
              Live browser audio room authorized via FastAPI (<code style={{ color: 'var(--accent-primary)', backgroundColor: 'var(--bg-surface)', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>POST /api/agents/{'{agent_id}'}/session</code>). Audio streams bidirectionally in real-time over secure WebSocket.
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div
          style={{
            padding: '3rem',
            textAlign: 'center',
            backgroundColor: 'var(--bg-surface-warm)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)'
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
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Loading voice studio configuration...
          </p>
        </div>
      ) : !selectedAgent ? (
        <div
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            backgroundColor: 'var(--bg-surface-warm)',
            border: '1px dashed var(--border-default)',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <Bot size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>No AI receptionist configured</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Create your first voice agent before starting a voice studio session.
          </p>
          <Button onClick={() => navigate('/builder')}>Open Agent Builder</Button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '1.5rem',
            alignItems: 'start'
          }}
        >
          {/* Main Studio 2-Column Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(320px, 380px) 1fr',
              gap: '1.5rem',
              alignItems: 'stretch'
            }}
          >
            {/* Left Column: Voice Call Console & Audio Visualizer */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface-warm)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                padding: '1.75rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {/* Agent Overview */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: 'var(--accent-primary)',
                      background: 'var(--accent-subtle)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--accent-border)'
                    }}
                  >
                    {selectedAgent.businessType.replace('_', ' ')}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <Volume2 size={13} style={{ color: 'var(--accent-primary)' }} />
                    <span>Voice: <strong>{selectedVoiceInfo?.name || selectedAgent.voiceId}</strong></span>
                  </div>
                </div>

                <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                  {selectedAgent.name}
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  {selectedAgent.businessName} • {selectedAgent.language || 'English (US)'}
                </p>

                {selectedAgent.agent_id && (
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)',
                      fontFamily: 'monospace',
                      marginBottom: '1.25rem',
                      wordBreak: 'break-all'
                    }}
                  >
                    ElevenLabs ID: {selectedAgent.agent_id}
                  </div>
                )}

                {/* State-specific UI Central Element */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-surface-raised)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '1.75rem 1rem',
                    textAlign: 'center',
                    marginBottom: '1.5rem'
                  }}
                >
                  {callState === 'idle' && (
                    <div>
                      <div
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--accent-subtle)',
                          border: '1px solid var(--accent-border)',
                          color: 'var(--accent-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 1rem'
                        }}
                      >
                        <Mic size={28} />
                      </div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                        Studio Idle
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Microphone access will be requested when you begin the call.
                      </p>
                    </div>
                  )}

                  {callState === 'requesting_permission' && (
                    <div>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          border: '3px solid var(--accent-primary)',
                          borderTopColor: 'transparent',
                          borderRadius: '50%',
                          margin: '0 auto 1rem',
                          animation: 'vf-spin 0.8s linear infinite'
                        }}
                      />
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                        Requesting Microphone...
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Please click "Allow" in your browser prompt to enable live voice input.
                      </p>
                    </div>
                  )}

                  {callState === 'connecting' && (
                    <div>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          border: '3px solid var(--accent-primary)',
                          borderTopColor: 'transparent',
                          borderRadius: '50%',
                          margin: '0 auto 1rem',
                          animation: 'vf-spin 0.8s linear infinite'
                        }}
                      />
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                        {IS_MOCK_MODE ? 'Connecting Audio Session...' : 'Authorizing ElevenLabs Session...'}
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {IS_MOCK_MODE
                          ? 'Initializing Web Audio analyzer & synthesis pipeline.'
                          : 'Requesting signed WebSocket URL & connecting to ElevenLabs...'}
                      </p>
                    </div>
                  )}

                  {callState === 'connected' && (
                    <div>
                      {/* Active Call Status */}
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-full)',
                          background: isAgentSpeaking
                            ? 'var(--accent-subtle)'
                            : isMuted
                            ? 'var(--status-warning-bg)'
                            : 'var(--status-active-bg)',
                          border: `1px solid ${
                            isAgentSpeaking
                              ? 'var(--accent-border)'
                              : isMuted
                              ? 'var(--status-warning-border)'
                              : 'var(--status-active-border)'
                          }`,
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          color: isAgentSpeaking
                            ? 'var(--accent-primary)'
                            : isMuted
                            ? 'var(--status-warning)'
                            : 'var(--status-active)',
                          marginBottom: '0.75rem'
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: isAgentSpeaking
                              ? 'var(--accent-primary)'
                              : isMuted
                              ? 'var(--status-warning)'
                              : 'var(--status-active)'
                          }}
                        />
                        {isAgentSpeaking
                          ? 'Agent Speaking...'
                          : isMuted
                          ? 'Microphone Muted'
                          : isCallerSpeaking
                          ? 'Listening to You...'
                          : 'Connected • Listening'}
                      </div>

                      {/* Timer */}
                      <div
                        style={{
                          fontSize: '1.75rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          marginBottom: '1rem'
                        }}
                      >
                        {formatTime(callDuration)}
                      </div>

                      {/* Genuine Web Audio Level Frequency Bars */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                          gap: '4px',
                          height: '40px',
                          padding: '0 1rem',
                          marginBottom: '0.5rem'
                        }}
                      >
                        {frequencyBars.map((height, idx) => (
                          <div
                            key={idx}
                            style={{
                              width: '6px',
                              height: `${height}px`,
                              backgroundColor: isMuted
                                ? 'var(--text-muted)'
                                : isCallerSpeaking
                                ? 'var(--accent-primary)'
                                : isAgentSpeaking
                                ? 'var(--status-info)'
                                : 'var(--border-strong)',
                              borderRadius: '2px',
                              transition: 'height 80ms ease, background-color 150ms ease'
                            }}
                          />
                        ))}
                      </div>

                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {isMuted
                          ? 'Mic muted — audio level inactive'
                          : `Live input volume: ${audioLevel}%`}
                      </div>
                    </div>
                  )}

                  {callState === 'ended' && (
                    <div>
                      <Clock size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 0.75rem' }} />
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                        Test Session Ended
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        Call lasted <strong>{formatTime(callDuration)}</strong> with{' '}
                        <strong>{transcript.length} turns</strong> exchanged.
                      </p>
                    </div>
                  )}

                  {callState === 'permission_denied' && (
                    <div style={{ textAlign: 'left', padding: '0 0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--status-danger)', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>
                        <ShieldAlert size={16} />
                        <span>Microphone Permission Blocked</span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '0.75rem' }}>
                        Your browser blocked microphone access. To test live audio, click the camera/padlock icon in your browser address bar and switch microphone to <strong>Allow</strong>.
                      </p>
                    </div>
                  )}

                  {callState === 'unsupported' && (
                    <div style={{ textAlign: 'left', padding: '0 0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--status-warning)', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>
                        <AlertCircle size={16} />
                        <span>Browser Audio Unsupported</span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                        The Web Audio MediaStream API is unavailable in this environment. Please open in Google Chrome, Edge, or Safari over HTTPS or localhost.
                      </p>
                    </div>
                  )}

                  {callState === 'error' && (
                    <div style={{ textAlign: 'left', padding: '0 0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--status-danger)', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>
                        <AlertCircle size={16} />
                        <span>Session Error</span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                        {errorMessage || 'Unable to establish the audio session.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {callState === 'connected' ? (
                  <div style={{ display: 'flex', gap: '0.65rem' }}>
                    <Button
                      variant="secondary"
                      onClick={toggleMute}
                      icon={isMuted ? <MicOff size={15} /> : <Mic size={15} />}
                      style={{ flex: 1 }}
                    >
                      {isMuted ? 'Unmute' : 'Mute Mic'}
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleEndCall}
                      icon={<PhoneOff size={15} />}
                      style={{ flex: 1, backgroundColor: 'var(--status-danger)', borderColor: 'var(--status-danger)' }}
                    >
                      End Call
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleStartCall}
                    disabled={callState === 'requesting_permission' || callState === 'connecting'}
                    icon={<Phone size={15} />}
                    style={{ width: '100%', padding: '0.75rem 1rem' }}
                  >
                    {callState === 'ended' ? 'Start Another Test Call' : 'Start Voice Test Call'}
                  </Button>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/builder?agentId=${selectedAgent.id}`)}
                  >
                    Edit Instructions
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setTranscript([]);
                      setCallState('idle');
                    }}
                    icon={<RefreshCw size={12} />}
                  >
                    Reset Studio
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column: Live Conversation Transcript & Caller Inquiries */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface-warm)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-sm)',
                height: '560px'
              }}
            >
              {/* Transcript Header */}
              <div
                style={{
                  padding: '1rem 1.25rem',
                  borderBottom: '1px solid var(--border-default)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Live Conversation Feed
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Bi-directional transcript between caller and {selectedAgent.name}
                  </span>
                </div>

                <Badge variant={callState === 'connected' ? 'active' : 'muted'} dot>
                  {callState === 'connected' ? 'Session Active' : 'Waiting for Call'}
                </Badge>
              </div>

              {/* Transcript Body */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}
              >
                {transcript.length === 0 ? (
                  <div
                    style={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      padding: '2rem'
                    }}
                  >
                    <Sparkles size={24} style={{ color: 'var(--accent-primary)', opacity: 0.6, marginBottom: '0.75rem' }} />
                    <p style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                      Click <strong>"Start Voice Test Call"</strong> to begin.
                    </p>
                    <p style={{ fontSize: '0.78rem' }}>
                      {IS_MOCK_MODE
                        ? 'The receptionist will greet you with their configured first message.'
                        : 'The ElevenLabs agent will stream live voice over WebSocket.'}
                    </p>
                  </div>
                ) : (
                  transcript.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: item.sender === 'caller' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        alignSelf: item.sender === 'caller' ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.7rem',
                          color: 'var(--text-muted)',
                          marginBottom: '0.2rem',
                          padding: '0 0.25rem'
                        }}
                      >
                        {item.sender === 'caller' ? (
                          <>
                            <span>You (Caller)</span>
                            <User size={11} />
                            <span>•</span>
                            <span>{item.timestamp}</span>
                          </>
                        ) : (
                          <>
                            <Bot size={11} style={{ color: 'var(--accent-primary)' }} />
                            <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                              {selectedAgent.name}
                            </span>
                            <span>•</span>
                            <span>{item.timestamp}</span>
                          </>
                        )}
                      </div>

                      <div
                        style={{
                          padding: '0.7rem 0.95rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.85rem',
                          lineHeight: 1.5,
                          backgroundColor:
                            item.sender === 'caller'
                              ? 'var(--bg-surface-raised)'
                              : 'var(--bg-surface)',
                          border: `1px solid ${
                            item.sender === 'caller'
                              ? 'var(--border-strong)'
                              : 'var(--accent-border)'
                          }`,
                          color: 'var(--text-primary)',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        {item.text}
                      </div>
                    </div>
                  ))
                )}
                <div ref={transcriptBottomRef} />
              </div>

              {/* Caller Interactive Testing Tray */}
              <div
                style={{
                  padding: '1rem 1.25rem',
                  borderTop: '1px solid var(--border-default)',
                  backgroundColor: 'var(--bg-surface)'
                }}
              >
                {/* Quick Caller Prompts */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Quick Caller Scenarios:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {samplePrompts.map((promptText, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendCallerMessage(promptText)}
                        disabled={callState !== 'connected'}
                        style={{
                          background: 'var(--bg-surface-warm)',
                          border: '1px solid var(--border-default)',
                          borderRadius: 'var(--radius-xs)',
                          padding: '0.25rem 0.55rem',
                          fontSize: '0.74rem',
                          color: callState === 'connected' ? 'var(--text-secondary)' : 'var(--text-muted)',
                          cursor: callState === 'connected' ? 'pointer' : 'not-allowed',
                          transition: 'all var(--transition-fast)',
                          textAlign: 'left'
                        }}
                        onMouseEnter={(e) => {
                          if (callState === 'connected') {
                            e.currentTarget.style.borderColor = 'var(--accent-primary)';
                            e.currentTarget.style.color = 'var(--text-primary)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (callState === 'connected') {
                            e.currentTarget.style.borderColor = 'var(--border-default)';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                          }
                        }}
                      >
                        "{promptText}"
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Caller Input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendCallerMessage(customInput);
                  }}
                  style={{ display: 'flex', gap: '0.5rem' }}
                >
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder={
                      callState === 'connected'
                        ? 'Type a caller response or speak into your mic...'
                        : 'Start the call above to interact...'
                    }
                    disabled={callState !== 'connected'}
                    className="vf-input"
                    style={{ fontSize: '0.825rem', padding: '0.5rem 0.75rem' }}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={callState !== 'connected' || !customInput.trim()}
                    icon={<Send size={13} />}
                  >
                    Send
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
