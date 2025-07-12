import React from 'react';
import { useState, useEffect } from 'react';
import AuthWrapper from './components/AuthWrapper';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import InputSection from './components/InputSection';
import ChatControls from './components/ChatControls';
import SubscriptionModal from './components/SubscriptionModal';
import WelcomeTour from './components/WelcomeTour';
import ResourcesModal from './components/ResourcesModal';
import { useChat } from './hooks/useChat';

function App() {
  const { 
    messages, 
    isTyping, 
    selectedPersona, 
    moodHistory,
    sendMessage, 
    setSelectedPersona,
    clearChat
  } = useChat();

  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showWelcomeTour, setShowWelcomeTour] = useState(false);
  const [showResourcesModal, setShowResourcesModal] = useState(false);

  // Check if user is new (first visit)
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    if (!hasVisited) {
      setShowWelcomeTour(true);
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
        <Header 
          onUpgradeClick={() => setShowSubscriptionModal(true)}
          onResourcesClick={() => setShowResourcesModal(true)}
        />
        
        {/* Chat Controls */}
        <ChatControls 
          selectedPersona={selectedPersona}
          onPersonaChange={setSelectedPersona}
          moodHistory={moodHistory}
          onClearChat={clearChat}
          messageCount={messages.length}
          messages={messages}
        />
        
        <main className="flex-1 flex flex-col min-h-0">
          <ChatWindow messages={messages} isTyping={isTyping} />
          <InputSection 
            onSendMessage={sendMessage} 
            disabled={isTyping}
            showSuggestions={messages.length === 0}
          />
        </main>
        
        <footer className="bg-white/60 backdrop-blur-sm border-t border-gray-200/50 py-3">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 text-center space-y-2">
            <p className="text-xs text-gray-600">
              This is a supportive space. For crisis support, call 988 (US) or contact your local emergency services.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs text-gray-500">
              <span>🔒 Your conversations are private and anonymous</span>
              <span className="hidden sm:inline">•</span>
              <span>💝 Conversations saved securely</span>
              <span className="hidden sm:inline">•</span>
              <span>🌟 AI-powered emotional support</span>
            </div>
          </div>
        </footer>
        
        {/* Modals */}
        <SubscriptionModal 
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
        />
        
        <WelcomeTour 
          isOpen={showWelcomeTour}
          onClose={() => setShowWelcomeTour(false)}
        />
        
        <ResourcesModal 
          isOpen={showResourcesModal}
          onClose={() => setShowResourcesModal(false)}
        />
      </div>
    </AuthWrapper>
  );
}

export default App;