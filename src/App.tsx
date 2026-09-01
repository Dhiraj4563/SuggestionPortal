import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { SuggestionProvider, useSuggestions } from './context/SuggestionContext';
import { Header } from './components/Header';
import { SubmitSuggestionView } from './components/SubmitSuggestionView';
import { TrackStatusView } from './components/TrackStatusView';
import { PublicCommunityView } from './components/PublicCommunityView';
import { AdminPortalView } from './components/AdminPortalView';
import { HelpView } from './components/HelpView';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { currentView } = useSuggestions();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-700 selection:text-white">
      <Header />

      <main className="flex-1">
        {currentView === 'submit' && <SubmitSuggestionView />}
        {currentView === 'track' && <TrackStatusView />}
        {currentView === 'community' && <PublicCommunityView />}
        {currentView === 'admin' && <AdminPortalView />}
        {currentView === 'help' && <HelpView />}
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <SuggestionProvider>
        <AppContent />
      </SuggestionProvider>
    </LanguageProvider>
  );
}
