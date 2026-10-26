// ==========================================================================
// VaaniFlow AI — Type Definitions
// ==========================================================================

export type BusinessCategory =
  | 'dental'
  | 'auto_repair'
  | 'real_estate'
  | 'law_firm'
  | 'salon_spa'
  | 'restaurant'
  | 'custom';

export type AgentStatus = 'active' | 'draft' | 'testing';

export interface VoiceOption {
  id: string;
  name: string;
  gender: 'female' | 'male' | 'neutral';
  accent: string;
  tone: string;
  elevenLabsVoiceId: string;
  previewSampleText: string;
}

export interface BusinessTemplate {
  id: BusinessCategory;
  label: string;
  iconName: string;
  shortDesc: string;
  defaultAgentName: string;
  defaultGreeting: string;
  defaultInstructions: string;
  recommendedVoiceId: string;
  sampleCallerQueries: string[];
}

export interface AgentStats {
  totalCalls: number;
  avgDurationSec: number;
  resolutionRate: number; // e.g. 94 for 94%
  lastActive: string;
}

export interface EscalationConfig {
  triggers: string[];
  transferPhone?: string;
  fallbackMessage: string;
}

export interface GeneratedAgentConfig {
  name: string;
  description: string;
  businessName: string;
  businessType: BusinessCategory;
  persona: string;
  goals: string[];
  firstMessage: string;
  instructions: string;
  guardrails: string[];
  language: string;
  suggestedVoiceId: string;
  conversationSteps: string[];
  requiredInformation: string[];
  escalationRules: EscalationConfig;
  sampleQueries?: string[];
  generatedFromPrompt?: string;
  isMockGeneration: boolean;
  rawBackendConfig?: BackendGeneratedAgentConfig;
}

export interface GenerateAgentPromptInput {
  prompt: string;
  category?: BusinessCategory;
  voiceId?: string;
}

export interface RefineAgentPromptInput {
  currentConfig: GeneratedAgentConfig;
  refinementPrompt: string;
}

export interface Agent {
  id: string;
  agent_id?: string;
  backendId?: number;
  isBackendProvisioned?: boolean;
  name: string;
  businessName: string;
  businessType: BusinessCategory;
  status: AgentStatus;
  language: string;
  voiceId: string;
  firstMessage: string;
  instructions: string;
  transferPhone?: string;
  businessHours?: string;
  businessAddress?: string;
  // Extended structured fields from prompt generation
  description?: string;
  persona?: string;
  goals?: string[];
  guardrails?: string[];
  conversationSteps?: string[];
  requiredInformation?: string[];
  escalationTriggers?: string[];
  fallbackMessage?: string;
  generatedFromPrompt?: string;
  stats: AgentStats;
  createdAt: string;
  updatedAt: string;
}

// ==========================================================================
// FastAPI Backend Contract Schemas
// ==========================================================================

export interface BackendVoicePreference {
  gender?: string | null;
  accent?: string | null;
  description?: string | null;
  voice_id?: string | null;
}

export interface BackendAgentPreferences {
  language?: string | null;
  tone?: string | null;
  business_type?: string | null;
  voice_gender?: string | null;
  voice_accent?: string | null;
  voice_id?: string | null;
  capabilities?: string[] | null;
}

export interface BackendConfigureRequest {
  prompt: string;
  preferences?: BackendAgentPreferences;
}

export interface BackendFAQItem {
  question: string;
  answer: string;
}

export interface BackendAppointmentHandling {
  enabled?: boolean;
  instructions?: string;
}

export interface BackendGeneratedAgentConfig {
  agent_name: string;
  business_type: string;
  primary_language?: string;
  additional_languages?: string[];
  first_message: string;
  system_prompt: string;
  voice_preference?: BackendVoicePreference;
  intended_capabilities?: string[];
  faqs?: BackendFAQItem[];
  appointment_handling?: BackendAppointmentHandling;
}

export interface BackendConfigureResponse {
  status: string;
  configuration: BackendGeneratedAgentConfig;
  elevenlabs_config_preview: Record<string, unknown>;
}

export interface BackendAgentCreateRequest {
  configuration: BackendGeneratedAgentConfig;
  voice_id?: string | null;
}

export interface BackendAgentCreateResponse {
  status: string;
  agent_id: string;
  name: string;
  business_type: string;
  voice_id: string;
  created_at: string;
}

export interface BackendAgentSummary {
  id: number;
  agent_id: string;
  name: string;
  business_type: string;
  voice_id: string;
  created_at: string;
}

export interface BackendAgentListResponse {
  status: string;
  agents: BackendAgentSummary[];
  total: number;
}

export interface BackendSessionResponse {
  status: string;
  agent_id: string;
  signed_url: string;
  expires_in_seconds: number;
}

export interface BackendHealthResponse {
  status: string;
  service?: string;
}

export type SessionOutcome =
  | 'appointment_booked'
  | 'query_resolved'
  | 'transferred_to_human'
  | 'followup_required'
  | 'incomplete';

export interface Session {
  id: string;
  agentId: string;
  agentName: string;
  businessType: BusinessCategory;
  callerNumber: string;
  startedAt: string;
  durationSeconds: number;
  outcome: SessionOutcome;
  summary: string;
  sentiment: 'positive' | 'neutral' | 'needs_attention';
  isMock: boolean;
  transcriptSnippet?: string;
}

export interface DashboardMetrics {
  totalCallsHandled: number;
  callsChangePercent: number;
  resolutionRatePercent: number;
  avgCallDurationSeconds: number;
  activeAgentsCount: number;
  totalTimeSavedHours: number;
}
