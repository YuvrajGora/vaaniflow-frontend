// ==========================================================================
// VaaniFlow AI — Agent Service Layer
// Decoupled gateway: routes to MockAdapter or live FastAPI backend
// ==========================================================================
import type {
  Agent,
  BackendAgentCreateRequest,
  BackendAgentCreateResponse,
  BackendAgentListResponse,
  BackendAgentPreferences,
  BackendAgentSummary,
  BackendConfigureRequest,
  BackendConfigureResponse,
  BackendGeneratedAgentConfig,
  BackendHealthResponse,
  BackendSessionResponse,
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
import { MockAgentAdapter } from './mockAdapter';
import { MOCK_BUSINESS_TEMPLATES, MOCK_VOICES, VALIDATED_VOICE_ID } from './mockData';

// Determine if we are running in mock adapter mode
// Defaults to false only when VITE_USE_MOCK is explicitly 'false'
const isExplicitMock = import.meta.env.VITE_USE_MOCK !== 'false';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

class HttpAgentApiClient implements AgentApiClient {
  public readonly isMockMode = false;
  public readonly apiBaseUrl: string;

  constructor(baseUrl: string) {
    this.apiBaseUrl = baseUrl;
  }

  /**
   * Builds sanitized URL preventing double slashes and accidental `/api/api/...` duplication
   */
  private buildUrl(endpoint: string): string {
    const base = this.apiBaseUrl.replace(/\/+$/, '');
    let path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    // If base ends with /api and path starts with /api/, remove redundant /api prefix
    if (base.endsWith('/api') && path.startsWith('/api/')) {
      path = path.slice(4);
    }
    return `${base}${path}`;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = this.buildUrl(endpoint);
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      ...options
    });

    if (!response.ok) {
      let errDetail = response.statusText;
      try {
        const errJson = await response.json();
        errDetail = errJson.detail || errJson.message || JSON.stringify(errJson);
      } catch {
        const errText = await response.text();
        if (errText) errDetail = errText;
      }
      throw new Error(`API error (${response.status}): ${errDetail}`);
    }

    return response.json();
  }

  private normalizeBusinessType(rawType?: string | null): BusinessCategory {
    if (!rawType) return 'custom';
    const lower = rawType.toLowerCase();
    if (lower.includes('dent')) return 'dental';
    if (lower.includes('auto') || lower.includes('mechanic') || lower.includes('repair')) return 'auto_repair';
    if (lower.includes('real') || lower.includes('estate') || lower.includes('property')) return 'real_estate';
    if (lower.includes('law') || lower.includes('legal') || lower.includes('attorney')) return 'law_firm';
    if (lower.includes('salon') || lower.includes('spa')) return 'salon_spa';
    if (lower.includes('restaurant') || lower.includes('cafe') || lower.includes('food')) return 'restaurant';
    return 'custom';
  }

  private mapBackendSummaryToAgent(summary: BackendAgentSummary): Agent {
    const category = this.normalizeBusinessType(summary.business_type);
    return {
      id: summary.agent_id,
      agent_id: summary.agent_id,
      backendId: summary.id,
      isBackendProvisioned: true,
      name: summary.name,
      businessName: summary.name,
      businessType: category,
      status: 'active',
      language: 'English / Hindi',
      voiceId: summary.voice_id || VALIDATED_VOICE_ID,
      firstMessage: `Hello! Thank you for calling ${summary.name}. How may I help you today?`,
      instructions: `Inbound voice agent for ${summary.business_type}.`,
      stats: {
        totalCalls: 0,
        avgDurationSec: 0,
        resolutionRate: 0,
        lastActive: summary.created_at ? new Date(summary.created_at).toLocaleDateString() : 'Active'
      },
      createdAt: summary.created_at || new Date().toISOString(),
      updatedAt: summary.created_at || new Date().toISOString()
    };
  }

  private mapBackendConfigureToFrontend(
    conf: BackendGeneratedAgentConfig,
    originalPrompt: string,
    resolvedVoiceId: string
  ): GeneratedAgentConfig {
    const category = this.normalizeBusinessType(conf.business_type);
    const goals = conf.intended_capabilities && conf.intended_capabilities.length > 0
      ? conf.intended_capabilities
      : ['Warmly greet callers', 'Answer business inquiries', 'Record appointment preferences'];

    const sampleQueries = conf.faqs && conf.faqs.length > 0
      ? conf.faqs.map((f) => f.question)
      : ['What are your hours of operation?', 'How do I schedule an appointment?', 'Do you handle emergency inquiries?'];

    return {
      name: conf.agent_name || 'AI Receptionist',
      description: `${conf.agent_name} — Inbound voice receptionist for ${conf.business_type}`,
      businessName: conf.business_type
        ? conf.business_type.charAt(0).toUpperCase() + conf.business_type.slice(1)
        : 'Business Reception',
      businessType: category,
      persona: conf.system_prompt ? conf.system_prompt.slice(0, 160) + '...' : 'Professional, courteous receptionist.',
      goals,
      firstMessage: conf.first_message,
      instructions: conf.system_prompt,
      guardrails: [
        'Never fabricate unverified business policies, medical diagnosis, or pricing.',
        'Keep responses concise and conversational for natural turn-taking.',
        'Identify acute emergencies or grievances and offer human staff escalation.'
      ],
      language: conf.primary_language || 'en',
      suggestedVoiceId: conf.voice_preference?.voice_id || resolvedVoiceId,
      conversationSteps: [
        '1. Greeting & Identity: Warm opening and identify business domain.',
        '2. Intent Triage: Understand caller request or appointment need.',
        '3. Information Gathering: Collect caller contact and scheduling preferences.',
        '4. Confirmation: Clarify that the request was noted for staff review.'
      ],
      requiredInformation: ['Caller Full Name', 'Contact Phone', 'Preferred Appointment Date & Time'],
      escalationRules: {
        triggers: ['Emergency, acute pain, or safety concern', 'Explicit caller request for human staff'],
        transferPhone: '+1 (555) 234-8901',
        fallbackMessage: 'I understand this is important. Please hold while I connect you with our on-call coordinator.'
      },
      sampleQueries,
      generatedFromPrompt: originalPrompt,
      isMockGeneration: false,
      rawBackendConfig: conf
    };
  }

  // 1. Truthful Health Check
  async checkHealth(): Promise<BackendHealthResponse> {
    return this.request<BackendHealthResponse>('/health');
  }

  // 2. Truthful Metrics (no backend /metrics endpoint; derived truthfully from provisioned agents)
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const agents = await this.getAgents();
    return {
      totalCallsHandled: 0,
      callsChangePercent: 0,
      resolutionRatePercent: 0,
      avgCallDurationSeconds: 0,
      activeAgentsCount: agents.length,
      totalTimeSavedHours: 0
    };
  }

  // 3. Agent List
  async getAgents(): Promise<Agent[]> {
    const data = await this.request<BackendAgentListResponse>('/agents');
    return (data?.agents || []).map((summary) => this.mapBackendSummaryToAgent(summary));
  }

  // 4. Agent By ID (backed by real agent_id in agent list)
  async getAgentById(id: string): Promise<Agent | null> {
    const agents = await this.getAgents();
    return agents.find((a) => a.id === id || a.agent_id === id || String(a.backendId) === id) || null;
  }

  // 5. Create Agent via real ElevenLabs provisioning
  async createAgent(input: CreateAgentInput): Promise<Agent> {
    // Resolve ElevenLabs voice ID
    let resolvedVoiceId = VALIDATED_VOICE_ID;
    if (input.voiceId) {
      const found = MOCK_VOICES.find((v) => v.id === input.voiceId || v.elevenLabsVoiceId === input.voiceId);
      if (found && found.elevenLabsVoiceId) {
        resolvedVoiceId = found.elevenLabsVoiceId;
      } else if (input.voiceId.length >= 15 && !input.voiceId.includes(' ')) {
        resolvedVoiceId = input.voiceId;
      }
    }

    let configPayload: BackendGeneratedAgentConfig;
    if (input.rawBackendConfig) {
      configPayload = {
        ...input.rawBackendConfig,
        agent_name: input.name,
        business_type: input.businessType || input.rawBackendConfig.business_type,
        first_message: input.firstMessage,
        system_prompt: input.instructions,
        voice_preference: {
          ...input.rawBackendConfig.voice_preference,
          voice_id: resolvedVoiceId
        }
      };
    } else {
      configPayload = {
        agent_name: input.name,
        business_type: input.businessType || 'General Reception',
        primary_language: input.language === 'hi' || input.language === 'Hindi' ? 'hi' : 'en',
        additional_languages: ['en'],
        first_message: input.firstMessage,
        system_prompt: input.instructions,
        voice_preference: {
          gender: 'male',
          accent: 'Indian',
          description: 'Courteous and professional voice receptionist',
          voice_id: resolvedVoiceId
        },
        intended_capabilities: input.goals || ['Answer common questions', 'Record appointment inquiries'],
        faqs: [],
        appointment_handling: {
          enabled: true,
          instructions: 'Collect appointment details and note down the caller request.'
        }
      };
    }

    const requestBody: BackendAgentCreateRequest = {
      configuration: configPayload,
      voice_id: resolvedVoiceId
    };

    const res = await this.request<BackendAgentCreateResponse>('/agents', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });

    return {
      id: res.agent_id,
      agent_id: res.agent_id,
      name: res.name,
      businessName: res.name,
      businessType: this.normalizeBusinessType(res.business_type),
      status: 'active',
      language: configPayload.primary_language || 'en',
      voiceId: res.voice_id || resolvedVoiceId,
      firstMessage: configPayload.first_message,
      instructions: configPayload.system_prompt,
      isBackendProvisioned: true,
      stats: {
        totalCalls: 0,
        avgDurationSec: 0,
        resolutionRate: 0,
        lastActive: res.created_at ? new Date(res.created_at).toLocaleDateString() : 'Just now'
      },
      createdAt: res.created_at || new Date().toISOString(),
      updatedAt: res.created_at || new Date().toISOString()
    };
  }

  // 6. Update Agent (Disclose backend immutability honestly)
  async updateAgent(_id: string, _input: UpdateAgentInput): Promise<Agent> {
    throw new Error(
      'Live backend agents cannot be updated in-place because ElevenLabs agents are provisioned immutably. Please create a new agent from this configuration.'
    );
  }

  // 7. Delete Agent (Disclose backend limitation honestly)
  async deleteAgent(_id: string): Promise<boolean> {
    throw new Error('Remote agent deletion is not supported by the FastAPI backend in this prototype.');
  }

  // 8. Session History (Truthful empty state since backend does not persist call records)
  async getSessions(_limit = 10): Promise<Session[]> {
    return [];
  }

  // 9. Curated Voice Catalog (Explicitly preserves validated ElevenLabs IDs)
  async getVoices(): Promise<VoiceOption[]> {
    return MOCK_VOICES;
  }

  // 10. Curated Business Templates
  async getBusinessTemplates(): Promise<BusinessTemplate[]> {
    return MOCK_BUSINESS_TEMPLATES;
  }

  // 11. Generate draft configuration via real Gemini backend
  async generateFromPrompt(input: GenerateAgentPromptInput): Promise<GeneratedAgentConfig> {
    const resolvedVoiceId = input.voiceId || VALIDATED_VOICE_ID;
    const preferences: BackendAgentPreferences = {
      business_type: input.category || undefined,
      voice_id: resolvedVoiceId
    };

    const payload: BackendConfigureRequest = {
      prompt: input.prompt,
      preferences
    };

    const res = await this.request<BackendConfigureResponse>('/agents/configure', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    return this.mapBackendConfigureToFrontend(res.configuration, input.prompt, resolvedVoiceId);
  }

  // 12. Refine configuration (Re-invokes Gemini with updated instructions)
  async refineConfiguration(input: RefineAgentPromptInput): Promise<GeneratedAgentConfig> {
    const combinedPrompt = `${input.currentConfig.name} for ${input.currentConfig.businessType}. Refinement instruction: ${input.refinementPrompt}. Existing instructions to update: ${input.currentConfig.instructions.slice(0, 300)}`;
    return this.generateFromPrompt({
      prompt: combinedPrompt,
      category: input.currentConfig.businessType,
      voiceId: input.currentConfig.suggestedVoiceId
    });
  }

  // 13. Authorize live ElevenLabs browser voice session
  async authorizeSession(agentId: string): Promise<BackendSessionResponse> {
    return this.request<BackendSessionResponse>(`/agents/${agentId}/session`, {
      method: 'POST'
    });
  }
}

// Instantiate the active client
export const agentService: AgentApiClient = isExplicitMock
  ? new MockAgentAdapter()
  : new HttpAgentApiClient(apiBaseUrl);

export const IS_MOCK_MODE = agentService.isMockMode;
export const API_BASE_URL = agentService.apiBaseUrl;
