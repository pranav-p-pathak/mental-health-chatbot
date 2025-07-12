import React, { useState } from 'react';
import { Send, Lightbulb } from 'lucide-react';

interface InputSectionProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  showSuggestions?: boolean;
}

const suggestionPrompts = [
  "I'm feeling anxious about...",
  "I need help coping with...",
  "I'm struggling with...",
  "I want to talk about...",
  "I'm feeling overwhelmed by...",
  "I need support with..."
];

const InputSection: React.FC<InputSectionProps> = ({ 
  onSendMessage, 
  disabled = false, 
  showSuggestions = false 
}) => {
  const [message, setMessage] = useState('');
  const [showPrompts, setShowPrompts] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    setShowPrompts(false);
    // Focus the textarea
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 p-3 sm:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Suggestion Prompts */}
        {showSuggestions && showPrompts && (
          <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center space-x-2 mb-2 sm:mb-3">
              <Lightbulb className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <span className="text-sm font-medium text-blue-800">Conversation starters</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {suggestionPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(prompt)}
                  className="
                    text-left p-2.5 sm:p-3 text-xs sm:text-sm text-blue-700 hover:bg-blue-100 
                    rounded-lg transition-colors
                  "
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex space-x-2 sm:space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => showSuggestions && setShowPrompts(true)}
              placeholder="Share what's on your mind..."
              disabled={disabled}
              className="
                w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl border border-gray-300 
                focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm sm:text-base
                focus:outline-none resize-none transition-colors
                bg-white/70 backdrop-blur-sm
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              rows={1}
              style={{
                minHeight: '48px',
                maxHeight: '100px',
              }}
            />
          </div>
          
          {showSuggestions && (
            <button
              type="button"
              onClick={() => setShowPrompts(!showPrompts)}
              className="
                bg-white/80 backdrop-blur-sm border border-gray-300 p-2.5 sm:p-3 rounded-2xl
                text-gray-600 hover:text-gray-800 hover:bg-gray-50
                focus:outline-none focus:ring-2 focus:ring-blue-200
                transition-colors
              "
              aria-label="Show conversation starters"
            >
              <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          )}
          
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="
              bg-gradient-to-r from-blue-500 to-purple-500 
              text-white p-2.5 sm:p-3 rounded-2xl shadow-lg
              hover:from-blue-600 hover:to-purple-600 
              focus:outline-none focus:ring-2 focus:ring-blue-200
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 transform hover:scale-105
              active:scale-95
            "
            aria-label="Send message"
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputSection;