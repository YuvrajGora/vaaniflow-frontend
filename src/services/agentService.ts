// ==========================================================================
// VaaniFlow AI — Agent Service Layer
// Decoupled gateway: routes to MockAdapter or live FastAPI backend
// ==========================================================================
import type { Agent, BusinessTemplate, DashboardMetrics, Session, VoiceOption } from '../types/agent';
import type { AgentApiClient, CreateAgentInput, UpdateAgentInput } from './api';
import { MockAgentAdapter } from './mockAdapter';

// Determine if we are running in mock adapter mode
// Defaults to true when VITE_USE_MOCK is 'true' or not set, or when no backend URL is available
const isExplicitMock = import.meta.env.VITE_USE_MOCK !== 'false';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

class HttpAgentApiClient implements AgentApiClient {
  public readonly isMockMode = false;
  public readonly apiBaseUrl: string;

  constructor(baseUrl: string) {
    this.apiBaseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      ...options
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API error (${response.status}): ${errText || response.statusText}`);
    }

    return response.json();
  }

  getDashboardMetrics(): Promise<DashboardMetrics> {
    return this.request<DashboardMetrics>('/metrics');
  }

  getAgents(): Promise<Agent[]> {
    return this.request<Agent[]>('/agents');
  }

  getAgentById(id: string): Promise<Agent | null> {
    return this.request<Agent>(`/agents/${id}`);
  }

  createAgent(input: CreateAgentInput): Promise<Agent> {
    return this.request<Agent>('/agents', {
      method: 'POST',
      body: JSON.stringify(input)
    });
  }

  updateAgent(id: string, input: UpdateAgentInput): Promise<Agent> {
    return this.request<Agent>(`/agents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input)
    });
  }

  async deleteAgent(id: string): Promise<boolean> {
    await this.request(`/agents/${id}`, { method: 'DELETE' });
    return true;
  }

  getSessions(limit = 10): Promise<Session[]> {
    return this.request<Session[]>(`/sessions?limit=${limit}`);
  }

  getVoices(): Promise<VoiceOption[]> {
    return this.request<VoiceOption[]>('/voices');
  }

  getBusinessTemplates(): Promise<BusinessTemplate[]> {
    return this.request<BusinessTemplate[]>('/templates');
  }

  generateFromPrompt(input: import('../types/agent').GenerateAgentPromptInput): Promise<import('../types/agent').GeneratedAgentConfig> {
    return this.request<import('../types/agent').GeneratedAgentConfig>('/agents/generate-from-prompt', {
      method: 'POST',
      body: JSON.stringify(input)
    });
  }

  refineConfiguration(input: import('../types/agent').RefineAgentPromptInput): Promise<import('../types/agent').GeneratedAgentConfig> {
    return this.request<import('../types/agent').GeneratedAgentConfig>('/agents/refine-configuration', {
      method: 'POST',
      body: JSON.stringify(input)
    });
  }
}

// Instantiate the active client
export const agentService: AgentApiClient = isExplicitMock
  ? new MockAgentAdapter()
  : new HttpAgentApiClient(apiBaseUrl);

export const IS_MOCK_MODE = agentService.isMockMode;
export const API_BASE_URL = agentService.apiBaseUrl;
