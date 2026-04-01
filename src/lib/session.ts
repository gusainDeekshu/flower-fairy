// src/lib/session.ts

export const getGuestSessionId = (): string => {
  if (typeof window === 'undefined') return ''; // Handle SSR

  const SESSION_KEY = 'ae_guest_session_id';
  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    // Generate a secure UUID for the guest session
    sessionId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
};