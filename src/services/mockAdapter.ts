// ==========================================================================
// VaaniFlow AI — Mock Service Adapter
// Clearly labeled mock data adapter implementing AgentApiClient
// Simulates API responses with realistic latency and localStorage persistence
// ==========================================================================
import type { Agent, BusinessTemplate, DashboardMetrics, Session, VoiceOption } from '../types/agent';
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
}
