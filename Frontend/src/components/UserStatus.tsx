import React from 'react';
import { User, Shield, Clock, Database, LogOut, Mail } from 'lucide-react';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

const UserStatus: React.FC = () => {
  const { user, isAnonymous, session, isConfigured, signOut } = useSupabaseAuth();

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out? Your conversation history will be lost if you\'re using an anonymous session.')) {
      await signOut();
      window.location.reload();
    }
  };

  if (!isConfigured) {
    return (
      <div className="flex items-center space-x-2 text-xs text-gray-500">
        <Database className="h-3 w-3" />
        <span>Local mode</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-2 text-xs text-gray-500">
        <User className="h-3 w-3" />
        <span>Not connected</span>
      </div>
    );
  }

  const sessionAge = session?.created_at 
    ? Math.floor((Date.now() - new Date(session.created_at).getTime()) / (1000 * 60))
    : 0;

  return (
    <div className="flex items-center space-x-3 text-xs group">
      <div className="flex items-center space-x-1 text-green-600">
        {isAnonymous ? (
          <>
            <Shield className="h-3 w-3" />
            <span>Anonymous Session</span>
          </>
        ) : (
          <>
            <Mail className="h-3 w-3" />
            <span>Signed In</span>
          </>
        )}
      </div>
      
      {sessionAge > 0 && (
        <div className="flex items-center space-x-1 text-gray-500">
          <Clock className="h-3 w-3" />
          <span>{sessionAge}m active</span>
        </div>
      )}
      
      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Connected" />
      
      <button
        onClick={handleSignOut}
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-red-500 p-1"
        title="Sign out"
      >
        <LogOut className="h-3 w-3" />
      </button>
    </div>
  );
};

export default UserStatus;