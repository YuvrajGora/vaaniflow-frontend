# VaaniFlow AI — Frontend Studio

> **Intelligent Voice AI Receptionist Platform for Small Businesses & Healthcare Clinics**  
> Prompt-first agent configuration powered by Google Gemini, real-time voice streaming with ElevenLabs Conversational AI, and a warm editorial management studio.

---

## 1. Overview

**VaaniFlow AI** enables small businesses, clinics, and service providers to provision human-grade inbound voice receptionists in seconds. Instead of navigating complex IVR trees or brittle rule-based routing, owners enter plain-language business descriptions. VaaniFlow analyzes the requirements with Gemini, produces structured conversational prompts and safety guardrails, provisions production agents on ElevenLabs, and provides an interactive Voice Testing Studio with live bidirectional audio streaming.

---

## 2. Key Features

- **Prompt-First Agent Generation**: Natural language prompts (e.g., clinic hours, triage rules, appointment policies) are transformed into structured system instructions, greetings, and guardrails via Google Gemini.
- **Structured Configuration Editor**: Review and fine-tune identity, tone, dialogue flow, appointment handling, and human escalation triggers before provisioning.
- **Live ElevenLabs Voice Testing Studio**: Low-latency, bidirectional audio conversation directly in the browser via Web Audio analysers and the official `@elevenlabs/react` SDK.
- **FastAPI Backend Integration**: Typed client abstraction connecting to FastAPI for health monitoring, configuration generation, agent persistence, and single-use signed WebSocket session authorization.
- **Warm Editorial UI**: Distinctive editorial design system featuring rich typography, ambient status pills, live audio visualizer frequency meters, and responsive layouts.
- **Resilient Dual-Mode Operation**: Seamlessly switches between live FastAPI + ElevenLabs services and offline demo mode for isolated development.

---

## 3. Architecture & Audio Flow

```text
[ Browser / VaaniFlow Studio ]
      │
      ├── 1. GET /api/health & GET /api/agents ──────────────► [ FastAPI Backend ]
      │                                                              │
      ├── 2. POST /api/agents/configure (Prompt) ────────────► [ Gemini Model ]
      │                                                              │
      ├── 3. POST /api/agents (Provision) ────────────────────► [ ElevenLabs API + SQLite ]
      │                                                              │
      ├── 4. POST /api/agents/{id}/session ──────────────────► [ Signed URL Auth ]
      │                                                              │
      └── 5. WebSocket Connect (Signed URL) ─────────────────► [ ElevenLabs Conversational AI ]
             (Live Bidirectional Audio Streaming)
```

### Security Architecture
- The frontend **never** holds, prints, or exposes `ELEVENLABS_API_KEY` or `GEMINI_API_KEY`.
- Browser voice sessions are authorized on-demand by the FastAPI backend, which returns short-lived, single-use signed WebSocket URLs (`POST /api/agents/{agent_id}/session`).

---

## 4. Technology Stack

- **Framework**: React 19, TypeScript
- **Bundler & Tooling**: Vite 8, Oxlint
- **Voice & Audio**: `@elevenlabs/react`, `@elevenlabs/client`, Web Audio API (`AnalyserNode`)
- **Icons**: Lucide React
- **Styling**: Vanilla CSS Design Tokens (Warm Editorial Theme)

---

## 5. Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Backend**: Running FastAPI backend instance (default: `http://127.0.0.1:8000`)

---

## 6. Environment Configuration

Copy `.env.example` to `.env` in the project root:

```bash
cp .env.example .env
```

| Variable | Description | Default / Example |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API | `http://127.0.0.1:8000/api` |
| `VITE_USE_MOCK` | Toggle between live backend (`false`) and demo adapter (`true`) | `false` |

> **Note**: `.env` is gitignored. Do not add backend API keys or secrets to frontend environment files.

---

## 7. Setup & Development Commands

```bash
# Install dependencies
npm install

# Start Vite development server (default: http://localhost:5173)
npm run dev

# Run Oxlint linter
npm run lint

# Build for production (TypeScript check + Vite production bundle)
npm run build

# Preview production build locally
npm run preview
```

---

## 8. Usage Instructions

1. **Dashboard (`/`)**: View configured receptionists, backend connectivity status (`FastAPI Live`), and quick metrics.
2. **Agent Builder (`/builder`)**:
   - Enter a business scenario (e.g., *"Create an emergency dental receptionist for Pearl Clinic"*).
   - Click **Generate Agent Configuration** to invoke the Gemini synthesis engine.
   - Fine-tune name, greeting, primary language, voice selection, or escalation triggers.
   - Click **Provision Live ElevenLabs Agent** to record the agent in SQLite and register it with ElevenLabs.
3. **Voice Studio (`/test`)**:
   - Select any provisioned receptionist.
   - Click **Start Test Call** to request an authorized signed URL and establish a real-time WebSocket connection.
   - Speak via microphone or test with caller scenario prompts; monitor live audio frequency bars and real-time transcripts.
   - Click **End Call** to tear down Web Audio resources cleanly.
4. **Session History (`/sessions`)**: Review real-time call logging notices and active session parameters.

---

## 9. Prototype Disclosures

- **Live Audio Streaming**: Audio streams ephemerally over WebSockets directly to ElevenLabs. The hackathon backend prototype does not persist audio recordings or chat transcripts in SQLite after a call ends.
- **Agent Immutability**: The backend prototype supports creation and listing of agents; remote edits and deletions are handled as immutable records by the backend.
