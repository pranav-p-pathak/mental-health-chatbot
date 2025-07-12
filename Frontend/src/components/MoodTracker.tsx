import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';

type SentimentType = 
  | 'positive' | 'negative' | 'neutral' | 'crisis'
  | 'anxious' | 'angry' | 'sad' | 'happy'
  | 'stressed' | 'overwhelmed' | 'confused' | 'calm'
  | 'hopeful' | 'frustrated' | 'lonely' | 'depressed'
  | 'excited' | 'scared' | 'grateful' | 'insecure' | 'ashamed';

export interface MoodData {
  sentiment: SentimentType;
  timestamp: Date;
  message: string;
}

interface MoodTrackerProps {
  moodHistory: MoodData[];
  className?: string;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ moodHistory, className = '' }) => {
  // Return null if no mood history or empty array
  if (!moodHistory || moodHistory.length === 0) {
    return null;
  }

  // Constants
  const MAX_HISTORY_ITEMS = 5;
  const recentMoods = moodHistory.slice(-MAX_HISTORY_ITEMS);
  const currentMood = recentMoods[recentMoods.length - 1];

  // Mood configuration
  const moodConfig: Record<string, { 
    icon: React.ReactNode;
    colorClass: string;
    label: string;
  }> = {
    positive: { icon: <TrendingUp className="h-4 w-4 text-green-500" />, colorClass: 'bg-green-100 border-green-200', label: 'Positive' },
    happy: { icon: <TrendingUp className="h-4 w-4 text-green-500" />, colorClass: 'bg-green-100 border-green-200', label: 'Happy' },
    excited: { icon: <TrendingUp className="h-4 w-4 text-green-500" />, colorClass: 'bg-green-100 border-green-200', label: 'Excited' },
    grateful: { icon: <TrendingUp className="h-4 w-4 text-green-500" />, colorClass: 'bg-green-100 border-green-200', label: 'Grateful' },
    hopeful: { icon: <TrendingUp className="h-4 w-4 text-green-500" />, colorClass: 'bg-green-100 border-green-200', label: 'Hopeful' },
    negative: { icon: <TrendingDown className="h-4 w-4 text-red-500" />, colorClass: 'bg-red-100 border-red-200', label: 'Negative' },
    sad: { icon: <TrendingDown className="h-4 w-4 text-red-500" />, colorClass: 'bg-red-100 border-red-200', label: 'Sad' },
    angry: { icon: <TrendingDown className="h-4 w-4 text-red-500" />, colorClass: 'bg-red-100 border-red-200', label: 'Angry' },
    frustrated: { icon: <TrendingDown className="h-4 w-4 text-red-500" />, colorClass: 'bg-red-100 border-red-200', label: 'Frustrated' },
    lonely: { icon: <TrendingDown className="h-4 w-4 text-red-500" />, colorClass: 'bg-red-100 border-red-200', label: 'Lonely' },
    depressed: { icon: <TrendingDown className="h-4 w-4 text-red-500" />, colorClass: 'bg-red-100 border-red-200', label: 'Depressed' },
    insecure: { icon: <TrendingDown className="h-4 w-4 text-red-500" />, colorClass: 'bg-red-100 border-red-200', label: 'Insecure' },
    ashamed: { icon: <TrendingDown className="h-4 w-4 text-red-500" />, colorClass: 'bg-red-100 border-red-200', label: 'Ashamed' },
    scared: { icon: <TrendingDown className="h-4 w-4 text-red-500" />, colorClass: 'bg-red-100 border-red-200', label: 'Scared' },
    stressed: { icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />, colorClass: 'bg-yellow-100 border-yellow-200', label: 'Stressed' },
    overwhelmed: { icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />, colorClass: 'bg-yellow-100 border-yellow-200', label: 'Overwhelmed' },
    anxious: { icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />, colorClass: 'bg-yellow-100 border-yellow-200', label: 'Anxious' },
    confused: { icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />, colorClass: 'bg-yellow-100 border-yellow-200', label: 'Confused' },
    crisis: { icon: <AlertTriangle className="h-4 w-4 text-red-600" />, colorClass: 'bg-red-200 border-red-300', label: 'Crisis' },
    calm: { icon: <Minus className="h-4 w-4 text-blue-400" />, colorClass: 'bg-blue-100 border-blue-200', label: 'Calm' },
    neutral: { icon: <Minus className="h-4 w-4 text-gray-500" />, colorClass: 'bg-gray-100 border-gray-200', label: 'Neutral' },
    default: { icon: <Minus className="h-4 w-4 text-gray-500" />, colorClass: 'bg-gray-100 border-gray-200', label: 'Unknown' }
  };

  // Get mood configuration
  const getMoodConfig = (sentiment: SentimentType) => {
    return moodConfig[sentiment] || moodConfig.default;
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div 
      className={`bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-gray-200/50 shadow-sm ${className}`}
      aria-label="Mood tracker"
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h3 className="text-sm font-medium text-gray-700">Current Mood</h3>
        <div className="flex items-center space-x-1 flex-shrink-0">
          {getMoodConfig(currentMood.sentiment).icon}
          <span className="text-xs sm:text-sm text-gray-600">
            {getMoodConfig(currentMood.sentiment).label}
          </span>
        </div>
      </div>
      
      {/* Mood history visualization */}
      <div className="flex space-x-1.5 sm:space-x-2" aria-label="Recent mood history">
        {recentMoods.map((mood, index) => {
          const config = getMoodConfig(mood.sentiment);
          return (
            <div
              key={`${index}-${mood.timestamp.getTime()}`}
              className={`
                flex-1 h-1.5 sm:h-2 rounded-full border
                ${config.colorClass}
                transition-all duration-200
              `}
              aria-label={`${config.label} at ${formatTime(mood.timestamp)}`}
              data-tooltip={`${config.label} - ${formatTime(mood.timestamp)}`}
            />
          );
        })}
      </div>
      
      <p className="text-xs text-gray-500 mt-1.5 sm:mt-2">
        Recent mood pattern • {recentMoods.length} interactions
      </p>
    </div>
  );
};

export default MoodTracker;