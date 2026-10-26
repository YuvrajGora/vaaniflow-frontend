// ==========================================================================
// VaaniFlow AI — Mock Service Adapter
// Clearly labeled mock data adapter implementing AgentApiClient
// Deterministic prompt-to-config generator and natural-language refinement
// ==========================================================================
import type {
  Agent,
  BusinessCategory,
  BusinessTemplate,
  DashboardMetrics,
  GenerateAgentPromptInput,
  GeneratedAgentConfig,
  RefineAgentPromptInput,
  Session,
  VoiceOption
} from '../types/agent';
import type { AgentApiClient, CreateAgentInput, UpdateAgentInput } from './api';
import { MOCK_AGENTS, MOCK_BUSINESS_TEMPLATES, MOCK_METRICS, MOCK_SESSIONS, MOCK_VOICES } from './mockData';

const STORAGE_KEYS = {
  AGENTS: 'vaaniflow_mock_agents',
  SESSIONS: 'vaaniflow_mock_sessions'
};

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockAgentAdapter implements AgentApiClient {
  public readonly isMockMode = true;
  public readonly apiBaseUrl = 'MOCK_INTERNAL_ADAPTER';

  async checkHealth(): Promise<import('../types/agent').BackendHealthResponse> {
    await delay(50);
    return {
      status: 'mock_active',
      service: 'frontend-mock-adapter'
    };
  }

  async authorizeSession(agentId: string): Promise<import('../types/agent').BackendSessionResponse> {
    await delay(100);
    return {
      status: 'ok',
      agent_id: agentId,
      signed_url: 'mock://simulated-browser-session',
      expires_in_seconds: 900
    };
  }

  private loadAgents(): Agent[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AGENTS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore localStorage errors in non-browser env
    }
    return [...MOCK_AGENTS];
  }

  private saveAgents(agents: Agent[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
    } catch {
      // ignore
    }
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    await delay(120);
    const agents = this.loadAgents();
    const activeCount = agents.filter(a => a.status === 'active').length;
    const totalCalls = agents.reduce((acc, a) => acc + (a.stats?.totalCalls || 0), 0);
    
    return {
      ...MOCK_METRICS,
      totalCallsHandled: totalCalls || MOCK_METRICS.totalCallsHandled,
      activeAgentsCount: activeCount
    };
  }

  async getAgents(): Promise<Agent[]> {
    await delay(150);
    return this.loadAgents();
  }

  async getAgentById(id: string): Promise<Agent | null> {
    await delay(100);
    const agents = this.loadAgents();
    return agents.find((a) => a.id === id) || null;
  }

  async createAgent(input: CreateAgentInput): Promise<Agent> {
    await delay(250);
    const agents = this.loadAgents();
    const newId = `ag-${Date.now().toString().slice(-4)}`;
    
    const newAgent: Agent = {
      id: newId,
      name: input.name,
      businessName: input.businessName,
      businessType: input.businessType,
      status: 'active',
      language: input.language || 'en-US',
      voiceId: input.voiceId || 'rachel',
      firstMessage: input.firstMessage,
      instructions: input.instructions,
      transferPhone: input.transferPhone,
      businessHours: input.businessHours,
      businessAddress: input.businessAddress,
      description: input.description,
      persona: input.persona,
      goals: input.goals,
      guardrails: input.guardrails,
      conversationSteps: input.conversationSteps,
      requiredInformation: input.requiredInformation,
      escalationTriggers: input.escalationTriggers,
      fallbackMessage: input.fallbackMessage,
      generatedFromPrompt: input.generatedFromPrompt,
      stats: {
        totalCalls: 0,
        avgDurationSec: 0,
        resolutionRate: 100,
        lastActive: 'Just created'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [newAgent, ...agents];
    this.saveAgents(updated);
    return newAgent;
  }

  async updateAgent(id: string, input: UpdateAgentInput): Promise<Agent> {
    await delay(200);
    const agents = this.loadAgents();
    const index = agents.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error(`Agent with ID ${id} not found.`);
    }

    const current = agents[index];
    const updatedAgent: Agent = {
      ...current,
      ...input,
      updatedAt: new Date().toISOString()
    };

    agents[index] = updatedAgent;
    this.saveAgents(agents);
    return updatedAgent;
  }

  async deleteAgent(id: string): Promise<boolean> {
    await delay(180);
    const agents = this.loadAgents();
    const filtered = agents.filter((a) => a.id !== id);
    this.saveAgents(filtered);
    return true;
  }

  async getSessions(limit = 10): Promise<Session[]> {
    await delay(160);
    return MOCK_SESSIONS.slice(0, limit);
  }

  async getVoices(): Promise<VoiceOption[]> {
    await delay(80);
    return [...MOCK_VOICES];
  }

  async getBusinessTemplates(): Promise<BusinessTemplate[]> {
    await delay(80);
    return [...MOCK_BUSINESS_TEMPLATES];
  }

  // ========================================================================
  // Task 1 & 2: Prompt-First Deterministic Configuration Generator
  // Explicitly labeled mock implementation for frontend development
  // ========================================================================
  async generateFromPrompt(input: GenerateAgentPromptInput): Promise<GeneratedAgentConfig> {
    await delay(450); // Simulate realistic generation response time
    const promptLower = input.prompt.toLowerCase();

    // 1. Detect Category
    let detectedCategory: BusinessCategory = input.category || 'custom';
    if (promptLower.includes('dental') || promptLower.includes('teeth') || promptLower.includes('tooth') || promptLower.includes('dentist')) {
      detectedCategory = 'dental';
    } else if (promptLower.includes('auto') || promptLower.includes('car') || promptLower.includes('repair') || promptLower.includes('mechanic') || promptLower.includes('oil') || promptLower.includes('brake')) {
      detectedCategory = 'auto_repair';
    } else if (promptLower.includes('real estate') || promptLower.includes('realty') || promptLower.includes('property') || promptLower.includes('apartment') || promptLower.includes('tenant') || promptLower.includes('leasing')) {
      detectedCategory = 'real_estate';
    } else if (promptLower.includes('law') || promptLower.includes('legal') || promptLower.includes('attorney') || promptLower.includes('lawyer') || promptLower.includes('litigation')) {
      detectedCategory = 'law_firm';
    } else if (promptLower.includes('salon') || promptLower.includes('spa') || promptLower.includes('hair') || promptLower.includes('massage') || promptLower.includes('facial')) {
      detectedCategory = 'salon_spa';
    } else if (promptLower.includes('restaurant') || promptLower.includes('dining') || promptLower.includes('cafe') || promptLower.includes('table') || promptLower.includes('bistro')) {
      detectedCategory = 'restaurant';
    }

    // 2. Detect Language
    let detectedLanguage = 'en-US';
    const isHindi = promptLower.includes('hindi') || promptLower.includes('hinglish');
    const isSpanish = promptLower.includes('spanish') || promptLower.includes('español');
    const isFrench = promptLower.includes('french') || promptLower.includes('français');
    const isBritish = promptLower.includes('british') || promptLower.includes('uk english');

    if (isHindi) detectedLanguage = 'hi-IN';
    else if (isSpanish) detectedLanguage = 'es-ES';
    else if (isFrench) detectedLanguage = 'fr-FR';
    else if (isBritish) detectedLanguage = 'en-GB';

    // 3. Recommended Voice
    let voiceId = 'rachel';
    if (detectedCategory === 'auto_repair') voiceId = 'drew';
    else if (detectedCategory === 'law_firm') voiceId = 'paul';
    else if (detectedCategory === 'real_estate') voiceId = 'domi';
    else if (detectedCategory === 'restaurant') voiceId = 'fin';

    // 4. Name & Persona Construction
    let name = 'Aria — Virtual Assistant';
    let businessName = 'City Care Services';
    let persona = 'Warm, empathetic, professional front-desk coordinator who balances patient reassurance with efficient scheduling.';
    let sampleQueries = ['What are your hours of operation?', 'Can I reschedule an appointment?', 'How much do your services cost?'];

    if (detectedCategory === 'dental') {
      name = isHindi ? 'Maya — Dental Receptionist (Bilingual)' : 'Maya — Dental Care Coordinator';
      businessName = 'Apex Family Dental Care';
      persona = 'Calm, empathetic, and reassuring front-office medical receptionist specializing in dental patient scheduling and calm emergency triage.';
      sampleQueries = [
        'Do you accept Delta Dental insurance?',
        'I have severe tooth pain, do you have emergency appointments today?',
        'How can I book a routine cleaning next week?'
      ];
    } else if (detectedCategory === 'auto_repair') {
      name = 'Liam — Service Advisor';
      businessName = 'Speedy Auto & Tire Hub';
      persona = 'Honest, technically knowledgeable automotive service advisor with an approachable, clear-spoken style.';
      sampleQueries = [
        'How much is a full synthetic oil change?',
        'My check engine light came on, can I drop off my car?',
        'Is my vehicle ready for pickup today?'
      ];
    } else if (detectedCategory === 'real_estate') {
      name = 'Sophia — Luxury Leasing';
      businessName = 'Prestige Realty Group';
      persona = 'Polished, enthusiastic, and articulate real estate concierge adept at qualifying buyer and tenant timelines and budgets.';
      sampleQueries = [
        'Can I schedule a tour of the 2-bedroom on Highland?',
        'What are the HOA rules and parking amenities?',
        'Are private showings available this weekend?'
      ];
    } else if (detectedCategory === 'law_firm') {
      name = 'Marcus — Client Intake';
      businessName = 'Sterling & Hughes Legal';
      persona = 'Discreet, authoritative, and compassionate legal intake coordinator who protects confidentiality and never offers legal advice.';
      sampleQueries = [
        'Do you provide free initial consultation calls?',
        'I need an attorney for contract dispute arbitration.',
        'Can I speak directly with managing counsel?'
      ];
    } else if (detectedCategory === 'salon_spa') {
      name = 'Chloe — Guest Relations';
      businessName = 'Serenity Day Spa & Salon';
      persona = 'Gentle, gracious, and detail-oriented wellness host who facilitates relaxing bookings and explains treatment packages.';
      sampleQueries = [
        'Do you have any openings for a balayage this Saturday?',
        'What is your cancellation policy?',
        'Can I book a couples aromatherapy massage?'
      ];
    } else if (detectedCategory === 'restaurant') {
      name = 'Luca — Table Host';
      businessName = 'Bella Luna Trattoria';
      persona = 'Charming, upbeat, and accommodating restaurant concierge managing table reservations and dining questions.';
      sampleQueries = [
        'Can I reserve an outdoor patio table for 4 tonight?',
        'Do you offer vegan or gluten-free menu items?',
        'What is your corkage fee?'
      ];
    }

    // 5. Welcome Greeting
    let firstMessage = `Hello! Thank you for calling ${businessName}. I am ${name.split('—')[0].trim()}, your AI receptionist. How may I assist you today?`;
    if (isHindi) {
      firstMessage = `नमस्ते! (Namaste!) Thank you for calling ${businessName}. I am ${name.split('—')[0].trim()}. I can assist you in both Hindi and English. आप कैसे मदद चाहेंगे?`;
    } else if (isSpanish) {
      firstMessage = `¡Hola! Gracias por llamar a ${businessName}. Soy ${name.split('—')[0].trim()}, su asistente virtual. ¿En qué le puedo colaborar hoy?`;
    }

    // 6. Goals & Guardrails
    const goals = [
      `Warmly greet incoming callers and represent ${businessName} with high professionalism`,
      'Answer common operating hours, location, and service pricing inquiries',
      'Collect caller contact details and schedule requested appointments',
      'Identify critical emergencies or unhappy callers and route them immediately'
    ];

    const guardrails = [
      'Never give unauthorized medical, legal, or financial guarantees.',
      'Always confirm the caller phone number and name before closing a booking.',
      'Keep voice responses concise (1 to 3 sentences) to maintain comfortable conversational turn-taking.',
      'If the caller repeatedly requests a person or reports acute distress, transfer immediately.'
    ];

    // 7. Conversation Steps
    const conversationSteps = [
      '1. Greeting & Identity: Warm opening, introduce business and receptionist name.',
      '2. Intent Triage: Identify if call is for booking, general inquiry, or emergency.',
      '3. Information Gathering: Collect caller full name, mobile number, and preferred date/time.',
      '4. Confirmation & Summary: Recite booking details and clarify cancellation policy.',
      '5. Wrap-up or Escalation: Answer any closing questions, or initiate warm human transfer.'
    ];

    // 8. Required Information
    const requiredInformation = [
      'Caller Full Name',
      'Callback Mobile Phone',
      'Preferred Appointment Date & Time Window',
      'Reason for Visit / Primary Concern'
    ];

    // 9. Escalation Rules
    const escalationRules = {
      triggers: [
        'Caller reports acute pain, medical emergency, or immediate safety hazard',
        'Caller expresses anger, unresolved complaint, or explicitly demands a supervisor',
        'Complex insurance verification or billing dispute'
      ],
      transferPhone: '+1 (555) 234-8901',
      fallbackMessage: `I want to make sure this is handled with utmost care. Please stay on the line while I connect you directly with our on-call coordinator.`
    };

    // 10. System Instructions
    const instructions = `You are ${name}, the official voice AI receptionist for ${businessName}.
Language Support: ${isHindi ? 'Hindi & English (bilingual code-switching allowed based on caller preference)' : 'English (clear, polite, professional)'}

PRIMARY OBJECTIVES:
${goals.map(g => `- ${g}`).join('\n')}

CONVERSATION FLOW:
${conversationSteps.join('\n')}

GUARDRAILS:
${guardrails.map(g => `- ${g}`).join('\n')}

ESCALATION PROTOCOL:
If any of these conditions are met:
${escalationRules.triggers.map(t => `- ${t}`).join('\n')}
Say: "${escalationRules.fallbackMessage}" and transfer to ${escalationRules.transferPhone}.

NOTE: Keep answers under 2-3 sentences. Tone should be attentive, respectful, and concise.`;

    return {
      name,
      description: `Voice receptionist for ${businessName} configured from natural-language prompt.`,
      businessName,
      businessType: detectedCategory,
      persona,
      goals,
      firstMessage,
      instructions,
      guardrails,
      language: detectedLanguage,
      suggestedVoiceId: voiceId,
      conversationSteps,
      requiredInformation,
      escalationRules,
      sampleQueries,
      generatedFromPrompt: input.prompt,
      isMockGeneration: true
    };
  }

  // ========================================================================
  // Task 3: Natural Language Refinement
  // Allows small conversational tweaks to update the draft configuration
  // ========================================================================
  async refineConfiguration(input: RefineAgentPromptInput): Promise<GeneratedAgentConfig> {
    await delay(350);
    const { currentConfig, refinementPrompt } = input;
    const refLower = refinementPrompt.toLowerCase();

    const updated: GeneratedAgentConfig = {
      ...currentConfig,
      goals: [...currentConfig.goals],
      guardrails: [...currentConfig.guardrails],
      conversationSteps: [...currentConfig.conversationSteps],
      requiredInformation: [...currentConfig.requiredInformation],
      escalationRules: {
        ...currentConfig.escalationRules,
        triggers: [...currentConfig.escalationRules.triggers]
      }
    };

    // 1. Shorter greeting
    if (refLower.includes('short') || refLower.includes('brief') || refLower.includes('concise')) {
      updated.firstMessage = `Hello! Thanks for calling ${currentConfig.businessName}. How can I assist you today?`;
      if (!updated.guardrails.some(g => g.toLowerCase().includes('strictly under 2 sentences'))) {
        updated.guardrails.unshift('Keep all responses strictly under 2 sentences.');
      }
    }

    // 2. Hindi language
    if (refLower.includes('hindi') || refLower.includes('hinglish')) {
      updated.language = 'hi-IN';
      updated.firstMessage = `नमस्ते! (Namaste!) Welcome to ${currentConfig.businessName}. मैं आपकी क्या सहायता कर सकता हूँ? How can I help you today?`;
      if (!updated.goals.some(g => g.includes('Hindi'))) {
        updated.goals.push('Seamlessly understand and respond in Hindi and English.');
      }
    }

    // 3. Spanish language
    if (refLower.includes('spanish') || refLower.includes('español')) {
      updated.language = 'es-ES';
      updated.firstMessage = `¡Hola! Gracias por llamar a ${currentConfig.businessName}. ¿En qué le puedo colaborar hoy?`;
    }

    // 4. Escalation of complaints
    if (refLower.includes('complaint') || refLower.includes('angry') || refLower.includes('upset')) {
      if (!updated.escalationRules.triggers.some(t => t.toLowerCase().includes('complaint'))) {
        updated.escalationRules.triggers.unshift('Caller expressing grievance, negative feedback, or formal complaint');
      }
      if (!updated.guardrails.some(g => g.toLowerCase().includes('empathy'))) {
        updated.guardrails.push('Acknowledge caller complaints with sincere empathy before initiating escalation.');
      }
    }

    // 5. Cancellation policy
    if (refLower.includes('cancellation') || refLower.includes('reschedule') || refLower.includes('fee')) {
      if (!updated.requiredInformation.includes('Cancellation Confirmation Notice')) {
        updated.requiredInformation.push('Cancellation Confirmation (24-hour notice reminder)');
      }
      if (!updated.guardrails.some(g => g.toLowerCase().includes('24-hour'))) {
        updated.guardrails.push('Remind callers that appointments require 24 hours advance notice to avoid fee.');
      }
    }

    // 6. Append refinement audit trail to system instructions
    updated.instructions = `${updated.instructions}\n\n[USER REFINEMENT APPLIED]: "${refinementPrompt}"\nEnsure the above preference is strictly followed in caller dialogue.`;

    return updated;
  }
}
