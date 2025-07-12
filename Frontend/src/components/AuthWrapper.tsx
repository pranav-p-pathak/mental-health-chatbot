import React, { useEffect, useState } from 'react';
import { Heart, Loader2, Shield, MessageCircle, Settings } from 'lucide-react';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import AuthPage from './AuthPage';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { user, loading, signInAnonymously, isConfigured, signOut } = useSupabaseAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showAuthPage, setShowAuthPage] = useState(false);
  const [skipAuth, setSkipAuth] = useState(false);

  // Check if user wants to skip auth or show auth page
  useEffect(() => {
    if (!isConfigured || skipAuth) {
      return;
    }

    // Show auth page if no user and not loading
    if (!user && !loading && !showAuthPage) {
      setShowAuthPage(true);
    }
  }, [user, loading, isConfigured, skipAuth, showAuthPage]);

  // Handle skip auth
  const handleSkipAuth = () => {
    setSkipAuth(true);
    setShowAuthPage(false);
  };

  // Show auth page
  if (showAuthPage && !user && !skipAuth && isConfigured) {
    return <AuthPage onSkip={handleSkipAuth} />;
  }

  // Show loading screen while authenticating
  if ((loading || isSigningIn) && isConfigured && !skipAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center space-y-6 p-8">
          <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
            <Heart className="h-10 w-10 text-white" />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-gray-800">Mental Health Chat</h1>
            <p className="text-gray-600">Setting up your secure, anonymous session...</p>
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            <span className="text-sm text-gray-500">Creating anonymous session</span>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm font-medium text-blue-800 mb-1">Your Privacy Matters</p>
                <p className="text-xs text-blue-700">
                  We're creating an anonymous session that doesn't require any personal information. 
                  Your conversations will be private and secure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if authentication failed but allow app usage
  if (authError && isConfigured && !skipAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="text-center space-y-4">
              <div className="bg-yellow-100 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Shield className="h-8 w-8 text-yellow-600" />
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Authentication Notice</h2>
                <p className="text-sm text-gray-600 mb-4">{authError}</p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <MessageCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-800">
                      You can continue to use the chat normally. Your conversations will work but won't be saved between sessions.
                    </p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setAuthError(null)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
              >
                Continue to Chat
              </button>
              
              <button
                onClick={() => setShowAuthPage(true)}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Try Different Sign-in</span>
              </button>
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  }

  // Render the main app
  return <>{children}</>;
};

export default AuthWrapper;