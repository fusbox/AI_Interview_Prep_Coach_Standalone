import { useState } from 'react';

const GUEST_COMPLETED_SESSION_KEY = 'ai_coach_guest_completed';

export const useGuestTracker = () => {
  const [hasCompletedSession, setHasCompletedSession] = useState<boolean>(() => {
    return !!localStorage.getItem(GUEST_COMPLETED_SESSION_KEY);
  });

  const markSessionComplete = () => {
    localStorage.setItem(GUEST_COMPLETED_SESSION_KEY, 'true');
    setHasCompletedSession(true);
  };

  const clearGuestHistory = () => {
    localStorage.removeItem(GUEST_COMPLETED_SESSION_KEY);
    setHasCompletedSession(false);
  };

  return {
    hasCompletedSession,
    markSessionComplete,
    clearGuestHistory,
  };
};
