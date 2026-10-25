import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Save, ArrowLeft, Check, MessageSquare, AlertCircle } from 'lucide-react';
import { agentService } from '../services/agentService';
import type { BusinessCategory, BusinessTemplate, VoiceOption } from '../types/agent';
import { BusinessTypeSelector } from '../components/builder/BusinessTypeSelector';
import { VoiceSelector } from '../components/builder/VoiceSelector';
import { LivePreviewCard } from '../components/builder/LivePreviewCard';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const AgentBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editAgentId = searchParams.get('agentId');

  // Master Data
  const [templates, setTemplates] = useState<BusinessTemplate[]>([]);
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [businessType, setBusinessType] = useState<BusinessCategory>('dental');
  const [businessName, setBusinessName] = useState('Apex Family Dental Care');
  const [agentName, setAgentName] = useState('Maya — Front Desk Coordinator');
  const [voiceId, setVoiceId] = useState('rachel');
  const [language, setLanguage] = useState('en-US');
  const [firstMessage, setFirstMessage] = useState(
    'Hello! Thank you for calling Apex Family Dental Care. I am Maya, your receptionist. Are you calling to schedule an appointment or ask about our services?'
  );
  const [instructions, setInstructions] = useState('');
  const [transferPhone, setTransferPhone] = useState('+1 (555) 234-8901');
  const [businessHours, setBusinessHours] = useState('Mon-Fri 8:00 AM - 5:30 PM, Sat 9:00 AM - 1:00 PM');
  const [businessAddress, setBusinessAddress] = useState('402 Elmwood Parkway, Suite 100');
  const [status, setStatus] = useState<'active' | 'draft'>('active');
  const [sampleQueries, setSampleQueries] = useState<string[]>([]);

  const applyTemplate = (tpl: BusinessTemplate) => {
    setBusinessType(tpl.id);
    setAgentName(tpl.defaultAgentName);
    setVoiceId(tpl.recommendedVoiceId);
    setFirstMessage(tpl.defaultGreeting);
    setInstructions(tpl.defaultInstructions);
    setSampleQueries(tpl.sampleCallerQueries);
  };

  // Load Templates & Voices
  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        const [fetchedTemplates, fetchedVoices] = await Promise.all([
          agentService.getBusinessTemplates(),
          agentService.getVoices()
        ]);
        if (!isMounted) return;
        setTemplates(fetchedTemplates);
        setVoices(fetchedVoices);

        // If editing an existing agent, prefill form
        if (editAgentId) {
          const existing = await agentService.getAgentById(editAgentId);
          if (existing && isMounted) {
            setBusinessType(existing.businessType);
            setBusinessName(existing.businessName);
            setAgentName(existing.name);
            setVoiceId(existing.voiceId);
            setLanguage(existing.language);
            setFirstMessage(existing.firstMessage);
            setInstructions(existing.instructions);
            setTransferPhone(existing.transferPhone || '');
            setBusinessHours(existing.businessHours || '');
            setBusinessAddress(existing.businessAddress || '');
            setStatus(existing.status === 'draft' ? 'draft' : 'active');
            
            const matchedTpl = fetchedTemplates.find(t => t.id === existing.businessType);
            if (matchedTpl) {
              setSampleQueries(matchedTpl.sampleCallerQueries);
            }
          }
        } else {
          // Default to dental template
          const defaultTpl = fetchedTemplates.find(t => t.id === 'dental') || fetchedTemplates[0];
          if (defaultTpl && isMounted) {
            applyTemplate(defaultTpl);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setErrorMessage(err?.message || 'Failed to initialize agent builder');
        }
      } finally {
        if (isMounted) {
          setLoadingInitial(false);
        }
      }
    };
    init();

    return () => {
      isMounted = false;
    };
  }, [editAgentId]);

  const insertPromptSnippet = (snippetType: 'emergency' | 'hours' | 'booking') => {
    let snippet = '';
    if (snippetType === 'emergency') {
      snippet = `\n\nEMERGENCY ESCALATION:\nIf the caller reports an acute medical/safety emergency or uncontrolled situation, express reassurance, request their callback number, and transfer the call immediately to ${transferPhone || 'the emergency on-call line'}.`;
    } else if (snippetType === 'hours') {
      snippet = `\n\nHOURS & LOCATION:\nWe are located at ${businessAddress || 'our main business office'}.\nBusiness Hours: ${businessHours || 'Monday through Friday from 9:00 AM to 5:00 PM'}.`;
    } else if (snippetType === 'booking') {
      snippet = `\n\nAPPOINTMENT BOOKING WORKFLOW:\n1. Ask for caller's full name and mobile phone number.\n2. Ask their preferred day of the week and morning/afternoon preference.\n3. Note the primary reason for their visit.\n4. Confirm the booking details before ending the call.`;
    }

    setInstructions((prev) => prev.trim() + snippet);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);

    try {
      const payload = {
        name: agentName,
        businessName,
        businessType,
        language,
        voiceId,
        firstMessage,
        instructions,
        transferPhone,
        businessHours,
        businessAddress,
        status
      };

      if (editAgentId) {
        await agentService.updateAgent(editAgentId, payload);
      } else {
        await agentService.createAgent(payload);
      }

      setSaveSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save receptionist agent.');
      setSaving(false);
    }
  };

  const currentVoice = voices.find((v) => v.id === voiceId);

  if (loadingInitial) {
    return (
      <div className="vf-container" style={{ padding: '4rem 0', textAlign: 'center' }}>
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
        <p style={{ color: 'var(--text-secondary)' }}>Loading receptionist builder...</p>
      </div>
    );
  }

  return (
    <div className="vf-container">
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
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
              marginBottom: '0.5rem',
              padding: 0
            }}
          >
            <ArrowLeft size={15} />
            <span>Back to Dashboard</span>
          </button>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>
            {editAgentId ? 'Configure AI Receptionist' : 'Build New AI Receptionist'}
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Tailor speech tone, knowledge base, and call escalation rules for your small business.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            icon={saveSuccess ? <Check size={16} /> : <Save size={16} />}
            loading={saving}
            onClick={handleSave}
          >
            {saveSuccess ? 'Saved Successfully!' : editAgentId ? 'Update Receptionist' : 'Deploy Receptionist'}
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--rose-400)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem'
          }}
        >
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.7fr) minmax(320px, 1fr)',
          gap: '2rem',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Form Controls */}
        <div>
          <Card style={{ marginBottom: '1.5rem' }}>
            {/* 1. Category Selector */}
            <BusinessTypeSelector
              templates={templates}
              selectedCategory={businessType}
              onSelect={applyTemplate}
            />

            {/* 2. Business & Agent Identity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div className="vf-form-group" style={{ margin: 0 }}>
                <label className="vf-label">
                  <span>Business Name</span>
                </label>
                <input
                  type="text"
                  className="vf-input"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Apex Family Dental Care"
                  required
                />
              </div>

              <div className="vf-form-group" style={{ margin: 0 }}>
                <label className="vf-label">
                  <span>Receptionist Persona Name</span>
                </label>
                <input
                  type="text"
                  className="vf-input"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="e.g. Maya — Front Desk Coordinator"
                  required
                />
              </div>
            </div>

            {/* 3. Voice Selector */}
            <VoiceSelector
              voices={voices}
              selectedVoiceId={voiceId}
              onSelectVoice={(v) => setVoiceId(v.id)}
            />

            {/* 4. Language Selection */}
            <div className="vf-form-group">
              <label className="vf-label">
                <span>Spoken Language & Accent</span>
              </label>
              <select
                className="vf-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en-US">English (United States)</option>
                <option value="en-GB">English (United Kingdom)</option>
                <option value="es-ES">Spanish (Español)</option>
                <option value="hi-IN">Hindi / Hinglish (India)</option>
                <option value="fr-FR">French (Français)</option>
              </select>
            </div>
          </Card>

          {/* Opening Greeting & Behavior */}
          <Card style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={18} style={{ color: 'var(--cyan-400)' }} />
              <span>Receptionist Dialogue & Instructions</span>
            </h3>

            {/* First Message Greeting */}
            <div className="vf-form-group">
              <label className="vf-label">
                <span>Opening Phone Greeting</span>
                <span className="vf-hint">Exact words spoken upon caller connection</span>
              </label>
              <textarea
                className="vf-textarea"
                rows={3}
                value={firstMessage}
                onChange={(e) => setFirstMessage(e.target.value)}
                placeholder="Hello! Thank you for calling..."
                required
              />
            </div>

            {/* Core Prompt / Instructions */}
            <div className="vf-form-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label className="vf-label" style={{ margin: 0 }}>
                  <span>System Knowledge & Instructions</span>
                </label>

                {/* Snippet insertion pills */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Insert snippet:</span>
                  <button
                    type="button"
                    onClick={() => insertPromptSnippet('booking')}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid var(--border-hairline)',
                      color: 'var(--cyan-300)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.15rem 0.45rem',
                      fontSize: '0.72rem',
                      cursor: 'pointer'
                    }}
                  >
                    + Booking
                  </button>
                  <button
                    type="button"
                    onClick={() => insertPromptSnippet('emergency')}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid var(--border-hairline)',
                      color: 'var(--amber-400)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.15rem 0.45rem',
                      fontSize: '0.72rem',
                      cursor: 'pointer'
                    }}
                  >
                    + Emergency
                  </button>
                  <button
                    type="button"
                    onClick={() => insertPromptSnippet('hours')}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid var(--border-hairline)',
                      color: 'var(--text-secondary)',
                      borderRadius: 'var(--radius-sm)',
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
                className="vf-textarea"
                rows={9}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Enter prompt instructions for the voice agent..."
                required
              />
              <span className="vf-hint">
                Provide business hours, pricing estimates, emergency policies, and appointment triage procedures.
              </span>
            </div>

            {/* Human Transfer Phone & Address */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="vf-form-group" style={{ margin: 0 }}>
                <label className="vf-label">
                  <span>Human Escalation Phone</span>
                  <span className="vf-hint">Emergency transfer</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="tel"
                    className="vf-input"
                    value={transferPhone}
                    onChange={(e) => setTransferPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="vf-form-group" style={{ margin: 0 }}>
                <label className="vf-label">
                  <span>Business Hours</span>
                </label>
                <input
                  type="text"
                  className="vf-input"
                  value={businessHours}
                  onChange={(e) => setBusinessHours(e.target.value)}
                  placeholder="Mon-Fri 8am - 5pm"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Sticky Live Preview */}
        <div>
          <LivePreviewCard
            businessName={businessName}
            agentName={agentName}
            voiceName={currentVoice?.name || 'Rachel'}
            firstMessage={firstMessage}
            sampleQueries={sampleQueries}
            status={status}
          />
        </div>
      </div>
    </div>
  );
};
