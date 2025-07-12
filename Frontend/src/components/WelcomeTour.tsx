import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, MessageCircle, Heart, TrendingUp, Download } from 'lucide-react';

interface WelcomeTourProps {
  isOpen: boolean;
  onClose: () => void;
}

const tourSteps = [
  {
    id: 1,
    title: 'Welcome to Your Safe Space',
    description: 'Mental Health Chat provides supportive, empathetic conversations with automatic anonymous sessions for your privacy.',
    icon: Heart,
    highlight: 'Your anonymous session is automatically created - no signup required. Your conversations are private and secure.',
  },
  {
    id: 2,
    title: 'Choose Your Chat Style',
    description: 'Select from different AI personas to match your preferred conversation style and support needs.',
    icon: MessageCircle,
    highlight: 'Try different personas like "Supportive Friend" or "Calm Therapist" to find what works best for you.',
  },
  {
    id: 3,
    title: 'Track Your Mood',
    description: 'Our AI automatically tracks sentiment patterns to help you understand your emotional journey over time.',
    icon: TrendingUp,
    highlight: 'Your mood data is private and helps provide more personalized support.',
  },
  {
    id: 4,
    title: 'Your Data is Saved Securely',
    description: 'Your conversations and preferences are automatically saved to your anonymous session and can be exported anytime.',
    icon: Download,
    highlight: 'Everything is tied to your anonymous session - no personal information required, but your progress is preserved.',
  }
];

const conversationStarters = [
  "I'm feeling overwhelmed with work lately...",
  "I've been having trouble sleeping and it's affecting my mood",
  "I want to talk about my anxiety around social situations",
  "I'm going through a difficult time and need someone to listen",
  "I'd like to explore some coping strategies for stress",
  "I'm feeling lonely and could use some support"
];

const WelcomeTour: React.FC<WelcomeTourProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showStarters, setShowStarters] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowStarters(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStarterClick = (starter: string) => {
    // This would populate the input field with the starter text
    console.log('Selected starter:', starter);
    onClose();
  };

  const currentTourStep = tourSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        {!showStarters ? (
          <>
            {/* Tour Steps */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500">
                    Step {currentStep + 1} of {tourSteps.length}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close tour"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                />
              </div>

              {/* Step Content */}
              <div className="text-center mb-8">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <currentTourStep.icon className="h-10 w-10 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentTourStep.title}</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">{currentTourStep.description}</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 font-medium">{currentTourStep.highlight}</p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="
                    flex items-center space-x-2 px-4 py-2 text-gray-600 
                    hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors
                  "
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={onClose}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Skip tour
                </button>

                <button
                  onClick={handleNext}
                  className="
                    flex items-center space-x-2 px-6 py-2 
                    bg-gradient-to-r from-blue-500 to-purple-500 text-white 
                    rounded-lg hover:from-blue-600 hover:to-purple-600 
                    transition-all duration-200
                  "
                >
                  <span>{currentStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Conversation Starters */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Start Your First Conversation</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                Not sure how to begin? Here are some conversation starters to help you get started:
              </p>

              <div className="space-y-3 mb-8">
                {conversationStarters.map((starter, index) => (
                  <button
                    key={index}
                    onClick={() => handleStarterClick(starter)}
                    className="
                      w-full text-left p-4 rounded-lg border border-gray-200 
                      hover:border-blue-300 hover:bg-blue-50 transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-blue-200
                    "
                  >
                    <span className="text-gray-700">"{starter}"</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowStarters(false)}
                  className="
                    flex items-center space-x-2 px-4 py-2 text-gray-600 
                    hover:text-gray-800 transition-colors
                  "
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to tour</span>
                </button>

                <button
                  onClick={onClose}
                  className="
                    px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 
                    text-white rounded-lg hover:from-blue-600 hover:to-purple-600 
                    transition-all duration-200
                  "
                >
                  Start chatting
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WelcomeTour;