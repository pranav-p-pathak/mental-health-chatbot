import React from 'react';
import { ChevronDown, Heart, Zap, Brain, MessageCircle } from 'lucide-react';
import { PersonaType, PersonaOption } from '../types/ApiTypes';

interface PersonaSelectorProps {
  selectedPersona: PersonaType;
  onPersonaChange: (persona: PersonaType) => void;
}

const personaOptions: PersonaOption[] = [
  {
    value: 'default',
    label: 'Default',
    description: 'Balanced and empathetic support',
    icon: 'MessageCircle'
  },
  {
    value: 'supportive-friend',
    label: 'Supportive Friend',
    description: 'Warm, understanding, and caring',
    icon: 'Heart'
  },
  {
    value: 'motivational-coach',
    label: 'Motivational Coach',
    description: 'Encouraging and goal-oriented',
    icon: 'Zap'
  },
  {
    value: 'calm-therapist',
    label: 'Calm Therapist',
    description: 'Professional and mindful guidance',
    icon: 'Brain'
  }
];

const getIcon = (iconName: string) => {
  const icons = {
    MessageCircle,
    Heart,
    Zap,
    Brain
  };
  const IconComponent = icons[iconName as keyof typeof icons];
  return IconComponent ? <IconComponent className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />;
};

const PersonaSelector: React.FC<PersonaSelectorProps> = ({ selectedPersona, onPersonaChange }) => {
  const selectedOption = personaOptions.find(option => option.value === selectedPersona) || personaOptions[0];

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Chat Style
      </label>
      <div className="relative">
        <select
          value={selectedPersona}
          onChange={(e) => onPersonaChange(e.target.value as PersonaType)}
          className="
            w-full appearance-none bg-white/80 backdrop-blur-sm border border-gray-300 
            rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 pr-8 sm:pr-10 text-xs sm:text-sm
            focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
            transition-colors cursor-pointer
          "
        >
          {personaOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
          <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
        </div>
      </div>
      
      {/* Selected persona description */}
      <div className="mt-1.5 sm:mt-2 flex items-start space-x-2 text-xs text-gray-600">
        <div className="text-blue-500">
          {getIcon(selectedOption.icon)}
        </div>
        <span className="leading-relaxed">{selectedOption.description}</span>
      </div>
    </div>
  );
};

export default PersonaSelector;