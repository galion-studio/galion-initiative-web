'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Cookie, Settings, X, Check } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import Link from 'next/link';

type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  functional: boolean;
};

const COOKIE_CONSENT_KEY = 'galion_cookie_consent';
const COOKIE_PREFERENCES_KEY = 'galion_cookie_preferences';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    functional: false,
  });

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);

    if (!consent) {
      setShowBanner(true);
    } else if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (e) {
        // Invalid preferences, show banner again
        setShowBanner(true);
      }
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
    setShowBanner(false);
    setShowSettings(false);
    
    // Dispatch custom event to notify other components (like AnalyticsScript)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cookieConsentChanged'));
    }
    
    trackEvent('cookie_consent_saved', { preferences: prefs });
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      functional: true,
    };
    savePreferences(allAccepted);
    trackEvent('cookie_consent_accepted', { type: 'all' });
  };

  const acceptNecessary = () => {
    const necessaryOnly: CookiePreferences = {
      necessary: true,
      analytics: false,
      functional: false,
    };
    savePreferences(necessaryOnly);
    trackEvent('cookie_consent_accepted', { type: 'necessary_only' });
  };

  const saveCustomPreferences = () => {
    savePreferences(preferences);
    trackEvent('cookie_consent_saved', { type: 'custom' });
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Cannot disable necessary cookies
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 md:p-6"
          >
            <div className="container mx-auto max-w-6xl">
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg sm:rounded-xl shadow-2xl p-3 sm:p-4 md:p-6 backdrop-blur-xl">
                {/* Mobile: Close button at top right */}
                <div className="flex items-start justify-between gap-3 mb-3 sm:hidden">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                      <Cookie className="w-5 h-5 text-primary-400" />
                    </div>
                  </div>
                  <button
                    onClick={acceptNecessary}
                    className="flex-shrink-0 text-neutral-500 hover:text-white transition-colors p-1.5 touch-manipulation"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Desktop: Full layout */}
                <div className="hidden sm:flex sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                      <Cookie className="w-6 h-6 text-primary-400" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                      Cookie Consent
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-3 sm:mb-4">
                      We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies. You can customize your preferences or learn more in our{' '}
                      <Link href="/privacy" className="text-primary-400 hover:text-primary-300 underline break-words">
                        Privacy Policy
                      </Link>.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <Button
                        onClick={acceptAll}
                        className="bg-primary-600 hover:bg-primary-500 text-white text-xs sm:text-sm px-3 sm:px-4 py-2.5 sm:py-2 h-auto w-full sm:w-auto touch-manipulation min-h-[44px] sm:min-h-0"
                      >
                        Accept All
                      </Button>
                      <Button
                        onClick={acceptNecessary}
                        variant="outline"
                        className="border-neutral-700 bg-neutral-800/50 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs sm:text-sm px-3 sm:px-4 py-2.5 sm:py-2 h-auto w-full sm:w-auto touch-manipulation min-h-[44px] sm:min-h-0"
                      >
                        Necessary Only
                      </Button>
                      <Button
                        onClick={() => setShowSettings(true)}
                        variant="ghost"
                        className="text-neutral-400 hover:text-white text-xs sm:text-sm px-3 sm:px-4 py-2.5 sm:py-2 h-auto w-full sm:w-auto touch-manipulation min-h-[44px] sm:min-h-0"
                      >
                        <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        Customize
                      </Button>
                    </div>
                  </div>
                  
                  <button
                    onClick={acceptNecessary}
                    className="flex-shrink-0 text-neutral-500 hover:text-white transition-colors p-2 touch-manipulation"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile: Content and buttons */}
                <div className="sm:hidden">
                  <h3 className="text-sm font-semibold text-white mb-2">
                    Cookie Consent
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                    We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies. You can customize your preferences or learn more in our{' '}
                    <Link href="/privacy" className="text-primary-400 hover:text-primary-300 underline break-words">
                      Privacy Policy
                    </Link>.
                  </p>
                  <div className="flex flex-col gap-2.5">
                    <Button
                      onClick={acceptAll}
                      className="bg-primary-600 hover:bg-primary-500 text-white text-sm px-4 py-3 h-auto w-full touch-manipulation min-h-[44px]"
                    >
                      Accept All
                    </Button>
                    <div className="grid grid-cols-2 gap-2.5">
                      <Button
                        onClick={acceptNecessary}
                        variant="outline"
                        className="border-neutral-700 bg-neutral-800/50 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs px-3 py-2.5 h-auto touch-manipulation min-h-[44px]"
                      >
                        Necessary Only
                      </Button>
                      <Button
                        onClick={() => setShowSettings(true)}
                        variant="ghost"
                        className="text-neutral-400 hover:text-white text-xs px-3 py-2.5 h-auto touch-manipulation min-h-[44px]"
                      >
                        <Settings className="w-3.5 h-3.5 mr-1.5" />
                        Customize
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto [&>button]:text-neutral-400 [&>button]:hover:text-white p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Cookie className="w-5 h-5 sm:w-6 sm:h-6 text-primary-400" />
              Cookie Preferences
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-neutral-400">
              Manage your cookie preferences. You can enable or disable different types of cookies below. Learn more in our{' '}
              <Link href="/privacy" className="text-primary-400 hover:text-primary-300 underline break-words">
                Privacy Policy
              </Link>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            {/* Necessary Cookies */}
            <div className="border border-neutral-800 rounded-lg p-3 sm:p-4 bg-neutral-950/50">
              <div className="flex items-start justify-between gap-3 sm:gap-4 mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-base sm:text-lg font-semibold text-white mb-1">Necessary Cookies</h4>
                  <p className="text-xs sm:text-sm text-neutral-400">
                    Essential cookies required for the website to function properly. These cannot be disabled.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-10 h-6 bg-primary-500 rounded-full flex items-center justify-end px-1 cursor-not-allowed opacity-50 touch-manipulation">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Used for: Session management, security, and basic website functionality
              </p>
            </div>

            {/* Analytics Cookies */}
            <div className="border border-neutral-800 rounded-lg p-3 sm:p-4 bg-neutral-950/50">
              <div className="flex items-start justify-between gap-3 sm:gap-4 mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-base sm:text-lg font-semibold text-white mb-1">Analytics Cookies</h4>
                  <p className="text-xs sm:text-sm text-neutral-400">
                    Help us understand how visitors interact with our website by collecting and reporting information anonymously.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={() => togglePreference('analytics')}
                    className={`w-10 h-6 rounded-full flex items-center transition-colors touch-manipulation ${
                      preferences.analytics
                        ? 'bg-primary-500 justify-end'
                        : 'bg-neutral-700 justify-start'
                    } px-1`}
                    aria-label={preferences.analytics ? 'Disable analytics cookies' : 'Enable analytics cookies'}
                  >
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Used for: Cloudflare Web Analytics (privacy-preserving, no personal data collected)
              </p>
            </div>

            {/* Functional Cookies */}
            <div className="border border-neutral-800 rounded-lg p-3 sm:p-4 bg-neutral-950/50">
              <div className="flex items-start justify-between gap-3 sm:gap-4 mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-base sm:text-lg font-semibold text-white mb-1">Functional Cookies</h4>
                  <p className="text-xs sm:text-sm text-neutral-400">
                    Enable enhanced functionality and personalization, such as remembering your preferences.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={() => togglePreference('functional')}
                    className={`w-10 h-6 rounded-full flex items-center transition-colors touch-manipulation ${
                      preferences.functional
                        ? 'bg-primary-500 justify-end'
                        : 'bg-neutral-700 justify-start'
                    } px-1`}
                    aria-label={preferences.functional ? 'Disable functional cookies' : 'Enable functional cookies'}
                  >
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Used for: Remembering your preferences and settings
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-neutral-800">
            <Button
              onClick={saveCustomPreferences}
              className="bg-primary-600 hover:bg-primary-500 text-white flex-1 text-sm sm:text-base py-2.5 sm:py-2 touch-manipulation min-h-[44px] sm:min-h-0"
            >
              <Check className="w-4 h-4 mr-2" />
              Save Preferences
            </Button>
            <Button
              onClick={() => setShowSettings(false)}
              variant="outline"
              className="border-neutral-700 bg-neutral-800/50 hover:bg-neutral-700 text-neutral-200 hover:text-white text-sm sm:text-base py-2.5 sm:py-2 touch-manipulation min-h-[44px] sm:min-h-0"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

