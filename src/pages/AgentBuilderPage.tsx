import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Save, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { agentService, IS_MOCK_MODE } from '../services/agentService';
import type {
  BackendGeneratedAgentConfig,
  BusinessCategory,
  BusinessTemplate,
  VoiceOption,
  GeneratedAgentConfig
} from '../types/agent';
import { PromptInputHero } from '../components/builder/PromptInputHero';
import { PromptRefinementBar } from '../components/builder/PromptRefinementBar';
import { StructuredConfigEditor, type StructuredConfigFormState } from '../components/builder/StructuredConfigEditor';
import { BusinessTypeSelector } from '../components/builder/BusinessTypeSelector';
import { LivePreviewCard } from '../components/builder/LivePreviewCard';
import { Button } from '../components/common/Button';

const DEFAULT_PROMPT =
  'Create a friendly receptionist for my dental clinic who speaks Hindi and English, answers common appointment questions, collects appointment preferences, and escalates emergencies to a human.';

export const AgentBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editAgentId = searchParams.get('agentId');

  // Master Data
  const [templates, setTemplates] = useState<BusinessTemplate[]>([]);
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Prompt-First State
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [rawBackendConfig, setRawBackendConfig] = useState<BackendGeneratedAgentConfig | undefined>(undefined);
  const [isMockGenerated, setIsMockGenerated] = useState<boolean>(IS_MOCK_MODE);

  // Form Configuration State
  const [config, setConfig] = useState<StructuredConfigFormState>({
    name: 'Maya — Dental Receptionist',
    description: 'Bilingual AI receptionist for dental care appointments and emergency triage.',
    businessName: 'Apex Family Dental Care',
    businessType: 'dental',
    persona: 'Warm, empathetic, and professional front-desk coordinator who balances patient reassurance with efficient scheduling.',
    goals: [
      'Warmly greet callers in Hindi or English based on their preference',
      'Answer questions about dental hygiene, hours, and accepted insurance',
      'Collect appointment preferences (preferred day, time window, reason for visit)',
      'Identify acute dental pain or emergencies and escalate immediately to on-call dentist'
    ],
    firstMessage:
      'नमस्ते! (Namaste!) Welcome to Apex Family Dental Care. I am Maya, your receptionist. Are you calling to book an appointment or ask about our services?',
    instructions: `You are Maya, the bilingual voice AI receptionist for Apex Family Dental Care.
Business Address: 402 Elmwood Parkway, Suite 100
Languages: Hindi & English (seamless code-switching based on caller language).
Hours: Monday-Friday 8am-5:30pm, Saturday 9am-1pm.
Triage: Collect caller name, phone number, and reason for visit. Express gentle empathy if pain is mentioned.`,
    guardrails: [
      'Never provide clinical diagnosis or prescribe treatments over the phone.',
      'Always verify caller mobile phone and full name before confirming appointment.',
      'Keep voice responses concise (1 to 3 sentences) for natural turn-taking.',
      'If caller reports acute trauma or severe bleeding, escalate immediately.'
    ],
    language: 'hi-IN',
    voiceId: 'rachel',
    conversationSteps: [
      '1. Greeting & Identity: Warm opening in Hindi/English, introduce dental clinic.',
      '2. Intent Triage: Ascertain if caller needs hygiene cleaning, urgent treatment, or inquiry.',
      '3. Information Gathering: Collect caller full name, contact number, and scheduling preferences.',
      '4. Confirmation & Summary: Repeat booking details and notify them of SMS confirmation.',
      '5. Wrap-up or Escalation: Transfer emergency callers or conclude warmly.'
    ],
    requiredInformation: [
      'Caller Full Name',
      'Mobile Phone Number',
      'Preferred Appointment Date & Time',
      'Reason for Visit / Symptoms'
    ],
    escalationTriggers: [
      'Caller reports acute toothache, trauma, or severe bleeding',
      'Caller explicitly asks to speak with Dr. Chen or a human receptionist',
      'Billing dispute or insurance claim verification'
    ],
    transferPhone: '+1 (555) 234-8901',
    fallbackMessage:
      'I want to make sure your situation is handled promptly. Please hold while I connect you directly with our on-call dental coordinator.',
    businessHours: 'Mon-Fri 8:00 AM - 5:30 PM, Sat 9:00 AM - 1:00 PM',
    businessAddress: '402 Elmwood Parkway, Suite 100'
  });

  const [sampleQueries, setSampleQueries] = useState<string[]>([
    'Do you accept Delta Dental insurance?',
    'I have a chipped molar and severe pain, can I get in today?',
    'Can I reschedule my hygiene cleaning next Tuesday?'
  ]);

  // Action feedback
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load Initial Data or existing agent
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

        if (editAgentId) {
          const existing = await agentService.getAgentById(editAgentId);
          if (existing && isMounted) {
            setConfig({
              name: existing.name,
              description: existing.description || `${existing.name} configured for ${existing.businessName}`,
              businessName: existing.businessName,
              businessType: existing.businessType,
              persona: existing.persona || 'Professional and polite customer receptionist.',
              goals: existing.goals || ['Greet callers', 'Collect booking info', 'Escalate complex questions'],
              firstMessage: existing.firstMessage,
              instructions: existing.instructions,
              guardrails: existing.guardrails || ['Keep responses concise and respectful.'],
              language: existing.language,
              voiceId: existing.voiceId,
              conversationSteps: existing.conversationSteps || [
                '1. Greeting',
                '2. Inquiry Triage',
                '3. Collect Information',
                '4. Confirmation',
                '5. Conclusion'
              ],
              requiredInformation: existing.requiredInformation || ['Caller Name', 'Contact Phone'],
              escalationTriggers: existing.escalationTriggers || ['Caller demands human staff'],
              transferPhone: existing.transferPhone || '+1 (555) 234-8901',
              fallbackMessage: existing.fallbackMessage || 'Connecting you with human staff...',
              businessHours: existing.businessHours || 'Mon-Fri 9am-5pm',
              businessAddress: existing.businessAddress || '100 Main St'
            });

            if (existing.generatedFromPrompt) {
              setPrompt(existing.generatedFromPrompt);
            }
            setHasGenerated(true);

            const matchedTpl = fetchedTemplates.find((t) => t.id === existing.businessType);
            if (matchedTpl) {
              setSampleQueries(matchedTpl.sampleCallerQueries);
            }
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

  // TASK 1 & 2: Prompt-First Generation Handler
  const handleGenerateFromPrompt = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const generated: GeneratedAgentConfig = await agentService.generateFromPrompt({
        prompt: prompt.trim()
      });

      setConfig({
        name: generated.name,
        description: generated.description,
        businessName: generated.businessName,
        businessType: generated.businessType,
        persona: generated.persona,
        goals: generated.goals,
        firstMessage: generated.firstMessage,
        instructions: generated.instructions,
        guardrails: generated.guardrails,
        language: generated.language,
        voiceId: generated.suggestedVoiceId,
        conversationSteps: generated.conversationSteps,
        requiredInformation: generated.requiredInformation,
        escalationTriggers: generated.escalationRules.triggers,
        transferPhone: generated.escalationRules.transferPhone || '+1 (555) 234-8901',
        fallbackMessage: generated.escalationRules.fallbackMessage,
        businessHours: 'Mon-Fri 8:00 AM - 5:30 PM, Sat 9:00 AM - 1:00 PM',
        businessAddress: '402 Elmwood Parkway, Suite 100'
      });

      if (generated.sampleQueries && generated.sampleQueries.length > 0) {
        setSampleQueries(generated.sampleQueries);
      }

      setRawBackendConfig(generated.rawBackendConfig);
      setIsMockGenerated(generated.isMockGeneration);
      setHasGenerated(true);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to generate agent configuration from prompt.');
    } finally {
      setIsGenerating(false);
    }
  };

  // TASK 3: Refine Configuration with Natural Language
  const handleRefine = async (refinementText: string) => {
    setIsRefining(true);
    setErrorMessage(null);

    try {
      const currentConfigPayload: GeneratedAgentConfig = {
        name: config.name,
        description: config.description,
        businessName: config.businessName,
        businessType: config.businessType as BusinessCategory,
        persona: config.persona,
        goals: config.goals,
        firstMessage: config.firstMessage,
        instructions: config.instructions,
        guardrails: config.guardrails,
        language: config.language,
        suggestedVoiceId: config.voiceId,
        conversationSteps: config.conversationSteps,
        requiredInformation: config.requiredInformation,
        escalationRules: {
          triggers: config.escalationTriggers,
          transferPhone: config.transferPhone,
          fallbackMessage: config.fallbackMessage
        },
        sampleQueries,
        generatedFromPrompt: prompt,
        isMockGeneration: true
      };

      const refined = await agentService.refineConfiguration({
        currentConfig: currentConfigPayload,
        refinementPrompt: refinementText
      });

      setConfig((prev) => ({
        ...prev,
        firstMessage: refined.firstMessage,
        language: refined.language,
        instructions: refined.instructions,
        goals: refined.goals,
        guardrails: refined.guardrails,
        conversationSteps: refined.conversationSteps,
        requiredInformation: refined.requiredInformation,
        escalationTriggers: refined.escalationRules.triggers
      }));
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to refine configuration.');
    } finally {
      setIsRefining(false);
    }
  };

  // Optional: Apply Industry Template
  const handleSelectTemplate = (tpl: BusinessTemplate) => {
    setConfig((prev) => ({
      ...prev,
      businessType: tpl.id,
      name: tpl.defaultAgentName,
      voiceId: tpl.recommendedVoiceId,
      firstMessage: tpl.defaultGreeting,
      instructions: tpl.defaultInstructions
    }));
    setSampleQueries(tpl.sampleCallerQueries);
    setPrompt(`Create a professional receptionist for ${tpl.label} that handles common caller inquiries, appointment bookings, and emergency triage.`);
    setHasGenerated(true);
  };

  // Save Agent to Service
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);

    try {
      const payload = {
        name: config.name,
        businessName: config.businessName,
        businessType: config.businessType as BusinessCategory,
        language: config.language,
        voiceId: config.voiceId,
        firstMessage: config.firstMessage,
        instructions: config.instructions,
        transferPhone: config.transferPhone,
        businessHours: config.businessHours,
        businessAddress: config.businessAddress,
        description: config.description,
        persona: config.persona,
        goals: config.goals,
        guardrails: config.guardrails,
        conversationSteps: config.conversationSteps,
        requiredInformation: config.requiredInformation,
        escalationTriggers: config.escalationTriggers,
        fallbackMessage: config.fallbackMessage,
        generatedFromPrompt: prompt,
        status: 'active' as const,
        rawBackendConfig
      };

      if (editAgentId) {
        await agentService.updateAgent(editAgentId, payload);
        setSaveSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 1200);
      } else {
        const created = await agentService.createAgent(payload);
        setSaveSuccess(true);
        setTimeout(() => {
          navigate(`/test?agentId=${created.id || created.agent_id}`);
        }, 1200);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save receptionist agent.');
      setSaving(false);
    }
  };

  const currentVoice = voices.find((v) => v.id === config.voiceId);

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
      {/* Top Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
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
              marginBottom: '0.4rem',
              padding: 0
            }}
          >
            <ArrowLeft size={15} />
            <span>Return to Dashboard</span>
          </button>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 500, fontFamily: 'var(--font-display)', margin: 0 }}>
            {editAgentId ? 'Configure Voice Receptionist' : 'Voice Agent Studio'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Draft a tailored conversational voice agent starting from a single sentence.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button variant="ghost" onClick={() => navigate('/')}>
            Cancel
          </Button>

          <Button
            variant="primary"
            icon={saveSuccess ? <Check size={16} /> : <Save size={16} />}
            loading={saving}
            onClick={handleSave}
          >
            {saveSuccess
              ? 'Agent Provisioned!'
              : editAgentId
              ? 'Update Configuration'
              : !IS_MOCK_MODE
              ? 'Provision Live ElevenLabs Agent'
              : 'Save & Publish Draft'}
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

      {/* TASK 1: Prominent Prompt-First Hero Card */}
      <PromptInputHero
        prompt={prompt}
        onChangePrompt={setPrompt}
        onGenerate={handleGenerateFromPrompt}
        loading={isGenerating}
        showTemplatesToggle={true}
        showingTemplates={showTemplates}
        onToggleTemplates={() => setShowTemplates((prev) => !prev)}
      />

      {/* Optional Industry Template Presets (Task 4: Preserved feature) */}
      {showTemplates && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Optional Industry Starting Templates</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Selecting a card fills prompt & initial instructions
            </span>
          </div>
          <BusinessTypeSelector
            templates={templates}
            selectedCategory={config.businessType as BusinessCategory}
            onSelect={handleSelectTemplate}
          />
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.75fr) minmax(320px, 1fr)',
          gap: '2rem',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Refinement Bar & Structured Config Editor */}
        <div>
          {/* TASK 3: Natural Language Refinement Input */}
          <PromptRefinementBar onRefine={handleRefine} loading={isRefining} />

          {/* TASK 2: Structured Configuration Editor */}
          <StructuredConfigEditor
            config={config}
            onChange={setConfig}
            voices={voices}
            originalPrompt={prompt}
            isMockGenerated={isMockGenerated}
          />
        </div>

        {/* Right Column: Sticky Live Preview */}
        <div>
          <LivePreviewCard
            businessName={config.businessName}
            agentName={config.name}
            voiceName={currentVoice?.name || 'Rachel'}
            firstMessage={config.firstMessage}
            sampleQueries={sampleQueries}
            status="active"
            language={config.language}
            persona={config.persona}
            requiredFields={config.requiredInformation}
            escalationPhone={config.transferPhone}
            isAiGenerated={hasGenerated}
          />
        </div>
      </div>
    </div>
  );
};
