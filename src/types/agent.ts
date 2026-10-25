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
}

export interface GenerateAgentPromptInput {
  prompt: string;
  category?: BusinessCategory;
}

export interface RefineAgentPromptInput {
  currentConfig: GeneratedAgentConfig;
  refinementPrompt: string;
}

export interface Agent {
  id: string;
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
