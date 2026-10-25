// ==========================================================================
// VaaniFlow AI — Typed API Service Contract
// ==========================================================================
import type {
  Agent,
  BusinessTemplate,
  DashboardMetrics,
  GenerateAgentPromptInput,
  GeneratedAgentConfig,
  RefineAgentPromptInput,
  Session,
  VoiceOption
} from '../types/agent';

export interface CreateAgentInput {
  name: string;
  businessName: string;
  businessType: Agent['businessType'];
  language: string;
  voiceId: string;
  firstMessage: string;
  instructions: string;
  transferPhone?: string;
  businessHours?: string;
  businessAddress?: string;
  description?: string;
  persona?: string;
  goals?: string[];
  guardrails?: string[];
  conversationSteps?: string[];
  requiredInformation?: string[];
  escalationTriggers?: string[];
  fallbackMessage?: string;
  generatedFromPrompt?: string;
}

export interface UpdateAgentInput extends Partial<CreateAgentInput> {
  status?: Agent['status'];
}

export interface AgentApiClient {
  isMockMode: boolean;
  apiBaseUrl: string;

  getDashboardMetrics(): Promise<DashboardMetrics>;
  getAgents(): Promise<Agent[]>;
  getAgentById(id: string): Promise<Agent | null>;
  createAgent(input: CreateAgentInput): Promise<Agent>;
  updateAgent(id: string, input: UpdateAgentInput): Promise<Agent>;
  deleteAgent(id: string): Promise<boolean>;
  getSessions(limit?: number): Promise<Session[]>;
  getVoices(): Promise<VoiceOption[]>;
  getBusinessTemplates(): Promise<BusinessTemplate[]>;

  // Prompt-First Generation & Natural Language Refinement
  generateFromPrompt(input: GenerateAgentPromptInput): Promise<GeneratedAgentConfig>;
  refineConfiguration(input: RefineAgentPromptInput): Promise<GeneratedAgentConfig>;
}
