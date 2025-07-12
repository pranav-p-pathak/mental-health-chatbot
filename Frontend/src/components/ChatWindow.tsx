import React, { useEffect, useRef } from 'react';
import { Message } from '../types/Message';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

interface ChatWindowProps {
  messages: Message[];
  isTyping: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isTyping }) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-6 sm:mt-8 px-4">
            <p className="text-base sm:text-lg mb-2">Welcome to your safe space</p>
            <p className="text-sm leading-relaxed">Start by sharing what's on your mind. I'm here to listen and support you.</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        
        {isTyping && <TypingIndicator />}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;