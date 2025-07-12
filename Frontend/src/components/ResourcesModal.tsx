import React from 'react';
import { X, Phone, Globe, MessageSquare, Heart, AlertTriangle, ExternalLink } from 'lucide-react';

interface ResourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const emergencyResources = [
  {
    name: 'Tele-MANAS (India)',
    number: '14416',
    description: '24/7 mental health support in 20+ Indian languages',
    icon: Phone,
    urgent: true
  },
  {
    name: 'Vandrevala Foundation (India)',
    number: '9999 666 555',
    description: '24/7 mental health support across India',
    icon: Phone,
    urgent: true
  },
  {
    name: 'AASRA Suicide Prevention (India)',
    number: '91-9820466726',
    description: '24/7 suicide prevention and emotional support',
    icon: Phone,
    urgent: true
  },
  {
    name: 'Find a Helpline (International)',
    number: 'findahelpline.com',
    description: 'Find local helplines in 130+ countries worldwide',
    icon: MessageSquare,
    urgent: true
  },
  {
    name: 'Local Emergency Services',
    number: '112 (India) / Your local emergency number',
    description: 'For immediate life-threatening emergencies',
    icon: AlertTriangle,
    urgent: true
  }
];

const supportResources = [
  {
    name: 'National Institute of Mental Health (India)',
    url: 'https://nimhans.ac.in',
    description: 'Premier mental health institute with resources and guidance',
    icon: Heart
  },
  {
    name: 'Befrienders Worldwide',
    url: 'https://befrienders.org',
    description: 'International network of emotional support centers',
    icon: Globe
  },
  {
    name: 'World Health Organization Mental Health',
    url: 'https://who.int/health-topics/mental-disorders',
    description: 'Global mental health resources and information',
    icon: Globe
  },
  {
    name: 'Mental Health Foundation',
    url: 'https://mentalhealth.org.uk',
    description: 'Mental health information and support resources',
    icon: Globe
  }
];

const ResourcesModal: React.FC<ResourcesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mental Health Resources</h2>
            <p className="text-gray-600 mt-1">Professional help and support when you need it most</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Emergency Resources */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h3 className="text-xl font-bold text-gray-900">Crisis Support</h3>
            </div>
            <p className="text-gray-600 mb-4">
              If you're in crisis or having thoughts of self-harm, please reach out immediately:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {emergencyResources.map((resource, index) => {
                const IconComponent = resource.icon;
                return (
                  <div
                    key={index}
                    className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center"
                  >
                    <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-3">
                      <IconComponent className="h-6 w-6 text-red-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{resource.name}</h4>
                    <a 
                      href={`tel:${resource.number.replace(/\s/g, '').replace(/[()]/g, '')}`}
                      className="
                        inline-block text-lg font-bold text-red-600 mb-2 
                        hover:text-red-700 hover:underline transition-colors
                        focus:outline-none focus:ring-2 focus:ring-red-200 rounded
                        cursor-pointer
                      "
                      title={`Call ${resource.name}`}
                    >
                      {resource.number}
                    </a>
                    <p className="text-sm text-gray-600">{resource.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Support Resources */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-blue-500" />
              <h3 className="text-xl font-bold text-gray-900">Professional Support & Resources</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Find professional help, support groups, and educational resources:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supportResources.map((resource, index) => {
                const IconComponent = resource.icon;
                return (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      bg-blue-50 border border-blue-200 rounded-xl p-4 
                      hover:bg-blue-100 transition-colors group
                      focus:outline-none focus:ring-2 focus:ring-blue-200
                    "
                  >
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900">{resource.name}</h4>
                          <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Important Notes</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-yellow-600 mt-1">•</span>
                <span>This AI chat is not a replacement for professional mental health care</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-yellow-600 mt-1">•</span>
                <span>If you're experiencing a mental health emergency, please contact emergency services immediately</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-yellow-600 mt-1">•</span>
                <span>Consider speaking with a licensed mental health professional for ongoing support</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-yellow-600 mt-1">•</span>
                <span>Your conversations in this app are private and not monitored by professionals</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-yellow-600 mt-1">•</span>
                <span>Phone numbers above are clickable - tap to call on mobile devices</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesModal;