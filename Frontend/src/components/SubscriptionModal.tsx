import React from 'react';
import { X, Check, Star, Zap, Crown, Shield } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    icon: Shield,
    features: [
      'Basic chat support',
      '3 persona modes',
      'Basic mood tracking',
      'Export conversations (TXT)',
      'Community support'
    ],
    limitations: [
      'Limited to 50 messages/day',
      'Basic export only'
    ],
    buttonText: 'Current Plan',
    buttonStyle: 'bg-gray-100 text-gray-600 cursor-not-allowed',
    popular: false
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$9.99',
    period: 'month',
    description: 'Enhanced support for daily wellness',
    icon: Star,
    features: [
      'Unlimited conversations',
      '8+ specialized personas',
      'Advanced mood analytics',
      'Multiple export formats (TXT, PDF)',
      'Priority response times',
      'Conversation history (30 days)',
      'Personalized insights'
    ],
    limitations: [],
    buttonText: 'Upgrade to Premium',
    buttonStyle: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600',
    popular: true
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19.99',
    period: 'month',
    description: 'Complete mental wellness toolkit',
    icon: Crown,
    features: [
      'Everything in Premium',
      '15+ expert personas',
      'Advanced mood trends & predictions',
      'Custom persona creation',
      'Unlimited conversation history',
      'Weekly wellness reports',
      'Integration with health apps',
      'Priority customer support',
      'Early access to new features'
    ],
    limitations: [],
    buttonText: 'Upgrade to Pro',
    buttonStyle: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700',
    popular: false
  }
];

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleSubscribe = (planId: string) => {
    // This would integrate with your payment processor
    console.log(`Subscribing to ${planId} plan`);
    // For now, just close the modal
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
            <p className="text-gray-600 mt-1">Unlock premium features for better mental wellness support</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Plans Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const IconComponent = plan.icon;
              return (
                <div
                  key={plan.id}
                  className={`
                    relative rounded-xl border-2 p-6 transition-all duration-200
                    ${plan.popular 
                      ? 'border-blue-500 shadow-lg scale-105 bg-gradient-to-br from-blue-50 to-purple-50' 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                    }
                  `}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={`inline-flex p-3 rounded-full mb-4 ${
                      plan.popular ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`h-8 w-8 ${
                        plan.popular ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{plan.description}</p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      {plan.period !== 'forever' && (
                        <span className="text-gray-600">/{plan.period}</span>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-start space-x-3 opacity-60">
                        <X className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-500">{limitation}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={plan.id === 'free'}
                    className={`
                      w-full py-3 px-4 rounded-xl font-medium transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-blue-200
                      ${plan.buttonStyle}
                    `}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Trust Signals */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Why Choose Premium?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <span>100% Private & Secure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-purple-500" />
                  <span>AI-Powered Insights</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>Cancel Anytime</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 max-w-2xl mx-auto">
                Join thousands of users who have improved their mental wellness with our premium features. 
                30-day money-back guarantee. No commitment required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;