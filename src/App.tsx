import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConversationProvider } from '@elevenlabs/react';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { AgentBuilderPage } from './pages/AgentBuilderPage';
import { VoiceTestingPage } from './pages/VoiceTestingPage';
import { SessionHistoryPage } from './pages/SessionHistoryPage';

export const App: React.FC = () => {
  return (
    <ConversationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="builder" element={<AgentBuilderPage />} />
            <Route path="test" element={<VoiceTestingPage />} />
            <Route path="sessions" element={<SessionHistoryPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConversationProvider>
  );
};

export default App;
