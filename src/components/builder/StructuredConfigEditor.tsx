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
  FileText
} from 'lucide-react';
import { Card } from '../common/Card';
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

export const StructuredConfigEditor: React.FC<StructuredConfigEditorProps> = ({
  config,
  onChange,
  voices,
  originalPrompt,
  isMockGenerated = true
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'identity' | 'persona' | 'dialogue' | 'workflow' | 'escalation'>('all');
  const [newGoal, setNewGoal] = useState('');
  const [newGuardrail, setNewGuardrail] = useState('');
  const [newReqInfo, setNewReqInfo] = useState('');
  const [newTrigger, setNewTrigger] = useState('');

  // Helpers for list manipulation
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Draft Notification Banner */}
      <div
        style={{
          background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
          border: '1px solid var(--cyan-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>
              Structured Configuration Review
            </span>
            {isMockGenerated && <Badge variant="mock">Mock Prompt Generator</Badge>}
          </div>
          {originalPrompt && (
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, fontStyle: 'italic' }}>
              Prompt: "{originalPrompt.length > 110 ? originalPrompt.slice(0, 110) + '...' : originalPrompt}"
            </p>
          )}
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--cyan-300)' }}>
          Editable draft • Customize below
        </span>
      </div>

      {/* Navigation Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border-default)', paddingBottom: '0.5rem' }}>
        {[
          { id: 'all', label: 'All Sections' },
          { id: 'identity', label: '1. Identity & Voice' },
          { id: 'persona', label: '2. Persona & Goals' },
          { id: 'dialogue', label: '3. Dialogue & Guardrails' },
          { id: 'workflow', label: '4. Workflow & Data' },
          { id: 'escalation', label: '5. Escalation Protocol' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              background: activeTab === tab.id ? 'var(--cyan-subtle)' : 'transparent',
              border: activeTab === tab.id ? '1px solid var(--cyan-400)' : '1px solid transparent',
              color: activeTab === tab.id ? 'var(--cyan-300)' : 'var(--text-secondary)',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Identity & Voice */}
      {(activeTab === 'all' || activeTab === 'identity') && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <User size={18} style={{ color: 'var(--cyan-400)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>1. Agent Identity & Voice</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div className="vf-form-group" style={{ margin: 0 }}>
              <label className="vf-label">
                <span>Agent Persona Name</span>
              </label>
              <input
                type="text"
                className="vf-input"
                value={config.name}
                onChange={(e) => onChange((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Maya — Dental Receptionist"
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
              <span>Agent Description / Role</span>
            </label>
            <input
              type="text"
              className="vf-input"
              value={config.description}
              onChange={(e) => onChange((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="e.g. Voice AI receptionist handling dental patient appointments and emergency triage"
            />
          </div>

          {/* Voice Selector */}
          <VoiceSelector
            voices={voices}
            selectedVoiceId={config.voiceId}
            onSelectVoice={(v) => onChange((prev) => ({ ...prev, voiceId: v.id }))}
          />

          <div className="vf-form-group" style={{ margin: 0 }}>
            <label className="vf-label">
              <span>Spoken Language & Accent</span>
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
        </Card>
      )}

      {/* 2. Persona & Goals */}
      {(activeTab === 'all' || activeTab === 'persona') && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Target size={18} style={{ color: 'var(--cyan-400)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>2. Persona & Strategic Goals</h3>
          </div>

          <div className="vf-form-group">
            <label className="vf-label">
              <span>Persona & Demeanor Summary</span>
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
            <label className="vf-label" style={{ marginBottom: '0.5rem' }}>
              <span>Primary Agent Goals</span>
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
              {config.goals.map((goal, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    background: 'var(--bg-surface-raised)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-hairline)',
                    fontSize: '0.85rem'
                  }}
                >
                  <span>🎯 {goal}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveGoal(idx)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--rose-400)', cursor: 'pointer', padding: '0.2rem' }}
                    title="Remove goal"
                  >
                    <Trash2 size={14} />
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
                  background: 'var(--bg-surface-hover)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--cyan-300)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0 0.85rem',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Plus size={15} />
                <span>Add</span>
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* 3. Welcome Dialogue, Instructions & Guardrails */}
      {(activeTab === 'all' || activeTab === 'dialogue') && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <MessageSquare size={18} style={{ color: 'var(--cyan-400)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>3. Dialogue, Guardrails & System Instructions</h3>
          </div>

          {/* Welcome Message */}
          <div className="vf-form-group">
            <label className="vf-label">
              <span>Welcome Message (Opening Greeting)</span>
              <span className="vf-hint">Spoken immediately when call connects</span>
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

          {/* Guardrails */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="vf-label" style={{ marginBottom: '0.5rem' }}>
              <span>Operational Guardrails & Boundaries</span>
              <span className="vf-hint">Enforced safety and conversational rules</span>
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
              {config.guardrails.map((gr, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    background: 'var(--bg-surface-raised)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-hairline)',
                    fontSize: '0.825rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Shield size={14} style={{ color: 'var(--amber-400)', flexShrink: 0 }} />
                    <span>{gr}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveGuardrail(idx)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--rose-400)', cursor: 'pointer', padding: '0.2rem' }}
                    title="Remove guardrail"
                  >
                    <Trash2 size={14} />
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
                placeholder="Add a guardrail (e.g. Never provide clinical diagnoses)..."
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
                  background: 'var(--bg-surface-hover)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--cyan-300)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0 0.85rem',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Plus size={15} />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Full Instructions Prompt */}
          <div className="vf-form-group" style={{ margin: 0 }}>
            <label className="vf-label">
              <span>Full System Instructions (Synthesized Prompt)</span>
            </label>
            <textarea
              rows={8}
              className="vf-textarea"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.825rem' }}
              value={config.instructions}
              onChange={(e) => onChange((prev) => ({ ...prev, instructions: e.target.value }))}
              placeholder="System prompt instructions..."
            />
          </div>
        </Card>
      )}

      {/* 4. Conversation Steps & Required Data */}
      {(activeTab === 'all' || activeTab === 'workflow') && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <ListOrdered size={18} style={{ color: 'var(--cyan-400)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>4. Conversation Flow & Required Information</h3>
          </div>

          {/* Steps */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="vf-label" style={{ marginBottom: '0.5rem' }}>
              <span>Sequential Conversation Steps</span>
              <span className="vf-hint">Milestones the receptionist guides the caller through</span>
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {config.conversationSteps.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-surface-raised)',
                    border: '1px solid var(--border-hairline)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.5rem 0.85rem',
                    fontSize: '0.825rem',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <span style={{ color: 'var(--cyan-300)', fontWeight: 600, marginRight: '0.35rem' }}>
                    Step {idx + 1}:
                  </span>
                  {step.replace(/^\d+\.\s*/, '')}
                </div>
              ))}
            </div>
          </div>

          {/* Required Information to Collect */}
          <div>
            <label className="vf-label" style={{ marginBottom: '0.5rem' }}>
              <span>Required Information to Collect from Caller</span>
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              {config.requiredInformation.map((info, idx) => (
                <span
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'rgba(6, 182, 212, 0.12)',
                    color: 'var(--cyan-300)',
                    border: '1px solid var(--cyan-border)',
                    padding: '0.3rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem',
                    fontWeight: 500
                  }}
                >
                  <FileText size={12} />
                  <span>{info}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveReqInfo(idx)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--rose-400)', cursor: 'pointer', padding: 0 }}
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
                placeholder="Add required data field (e.g. Insurance Carrier, VIN Number)..."
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
                  background: 'var(--bg-surface-hover)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--cyan-300)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0 0.85rem',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Plus size={15} />
                <span>Add</span>
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* 5. Escalation & Fallback Behavior */}
      {(activeTab === 'all' || activeTab === 'escalation') && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <PhoneForwarded size={18} style={{ color: 'var(--amber-400)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>5. Escalation Triggers & Fallback Protocol</h3>
          </div>

          {/* Trigger List */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="vf-label" style={{ marginBottom: '0.5rem' }}>
              <span>Escalation Trigger Conditions</span>
              <span className="vf-hint">When caller meets any of these criteria, initiate human handoff</span>
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
              {config.escalationTriggers.map((trig, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    background: 'var(--bg-surface-raised)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    fontSize: '0.825rem'
                  }}
                >
                  <span style={{ color: 'var(--amber-400)' }}>⚠️ {trig}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTrigger(idx)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--rose-400)', cursor: 'pointer', padding: '0.2rem' }}
                  >
                    <Trash2 size={14} />
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
                placeholder="Add escalation trigger (e.g. Caller mentions emergency or pain)..."
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
                  background: 'var(--bg-surface-hover)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--amber-400)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0 0.85rem',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Plus size={15} />
                <span>Add</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="vf-form-group" style={{ margin: 0 }}>
              <label className="vf-label">
                <span>Human Escalation Phone</span>
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
                <span>Business Hours</span>
              </label>
              <input
                type="text"
                className="vf-input"
                value={config.businessHours}
                onChange={(e) => onChange((prev) => ({ ...prev, businessHours: e.target.value }))}
                placeholder="Mon-Fri 8am - 5:30pm"
              />
            </div>
          </div>

          <div className="vf-form-group" style={{ marginTop: '1rem', marginBottom: 0 }}>
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
        </Card>
      )}
    </div>
  );
};
