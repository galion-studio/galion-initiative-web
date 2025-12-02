'use client';

/**
 * Cookie consent utilities
 * Manages cookie preferences and checks consent status
 */

const COOKIE_CONSENT_KEY = 'galion_cookie_consent';
const COOKIE_PREFERENCES_KEY = 'galion_cookie_preferences';

export type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  functional: boolean;
};

/**
 * Get saved cookie preferences from localStorage
 */
export function getCookiePreferences(): CookiePreferences | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const saved = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    if (!saved) return null;
    return JSON.parse(saved) as CookiePreferences;
  } catch (e) {
    return null;
  }
}

/**
 * Check if user has given consent
 */
export function hasCookieConsent(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(COOKIE_CONSENT_KEY) === 'true';
}

/**
 * Check if analytics cookies are enabled
 */
export function isAnalyticsEnabled(): boolean {
  const preferences = getCookiePreferences();
  return preferences?.analytics === true;
}

/**
 * Check if functional cookies are enabled
 */
export function isFunctionalEnabled(): boolean {
  const preferences = getCookiePreferences();
  return preferences?.functional === true;
}

