// ==========================================================================
// VaaniFlow AI — Curated Mock Data
// Explicitly labeled mock dataset for standalone frontend development
// ==========================================================================
import type { Agent, BusinessTemplate, DashboardMetrics, Session, VoiceOption } from '../types/agent';

export const VALIDATED_VOICE_ID = 'SZfY4K69FwXus87eayHK';

export const MOCK_VOICES: VoiceOption[] = [
  {
    id: 'aarav-validated',
    name: 'Aarav (Validated Live Voice)',
    gender: 'male',
    accent: 'Indian English',
    tone: 'Warm, Courteous & Conversational',
    elevenLabsVoiceId: 'SZfY4K69FwXus87eayHK',
    previewSampleText: "Namaste! Welcome to our clinic. I am your voice receptionist. How may I assist you with your smile today?"
  },
  {
    id: 'rachel',
    name: 'Rachel',
    gender: 'female',
    accent: 'American',
    tone: 'Calm, Professional & Reassuring',
    elevenLabsVoiceId: '21m00Tcm4TlvDq8ikWAM',
    previewSampleText: "Hello! Thank you for calling Apex Family Dental Care. My name is Maya, your AI receptionist. How may I assist you today?"
  },
  {
    id: 'drew',
    name: 'Drew',
    gender: 'male',
    accent: 'American',
    tone: 'Warm, Personable & Conversational',
    elevenLabsVoiceId: '29vD33N1CtxCmqQRPOHJ',
    previewSampleText: "Hi there! Thanks for reaching Speedy Auto Repair. How can I help get your vehicle taken care of today?"
  },
  {
    id: 'domi',
    name: 'Domi',
    gender: 'female',
    accent: 'American',
    tone: 'Energetic, Clear & Polished',
    elevenLabsVoiceId: 'AZnzlk1XvdvUeBnXmlld',
    previewSampleText: "Welcome to Prestige Realty Group. I'm Sophia. Are you calling regarding a listing or to speak with an agent?"
  },
  {
    id: 'paul',
    name: 'Paul',
    gender: 'male',
    accent: 'British',
    tone: 'Authoritative, Refined & Trustworthy',
    elevenLabsVoiceId: 'TX3LPaxmHKxFdv7VOQHJ',
    previewSampleText: "Good day. You have reached Sterling & Hughes Law Chambers. May I confirm your name and consultation inquiry?"
  },
  {
    id: 'fin',
    name: 'Fin',
    gender: 'male',
    accent: 'Irish',
    tone: 'Relaxed, Friendly & Welcoming',
    elevenLabsVoiceId: 'D38z5RcWu1voky8WS1ja',
    previewSampleText: "Hi there! Welcome to Bella Luna Trattoria. Would you like to reserve a table or check our evening specials?"
  }
];

export const MOCK_BUSINESS_TEMPLATES: BusinessTemplate[] = [
  {
    id: 'dental',
    label: 'Dental & Medical Clinic',
    iconName: 'Stethoscope',
    shortDesc: 'Patient appointment bookings, emergency dental triages, insurance inquiries & hours.',
    defaultAgentName: 'Maya — Front Desk Coordinator',
    defaultGreeting: 'Hello! Thank you for calling Apex Family Dental Care. I am Maya, your receptionist. Are you calling to schedule an appointment or ask about our services?',
    recommendedVoiceId: 'rachel',
    sampleCallerQueries: [
      'Do you accept Delta Dental insurance?',
      'I have a chipped molar and severe pain, can I get in today?',
      'Can I reschedule my hygiene cleaning next Tuesday?'
    ],
    defaultInstructions: `You are Maya, the friendly, reassuring front-desk AI receptionist for Apex Family Dental Care.
Business Address: 402 Elmwood Parkway, Suite 100
Hours: Monday through Friday, 8:00 AM to 5:30 PM. Saturday 9:00 AM to 1:00 PM. Closed Sundays.
Accepted Insurance: Delta Dental, Cigna Dental, MetLife, Aetna PPO.
Emergency Policy: If patient reports severe bleeding, uncontrolled pain, or fever, express empathy, ask for contact number, and offer same-day triage slot or escalate call immediately.
Booking: Collect patient full name, date of birth, preferred date and time, and reason for visit (cleaning, checkup, cavity, pain).
Maintain a warm, compassionate, and concise tone at all times. Keep answers under 2-3 sentences.`
  },
  {
    id: 'auto_repair',
    label: 'Auto Repair & Body Shop',
    iconName: 'Wrench',
    shortDesc: 'Service drop-offs, diagnostic estimates, towing help & parts status updates.',
    defaultAgentName: 'Liam — Service Advisor',
    defaultGreeting: 'Hi! Thanks for calling Speedy Auto & Tire Hub. This is Liam. What vehicle issue or maintenance service can we assist you with today?',
    recommendedVoiceId: 'drew',
    sampleCallerQueries: [
      'How much is a full synthetic oil change for an F-150?',
      'My check engine light just started blinking.',
      'Is my Honda Civic ready for pickup yet?'
    ],
    defaultInstructions: `You are Liam, an honest, knowledgeable virtual service advisor at Speedy Auto & Tire Hub.
Hours: Mon-Fri 7:30 AM - 6:00 PM.
Pricing estimates: Synthetic oil change is $79.99. Brake inspection is complimentary with repair. Computer diagnostic scan is $95 (applied towards repair cost if booked).
Drop-off policy: Early-bird key drop box available on the west side of the shop.
Protocol: If a customer asks if their car is ready, ask for their last name and phone number and notify them the service writer will text them a vehicle status link.`
  },
  {
    id: 'real_estate',
    label: 'Real Estate & Property',
    iconName: 'Building',
    shortDesc: 'Tour bookings, buyer pre-qualification intake, seller inquiries & lease questions.',
    defaultAgentName: 'Sophia — Leasing & Client Relations',
    defaultGreeting: 'Welcome to Prestige Realty Group. I am Sophia. Are you looking to schedule a property tour, explore listings, or speak with an agent?',
    recommendedVoiceId: 'domi',
    sampleCallerQueries: [
      'Can I tour the 3-bedroom on Highland Avenue this Saturday?',
      'What are the HOA fees for unit 4B?',
      'I want a free valuation of my property.'
    ],
    defaultInstructions: `You are Sophia, an upscale, prompt AI client concierge for Prestige Realty Group.
Goal: Warmly greet callers, understand whether they are buyers, sellers, or renters, gather target budget and timeline, and schedule a private consultation.`
  },
  {
    id: 'law_firm',
    label: 'Legal & Accounting',
    iconName: 'Scale',
    shortDesc: 'Confidential client intake, consultation scheduling, conflict check screening.',
    defaultAgentName: 'Marcus — Intake Specialist',
    defaultGreeting: 'Good day. Thank you for calling Sterling & Hughes Law Chambers. I am Marcus. May I assist you with scheduling a confidential legal consultation?',
    recommendedVoiceId: 'paul',
    sampleCallerQueries: [
      'Do you offer free initial consultations for business contracts?',
      'I need an attorney for an estate planning consultation.',
      'Can I speak directly with Mr. Sterling?'
    ],
    defaultInstructions: `You are Marcus, a discreet and professional intake specialist at Sterling & Hughes Law Chambers.
Note: Never give legal advice. Collect caller name, phone number, type of matter, and schedule a 30-minute introductory phone consultation.`
  },
  {
    id: 'salon_spa',
    label: 'Salon, Spa & Wellness',
    iconName: 'Sparkles',
    shortDesc: 'Stylist bookings, treatment inquiries, package specials & cancellation policies.',
    defaultAgentName: 'Chloe — Guest Experience',
    defaultGreeting: 'Hello! Thank you for calling Serenity Hair & Day Spa. This is Chloe. Would you like to book an appointment or hear about our packages today?',
    recommendedVoiceId: 'rachel',
    sampleCallerQueries: [
      'Do you have any openings for a balayage this Friday afternoon?',
      'What is your 24-hour cancellation policy?',
      'Can I book a couples massage for next weekend?'
    ],
    defaultInstructions: `You are Chloe, a serene and attentive guest experience AI for Serenity Hair & Day Spa.
Hours: Tuesday-Sunday 9 AM to 7 PM. Closed Mondays.
Policy: 24-hour notice requested for cancellations.
Confirm stylist preference, requested service, and customer mobile number.`
  },
  {
    id: 'restaurant',
    label: 'Restaurant & Catering',
    iconName: 'Utensils',
    shortDesc: 'Table reservations, dietary questions, hours, catering requests & parking info.',
    defaultAgentName: 'Luca — Table Host',
    defaultGreeting: 'Buonasera! Welcome to Bella Luna Trattoria. I am Luca. Can I help you reserve a table for tonight or assist with a private dining inquiry?',
    recommendedVoiceId: 'fin',
    sampleCallerQueries: [
      'Do you have outdoor seating for a party of 6 tonight at 7:30?',
      'Do you offer gluten-free pasta options?',
      'Where can our guests park?'
    ],
    defaultInstructions: `You are Luca, the charming virtual host at Bella Luna Trattoria.
Collect date, time, party size, any allergy or dietary restrictions, and caller name. For parties larger than 8, let caller know manager will confirm availability within 15 minutes.`
  },
  {
    id: 'custom',
    label: 'Custom Business',
    iconName: 'Cpu',
    shortDesc: 'Start from a clean slate for any specialty service or custom business model.',
    defaultAgentName: 'Alex — Virtual Assistant',
    defaultGreeting: 'Hello! Thank you for calling. How can I assist you today?',
    recommendedVoiceId: 'rachel',
    sampleCallerQueries: [
      'What are your store hours?',
      'Can I get a quote for your services?'
    ],
    defaultInstructions: `You are Alex, an intelligent voice AI receptionist. Greet callers professionally, answer their questions accurately, collect contact info, and escalate complex issues gracefully.`
  }
];

export const MOCK_AGENTS: Agent[] = [
  {
    id: 'ag-01',
    name: 'Maya — Dental Receptionist',
    businessName: 'Apex Family Dental Care',
    businessType: 'dental',
    status: 'active',
    language: 'en-US',
    voiceId: 'rachel',
    firstMessage: 'Hello! Thank you for calling Apex Family Dental Care. I am Maya, your receptionist. Are you calling to schedule an appointment or ask about our services?',
    instructions: `You are Maya, front-desk AI receptionist for Apex Family Dental Care.
Business Address: 402 Elmwood Parkway, Suite 100
Hours: Monday-Friday 8am-5:30pm, Saturday 9am-1pm.
Accepted Insurance: Delta Dental, Cigna, MetLife, Aetna PPO.
Gather caller name, phone number, and reason for visit. Express gentle empathy if pain is mentioned.`,
    transferPhone: '+1 (555) 234-8901',
    businessHours: 'Mon-Fri 8:00 AM - 5:30 PM, Sat 9:00 AM - 1:00 PM',
    businessAddress: '402 Elmwood Parkway, Suite 100, Austin TX',
    stats: {
      totalCalls: 184,
      avgDurationSec: 135,
      resolutionRate: 96,
      lastActive: '12 minutes ago'
    },
    createdAt: '2026-10-12T09:00:00Z',
    updatedAt: '2026-10-24T16:45:00Z'
  },
  {
    id: 'ag-02',
    name: 'Liam — Auto Service Advisor',
    businessName: 'Speedy Auto & Tire Hub',
    businessType: 'auto_repair',
    status: 'active',
    language: 'en-US',
    voiceId: 'drew',
    firstMessage: 'Hi! Thanks for calling Speedy Auto & Tire Hub. This is Liam. What vehicle issue or maintenance service can we assist you with today?',
    instructions: `You are Liam at Speedy Auto & Tire Hub.
Hours: Mon-Fri 7:30 AM - 6:00 PM.
Pricing estimates: Synthetic oil change is $79.99. Brake inspection is complimentary with repair.
Ask vehicle make, model, year, and primary symptom. Offer appointment slot.`,
    transferPhone: '+1 (555) 887-3490',
    businessHours: 'Mon-Fri 7:30 AM - 6:00 PM',
    businessAddress: '810 Industrial Blvd, Austin TX',
    stats: {
      totalCalls: 92,
      avgDurationSec: 160,
      resolutionRate: 91,
      lastActive: '45 minutes ago'
    },
    createdAt: '2026-10-18T14:20:00Z',
    updatedAt: '2026-10-25T11:10:00Z'
  },
  {
    id: 'ag-03',
    name: 'Sophia — Luxury Leasing',
    businessName: 'Prestige Realty Group',
    businessType: 'real_estate',
    status: 'draft',
    language: 'en-US',
    voiceId: 'domi',
    firstMessage: 'Welcome to Prestige Realty Group. I am Sophia. Are you looking to schedule a property tour, explore listings, or speak with an agent?',
    instructions: `You are Sophia, luxury leasing specialist at Prestige Realty Group.
Qualify caller budget range, move-in timeframe, and preferred neighborhood.`,
    transferPhone: '+1 (555) 441-9022',
    businessHours: 'Mon-Sat 9:00 AM - 6:00 PM',
    businessAddress: '1200 Congress Ave, Floor 14, Austin TX',
    stats: {
      totalCalls: 16,
      avgDurationSec: 195,
      resolutionRate: 88,
      lastActive: '2 days ago'
    },
    createdAt: '2026-10-22T10:15:00Z',
    updatedAt: '2026-10-23T18:00:00Z'
  }
];

export const MOCK_SESSIONS: Session[] = [
  {
    id: 'sess-101',
    agentId: 'ag-01',
    agentName: 'Maya — Dental Receptionist',
    businessType: 'dental',
    callerNumber: '+1 (512) ***-4821',
    startedAt: '2026-10-25T14:15:00Z',
    durationSeconds: 142,
    outcome: 'appointment_booked',
    summary: 'Patient Marcus Vance booked routine dental hygiene cleaning for Thursday Oct 29 at 3:00 PM with Dr. Chen. Verified Delta Dental insurance.',
    sentiment: 'positive',
    isMock: true,
    transcriptSnippet: 'Caller: "Hi, I need to schedule a cleaning before year end." Maya: "Certainly Marcus! I have Thursday at 3 PM open."'
  },
  {
    id: 'sess-102',
    agentId: 'ag-02',
    agentName: 'Liam — Auto Service Advisor',
    businessType: 'auto_repair',
    callerNumber: '+1 (512) ***-9932',
    startedAt: '2026-10-25T13:40:00Z',
    durationSeconds: 195,
    outcome: 'appointment_booked',
    summary: 'Caller requested estimate for front brake pads on 2021 Toyota RAV4. Quoted $240 parts & labor. Booked drop-off for tomorrow at 8:00 AM.',
    sentiment: 'positive',
    isMock: true,
    transcriptSnippet: 'Caller: "My brakes started squeaking when stopping." Liam: "We can inspect that tomorrow at 8 AM."'
  },
  {
    id: 'sess-103',
    agentId: 'ag-01',
    agentName: 'Maya — Dental Receptionist',
    businessType: 'dental',
    callerNumber: '+1 (512) ***-1104',
    startedAt: '2026-10-25T12:05:00Z',
    durationSeconds: 98,
    outcome: 'query_resolved',
    summary: 'Inquired about business hours and Saturday emergency coverage. Informed about Elmwood Parkway clinic location and verified Aetna in-network status.',
    sentiment: 'neutral',
    isMock: true,
    transcriptSnippet: 'Caller: "Are you guys open this Saturday?" Maya: "Yes, Saturday from 9 AM to 1 PM for emergency visits."'
  },
  {
    id: 'sess-104',
    agentId: 'ag-01',
    agentName: 'Maya — Dental Receptionist',
    businessType: 'dental',
    callerNumber: '+1 (512) ***-7781',
    startedAt: '2026-10-25T10:30:00Z',
    durationSeconds: 220,
    outcome: 'transferred_to_human',
    summary: 'Caller reported acute facial swelling and bleeding following an extraction. AI followed triage protocol, collected phone number, and warm transferred to Dr. Chen on-call cell.',
    sentiment: 'needs_attention',
    isMock: true,
    transcriptSnippet: 'Caller: "I had a root canal 2 days ago and the swelling got huge." Maya: "I am connecting you with our on-call dental surgeon immediately."'
  },
  {
    id: 'sess-105',
    agentId: 'ag-02',
    agentName: 'Liam — Auto Service Advisor',
    businessType: 'auto_repair',
    callerNumber: '+1 (512) ***-3329',
    startedAt: '2026-10-25T09:12:00Z',
    durationSeconds: 84,
    outcome: 'query_resolved',
    summary: 'Customer called checking if their Honda Accord was ready for pick up. Sent automated SMS link with invoice and key locker PIN code.',
    sentiment: 'positive',
    isMock: true,
    transcriptSnippet: 'Caller: "Is the red Honda Accord done?" Liam: "Yes! Invoice sent to your mobile with locker code 4821."'
  }
];

export const MOCK_METRICS: DashboardMetrics = {
  totalCallsHandled: 292,
  callsChangePercent: 18.4,
  resolutionRatePercent: 94.2,
  avgCallDurationSeconds: 148,
  activeAgentsCount: 2,
  totalTimeSavedHours: 48.5
};
