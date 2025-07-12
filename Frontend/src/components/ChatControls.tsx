import React from 'react';
import { RotateCcw, Download } from 'lucide-react';
import PersonaSelector from './PersonaSelector';
import MoodTracker from './MoodTracker';
import { PersonaType } from '../types/ApiTypes';
import { MoodData } from './MoodTracker';
import { Message } from '../types/Message';

interface ChatControlsProps {
  selectedPersona: PersonaType;
  onPersonaChange: (persona: PersonaType) => void;
  moodHistory: MoodData[];
  onClearChat: () => void;
  messageCount: number;
  messages: Message[];
}

const ChatControls: React.FC<ChatControlsProps> = ({
  selectedPersona,
  onPersonaChange,
  moodHistory,
  onClearChat,
  messageCount,
  messages
}) => {
  const handleExportChat = () => {
    if (messages.length === 0) return;

    // Create header for the chat export
    const exportHeader = [
      '='.repeat(60),
      'MENTAL HEALTH CHAT CONVERSATION',
      '='.repeat(60),
      `Export Date: ${new Date().toLocaleString()}`,
      `Total Messages: ${messages.length}`,
      `Session Duration: ${messages.length > 0 ? 
        `${messages[0].timestamp.toLocaleString()} - ${messages[messages.length - 1].timestamp.toLocaleString()}` : 
        'N/A'
      }`,
      `Chat Style: ${selectedPersona.charAt(0).toUpperCase() + selectedPersona.slice(1).replace('-', ' ')}`,
      '',
      'CONVERSATION:',
      '-'.repeat(60),
      ''
    ].join('\n');

    // Format each message
    const formattedMessages = messages.map(message => {
      const senderLabel = message.sender === 'user' ? 'You' : 'Assistant';
      const timestamp = message.timestamp.toLocaleString();
      const separator = message.sender === 'user' ? '>' : '<';
      
      return [
        `${separator} ${senderLabel} (${timestamp}):`,
        message.content,
        ''
      ].join('\n');
    }).join('\n');

    // Create footer with mood summary if available
    const moodSummary = moodHistory.length > 0 ? [
      '',
      '-'.repeat(60),
      'MOOD SUMMARY:',
      '-'.repeat(60),
      `Total mood interactions: ${moodHistory.length}`,
      `Recent mood: ${moodHistory[moodHistory.length - 1]?.sentiment || 'Unknown'}`,
      ''
    ].join('\n') : '';

    const exportFooter = [
      '',
      '-'.repeat(60),
      'END OF CONVERSATION',
      '',
      'Note: This conversation was exported from Mental Health Chat.',
      'For crisis support, call 988 (US) or contact your local emergency services.',
      '='.repeat(60)
    ].join('\n');

    // Combine all parts
    const fullExport = exportHeader + formattedMessages + moodSummary + exportFooter;
    
    // Create and download the file
    const dataBlob = new Blob([fullExport], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mental-health-chat-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm border-b border-gray-200/50 p-3 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Persona Selector */}
          <div>
            <PersonaSelector 
              selectedPersona={selectedPersona}
              onPersonaChange={onPersonaChange}
            />
          </div>
          
          {/* Mood Tracker */}
          <div>
            <MoodTracker moodHistory={moodHistory} />
          </div>
          
          {/* Chat Actions */}
          <div className="flex flex-col space-y-2 sm:col-span-2 lg:col-span-1">
            <div className="text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Chat Actions
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <button
                onClick={onClearChat}
                disabled={messageCount === 0}
                className="
                  flex-1 flex items-center justify-center space-x-1 sm:space-x-2 px-3 py-2
                  bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg
                  text-xs sm:text-sm text-gray-700 hover:bg-gray-50 
                  focus:outline-none focus:ring-2 focus:ring-blue-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors
                "
              >
                <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Clear</span>
              </button>
              
              <button
                onClick={handleExportChat}
                disabled={messageCount === 0}
                className="
                  flex-1 flex items-center justify-center space-x-1 sm:space-x-2 px-3 py-2
                  bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg
                  text-xs sm:text-sm text-gray-700 hover:bg-gray-50
                  focus:outline-none focus:ring-2 focus:ring-blue-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors
                "
              >
                <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Export</span>
              </button>
            </div>
            
            {messageCount > 0 && (
              <p className="text-xs text-gray-500 text-center mt-1">
                {messageCount} messages in this session
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatControls;