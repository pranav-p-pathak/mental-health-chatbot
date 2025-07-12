import React from 'react';
import { Message } from '../types/Message';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isBot = message.sender === 'bot';
  
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-3 sm:mb-4 animate-fade-in`}>
      <div className={`max-w-[85%] sm:max-w-xs md:max-w-md lg:max-w-lg ${isBot ? 'order-1' : 'order-2'}`}>
        <div
          className={`
            px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl shadow-sm
            ${isBot 
              ? 'bg-gradient-to-br from-gray-100 to-gray-50 text-gray-800 rounded-bl-md' 
              : 'bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-br-md'
            }
          `}
        >
          <p className="text-sm sm:text-base leading-relaxed break-words">{message.content}</p>
        </div>
        <div className={`mt-1 text-xs text-gray-500 px-1 ${isBot ? 'text-left' : 'text-right'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;