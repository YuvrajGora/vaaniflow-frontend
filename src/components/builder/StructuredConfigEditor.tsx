import React, { useState } from 'react';
import {
  User,
  Target,
  Shield,
  MessageSquare,
  ListOrdered,
  PhoneForwarded,
  Plus,
  Trash2,
  FileText,
  SlidersHorizontal
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { VoiceSelector } from './VoiceSelector';
import type { VoiceOption } from '../../types/agent';

export interface StructuredConfigFormState {
  name: string;
  description: string;
  businessName: string;
  businessType: string;
  persona: string;
  goals: string[];
  firstMessage: string;
  instructions: string;
  guardrails: string[];
  language: string;
  voiceId: string;
  conversationSteps: string[];
  requiredInformation: string[];
  escalationTriggers: string[];
  transferPhone: string;
  fallbackMessage: string;
  businessHours: string;
  businessAddress: string;
}

interface StructuredConfigEditorProps {
  config: StructuredConfigFormState;
  onChange: (updater: (prev: StructuredConfigFormState) => StructuredConfigFormState) => void;
  voices: VoiceOption[];
  originalPrompt?: string;
  isMockGenerated?: boolean;
}

type EditorSection = 'all' | 'identity' | 'persona' | 'dialogue' | 'guardrails' | 'workflow' | 'escalation';

export const StructuredConfigEditor: React.FC<StructuredConfigEditorProps> = ({
  config,
  onChange,
  voices,
  originalPrompt,
  isMockGenerated = true
}) => {
  const [activeSection, setActiveSection] = useState<EditorSection>('identity');
  const [newGoal, setNewGoal] = useState('');
  const [newGuardrail, setNewGuardrail] = useState('');
  const [newReqInfo, setNewReqInfo] = useState('');
  const [newTrigger, setNewTrigger] = useState('');

  // Helpers for list modification
  const handleAddGoal = () => {
    if (!newGoal.trim()) return;
    onChange((prev) => ({ ...prev, goals: [...prev.goals, newGoal.trim()] }));
    setNewGoal('');
  };

  const handleRemoveGoal = (index: number) => {
    onChange((prev) => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index)
    }));
  };

  const handleAddGuardrail = () => {
    if (!newGuardrail.trim()) return;
    onChange((prev) => ({ ...prev, guardrails: [...prev.guardrails, newGuardrail.trim()] }));
    setNewGuardrail('');
  };

  const handleRemoveGuardrail = (index: number) => {
    onChange((prev) => ({
      ...prev,
      guardrails: prev.guardrails.filter((_, i) => i !== index)
    }));
  };

  const handleAddReqInfo = () => {
    if (!newReqInfo.trim()) return;
    onChange((prev) => ({ ...prev, requiredInformation: [...prev.requiredInformation, newReqInfo.trim()] }));
    setNewReqInfo('');
  };

  const handleRemoveReqInfo = (index: number) => {
    onChange((prev) => ({
      ...prev,
      requiredInformation: prev.requiredInformation.filter((_, i) => i !== index)
    }));
  };

  const handleAddTrigger = () => {
    if (!newTrigger.trim()) return;
    onChange((prev) => ({ ...prev, escalationTriggers: [...prev.escalationTriggers, newTrigger.trim()] }));
    setNewTrigger('');
  };

  const handleRemoveTrigger = (index: number) => {
    onChange((prev) => ({
      ...prev,
      escalationTriggers: prev.escalationTriggers.filter((_, i) => i !== index)
    }));
  };

  const insertInstructionSnippet = (type: 'booking' | 'emergency' | 'hours') => {
    let snippet = '';
    if (type === 'booking') {
      snippet = `\n\nBOOKING WORKFLOW:\n1. Collect full name and mobile number.\n2. Inquire about preferred date, morning/afternoon preference.\n3. Note service requested and confirm booking summary.`;
    } else if (type === 'emergency') {
      snippet = `\n\nEMERGENCY ESCALATION:\nIf the caller reports severe trauma, acute pain, or critical urgency, reassure them and immediately transfer to ${config.transferPhone || 'the emergency line'}.`;
    } else if (type === 'hours') {
      snippet = `\n\nHOURS & LOCATION:\nLocation: ${config.businessAddress || 'Main Business Office'}.\nHours of Operation: ${config.businessHours || 'Monday through Friday, 8:00 AM to 5:00 PM'}.`;
    }
    onChange((prev) => ({ ...prev, instructions: prev.instructions.trim() + snippet }));
  };

  const SECTIONS: { id: EditorSection; label: string; icon: React.ReactNode }[] = [
    { id: 'identity', label: 'Identity & Voice', icon: <User size={14} /> },
    { id: 'persona', label: 'Persona & Goals', icon: <Target size={14} /> },
    { id: 'dialogue', label: 'Dialogue & Prompt', icon: <MessageSquare size={14} /> },
    { id: 'guardrails', label: 'Guardrails', icon: <Shield size={14} /> },
    { id: 'workflow', label: 'Workflow & Data', icon: <ListOrdered size={14} /> },
    { id: 'escalation', label: 'Escalation Rules', icon: <PhoneForwarded size={14} /> },
    { id: 'all', label: 'All Sections', icon: <SlidersHorizontal size={14} /> }
  ];

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden'
      }}
    >
      {/* Editorial Header Bar */}
      <div
        style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--border-default)',
          backgroundColor: 'var(--bg-surface-warm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, fontFamily: 'var(--font-display)', margin: 0 }}>
              Draft Configuration
            </h2>
            {isMockGenerated && <Badge variant="mock">Local Demo Synthesis</Badge>}
          </div>
          {originalPrompt && (
            <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: 0, fontStyle: 'italic', maxWidth: '650px' }}>
              Synthesized from: "{originalPrompt.length > 110 ? originalPrompt.slice(0, 110) + '...' : originalPrompt}"
            </p>
          )}
        </div>
        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
          Review and edit fields before saving
        </span>
      </div>

      {/* Understated Section Navigation Tabs */}
      <nav
        style={{
          display: 'flex',
          overflowX: 'auto',
          borderBottom: '1px solid var(--border-default)',
          backgroundColor: 'var(--bg-surface-raised)',
          padding: '0 1rem'
        }}
      >
        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.75rem 1rem',
                border: 'none',
                background: 'transparent',
                fontSize: '0.825rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                borderBottom: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)'
              }}
            >
              <span style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                {sec.icon}
              </span>
              <span>{sec.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Form Body */}
      <div style={{ padding: '2rem 1.75rem' }}>
        {/* ================================================================= */}
        {/* 1. Identity & Voice */}
        {/* ================================================================= */}
        {(activeSection === 'all' || activeSection === 'identity') && (
          <section style={{ marginBottom: activeSection === 'all' ? '2.5rem' : 0 }}>
            <div style={{ marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-hairline)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                1. Identity & Spoken Voice
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Define how the receptionist introduces itself and which voice model it utilizes.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div className="vf-form-group" style={{ margin: 0 }}>
                <label className="vf-label">
                  <span>Agent Persona Name</span>
                </label>
                <input
                  type="text"
                  className="vf-input"
                  value={config.name}
                  onChange={(e) => onChange((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Maya — Front Desk Coordinator"
                  required
                />
              </div>

              <div className="vf-form-group" style={{ margin: 0 }}>
                <label className="vf-label">
                  <span>Business / Organization Name</span>
                </label>
                <input
                  type="text"
                  className="vf-input"
                  value={config.businessName}
                  onChange={(e) => onChange((prev) => ({ ...prev, businessName: e.target.value }))}
                  placeholder="e.g. Apex Family Dental Care"
                  required
                />
              </div>
            </div>

            <div className="vf-form-group">
              <label className="vf-label">
                <span>Role Description</span>
                <span className="vf-hint">Brief internal summary</span>
              </label>
              <input
                type="text"
                className="vf-input"
                value={config.description}
                onChange={(e) => onChange((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="e.g. AI voice receptionist managing patient scheduling and triage"
              />
            </div>

            {/* Voice selection rows */}
            <VoiceSelector
              voices={voices}
              selectedVoiceId={config.voiceId}
              onSelectVoice={(v) => onChange((prev) => ({ ...prev, voiceId: v.id }))}
            />

            <div className="vf-form-group" style={{ margin: 0 }}>
              <label className="vf-label">
                <span>Primary Language & Dialect</span>
              </label>
              <select
                className="vf-select"
                value={config.language}
                onChange={(e) => onChange((prev) => ({ ...prev, language: e.target.value }))}
              >
                <option value="en-US">English (United States)</option>
                <option value="en-GB">English (United Kingdom)</option>
                <option value="hi-IN">Hindi / Hinglish (India)</option>
                <option value="es-ES">Spanish (Español)</option>
                <option value="fr-FR">French (Français)</option>
              </select>
            </div>
          </section>
        )}

        {/* ================================================================= */}
        {/* 2. Persona & Goals */}
        {/* ================================================================= */}
        {(activeSection === 'all' || activeSection === 'persona') && (
          <section style={{ marginBottom: activeSection === 'all' ? '2.5rem' : 0 }}>
            <div style={{ marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-hairline)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                2. Persona & Strategic Goals
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Character demeanor, conversational tone, and primary call completion objectives.
              </p>
            </div>

            <div className="vf-form-group">
              <label className="vf-label">
                <span>Persona Demeanor Summary</span>
                <span className="vf-hint">Tone, empathy, cadence</span>
              </label>
              <textarea
                rows={2}
                className="vf-textarea"
                value={config.persona}
                onChange={(e) => onChange((prev) => ({ ...prev, persona: e.target.value }))}
                placeholder="e.g. Warm, empathetic, professional front-desk coordinator who balances patient reassurance with efficient scheduling."
              />
            </div>

            <div>
              <label className="vf-label" style={{ marginBottom: '0.45rem' }}>
                <span>Primary Operational Goals</span>
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.75rem' }}>
                {config.goals.map((goal, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                      background: 'var(--bg-surface-raised)',
                      padding: '0.5rem 0.85rem',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-default)',
                      fontSize: '0.825rem'
                    }}
                  >
                    <span>• {goal}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveGoal(idx)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--status-danger)', cursor: 'pointer', padding: '0.2rem' }}
                      title="Remove goal"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="vf-input"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="Add a new goal..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddGoal();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddGoal}
                  style={{
                    background: 'var(--bg-surface-raised)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--accent-primary)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '0 0.85rem',
                    fontSize: '0.825rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Plus size={14} />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================= */}
        {/* 3. Dialogue & Instructions */}
        {/* ================================================================= */}
        {(activeSection === 'all' || activeSection === 'dialogue') && (
          <section style={{ marginBottom: activeSection === 'all' ? '2.5rem' : 0 }}>
            <div style={{ marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-hairline)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                3. Dialogue & Instructions
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                First words spoken when the phone connects, along with comprehensive system prompts.
              </p>
            </div>

            <div className="vf-form-group">
              <label className="vf-label">
                <span>Opening Phone Greeting</span>
                <span className="vf-hint">Exact words spoken upon caller connection</span>
              </label>
              <textarea
                rows={2}
                className="vf-textarea"
                value={config.firstMessage}
                onChange={(e) => onChange((prev) => ({ ...prev, firstMessage: e.target.value }))}
                placeholder="Hello! Thank you for calling..."
                required
              />
            </div>

            <div className="vf-form-group" style={{ margin: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <label className="vf-label" style={{ margin: 0 }}>
                  <span>System Instructions Prompt</span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Insert snippet:</span>
                  <button
                    type="button"
                    onClick={() => insertInstructionSnippet('booking')}
                    style={{
                      background: 'var(--bg-surface-raised)',
                      border: '1px solid var(--border-default)',
                      color: 'var(--accent-primary)',
                      borderRadius: 'var(--radius-xs)',
                      padding: '0.15rem 0.45rem',
                      fontSize: '0.72rem',
                      cursor: 'pointer'
                    }}
                  >
                    + Booking
                  </button>
                  <button
                    type="button"
                    onClick={() => insertInstructionSnippet('emergency')}
                    style={{
                      background: 'var(--bg-surface-raised)',
                      border: '1px solid var(--border-default)',
                      color: 'var(--status-warning)',
                      borderRadius: 'var(--radius-xs)',
                      padding: '0.15rem 0.45rem',
                      fontSize: '0.72rem',
                      cursor: 'pointer'
                    }}
                  >
                    + Emergency
                  </button>
                  <button
                    type="button"
                    onClick={() => insertInstructionSnippet('hours')}
                    style={{
                      background: 'var(--bg-surface-raised)',
                      border: '1px solid var(--border-default)',
                      color: 'var(--text-secondary)',
                      borderRadius: 'var(--radius-xs)',
                      padding: '0.15rem 0.45rem',
                      fontSize: '0.72rem',
                      cursor: 'pointer'
                    }}
                  >
                    + Hours
                  </button>
                </div>
              </div>

              <textarea
                rows={7}
                className="vf-textarea"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.825rem', lineHeight: 1.55 }}
                value={config.instructions}
                onChange={(e) => onChange((prev) => ({ ...prev, instructions: e.target.value }))}
                placeholder="Enter prompt instructions for the voice agent..."
              />
            </div>
          </section>
        )}

        {/* ================================================================= */}
        {/* 4. Guardrails */}
        {/* ================================================================= */}
        {(activeSection === 'all' || activeSection === 'guardrails') && (
          <section style={{ marginBottom: activeSection === 'all' ? '2.5rem' : 0 }}>
            <div style={{ marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-hairline)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                4. Operational Guardrails
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Safety constraints, privacy policies, and behavioral limits enforced during conversation.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '0.75rem' }}>
              {config.guardrails.map((gr, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    background: 'var(--bg-surface-raised)',
                    padding: '0.5rem 0.85rem',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-default)',
                    fontSize: '0.825rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Shield size={13} style={{ color: 'var(--status-warning)', flexShrink: 0 }} />
                    <span>{gr}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveGuardrail(idx)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--status-danger)', cursor: 'pointer', padding: '0.2rem' }}
                    title="Remove guardrail"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="vf-input"
                value={newGuardrail}
                onChange={(e) => setNewGuardrail(e.target.value)}
                placeholder="Add a guardrail (e.g. Keep answers under 2 sentences, never give medical advice)..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddGuardrail();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddGuardrail}
                style={{
                  background: 'var(--bg-surface-raised)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--accent-primary)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '0 0.85rem',
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Plus size={14} />
                <span>Add</span>
              </button>
            </div>
          </section>
        )}

        {/* ================================================================= */}
        {/* 5. Workflow & Required Data */}
        {/* ================================================================= */}
        {(activeSection === 'all' || activeSection === 'workflow') && (
          <section style={{ marginBottom: activeSection === 'all' ? '2.5rem' : 0 }}>
            <div style={{ marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-hairline)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                5. Conversation Workflow & Required Information
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Sequential conversational milestones and required information fields to elicit from the caller.
              </p>
            </div>

            {/* Steps list */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="vf-label" style={{ marginBottom: '0.45rem' }}>
                <span>Sequential Conversation Stages</span>
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {config.conversationSteps.map((step, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--bg-surface-raised)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-xs)',
                      padding: '0.5rem 0.85rem',
                      fontSize: '0.825rem',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <span style={{ color: 'var(--accent-primary)', fontWeight: 600, marginRight: '0.35rem' }}>
                      Stage {idx + 1}:
                    </span>
                    {step.replace(/^\d+\.\s*/, '')}
                  </div>
                ))}
              </div>
            </div>

            {/* Required info chips */}
            <div>
              <label className="vf-label" style={{ marginBottom: '0.45rem' }}>
                <span>Required Information to Collect</span>
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                {config.requiredInformation.map((info, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: 'var(--bg-surface-raised)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-default)',
                      padding: '0.25rem 0.6rem',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.78rem'
                    }}
                  >
                    <FileText size={11} style={{ color: 'var(--accent-primary)' }} />
                    <span>{info}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveReqInfo(idx)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--status-danger)', cursor: 'pointer', padding: 0, marginLeft: '0.2rem' }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="vf-input"
                  value={newReqInfo}
                  onChange={(e) => setNewReqInfo(e.target.value)}
                  placeholder="Add required data field (e.g. Insurance Carrier, Account Number)..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddReqInfo();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddReqInfo}
                  style={{
                    background: 'var(--bg-surface-raised)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--accent-primary)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '0 0.85rem',
                    fontSize: '0.825rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Plus size={14} />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================= */}
        {/* 6. Escalation Protocol */}
        {/* ================================================================= */}
        {(activeSection === 'all' || activeSection === 'escalation') && (
          <section>
            <div style={{ marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-hairline)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                6. Escalation Triggers & Fallback Protocol
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                When caller issues exceed AI competence, route the conversation safely to a human team member.
              </p>
            </div>

            {/* Triggers list */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="vf-label" style={{ marginBottom: '0.45rem' }}>
                <span>Escalation Trigger Conditions</span>
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.75rem' }}>
                {config.escalationTriggers.map((trig, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                      background: 'var(--bg-surface-raised)',
                      padding: '0.5rem 0.85rem',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-default)',
                      fontSize: '0.825rem'
                    }}
                  >
                    <span style={{ color: 'var(--status-warning)' }}>⚠️ {trig}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTrigger(idx)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--status-danger)', cursor: 'pointer', padding: '0.2rem' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="vf-input"
                  value={newTrigger}
                  onChange={(e) => setNewTrigger(e.target.value)}
                  placeholder="Add trigger (e.g. Caller mentions emergency, severe pain, or demands supervisor)..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTrigger();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTrigger}
                  style={{
                    background: 'var(--bg-surface-raised)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--accent-primary)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '0 0.85rem',
                    fontSize: '0.825rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Plus size={14} />
                  <span>Add</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div className="vf-form-group" style={{ margin: 0 }}>
                <label className="vf-label">
                  <span>Human Escalation Phone</span>
                  <span className="vf-hint">Transfer destination</span>
                </label>
                <input
                  type="tel"
                  className="vf-input"
                  value={config.transferPhone}
                  onChange={(e) => onChange((prev) => ({ ...prev, transferPhone: e.target.value }))}
                  placeholder="+1 (555) 234-8901"
                />
              </div>

              <div className="vf-form-group" style={{ margin: 0 }}>
                <label className="vf-label">
                  <span>Operating Business Hours</span>
                </label>
                <input
                  type="text"
                  className="vf-input"
                  value={config.businessHours}
                  onChange={(e) => onChange((prev) => ({ ...prev, businessHours: e.target.value }))}
                  placeholder="Mon-Fri 8:00 AM - 5:30 PM"
                />
              </div>
            </div>

            <div className="vf-form-group" style={{ margin: 0 }}>
              <label className="vf-label">
                <span>Handoff / Fallback Message</span>
                <span className="vf-hint">Spoken to caller before transferring</span>
              </label>
              <input
                type="text"
                className="vf-input"
                value={config.fallbackMessage}
                onChange={(e) => onChange((prev) => ({ ...prev, fallbackMessage: e.target.value }))}
                placeholder="Please hold while I connect you with our on-call coordinator..."
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
