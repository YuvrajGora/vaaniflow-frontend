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
