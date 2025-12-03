"use client";

import { useEffect, useState } from "react";
import { Languages } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

// Language options with codes and display names
// English, Polish, and Croatian appear first, then the rest
const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "pl", name: "Polish", native: "Polski" },
  { code: "hr", name: "Croatian", native: "Hrvatski" },
  { code: "es", name: "Spanish", native: "Español" },
  { code: "fr", name: "French", native: "Français" },
  { code: "de", name: "German", native: "Deutsch" },
  { code: "zh-CN", name: "Chinese", native: "中文" },
  { code: "ja", name: "Japanese", native: "日本語" },
  { code: "ar", name: "Arabic", native: "العربية" },
  { code: "pt", name: "Portuguese", native: "Português" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
];

// Declare global types for Google Translate API
declare global {
  interface Window {
    google: any;
    googleTranslateElementInit?: () => void;
  }
}

/**
 * GoogleTranslate Component
 * 
 * Modern, seamless translation widget in the top-right corner.
 * Uses Google Translate's official widget API with ShadCN styling
 * for a premium, integrated user experience.
 * 
 * Features:
 * - Fixed position (doesn't move on scroll)
 * - Supports 11 languages including Croatian
 * - Properly handles Next.js hydration
 * - Modern glassmorphism design matching institutional theme
 * - Responsive: icon-only on mobile, full button on desktop
 */
export function GoogleTranslate() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [isOpen, setIsOpen] = useState(false);

  // Function to detect current active language from cookie or HTML lang attribute
  const detectCurrentLanguage = (): string => {
    // Check Google Translate cookie first
    const cookies = document.cookie.split(";");
    const googtransCookie = cookies.find((cookie) => cookie.trim().startsWith("googtrans="));
    
    if (googtransCookie) {
      const cookieValue = googtransCookie.split("=")[1];
      // Cookie format: /en/pl means translating from English to Polish
      const match = cookieValue.match(/\/([a-z]{2}(?:-[A-Z]{2})?)$/);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    // Fallback: check HTML lang attribute (Google Translate sets this)
    const htmlLang = document.documentElement.lang;
    if (htmlLang && htmlLang !== "en") {
      // Convert lang code to match our language codes
      return htmlLang.split("-")[0] === "zh" ? "zh-CN" : htmlLang.split("-")[0];
    }
    
    // Default to English
    return "en";
  };

  // Detect and set current language on mount
  useEffect(() => {
    // Set initial language from cookie/HTML
    const detectedLang = detectCurrentLanguage();
    setCurrentLanguage(detectedLang);
  }, []);

  // Load Google Translate script and initialize
  useEffect(() => {
    // Prevent double loading of the script
    if (document.getElementById("google-translate-script")) {
      return;
    }

    // Initialize Google Translate widget (positioned off-screen, we'll use it programmatically)
    // This function is called by Google's script when it loads
    window.googleTranslateElementInit = () => {
      // Check if element already exists
      let translateElement = document.getElementById("google_translate_element");
      if (!translateElement) {
        // Create translate element positioned off-screen (not hidden, so it can initialize)
        translateElement = document.createElement("div");
        translateElement.id = "google_translate_element";
        translateElement.style.position = "absolute";
        translateElement.style.left = "-9999px";
        translateElement.style.top = "-9999px";
        translateElement.style.opacity = "0";
        translateElement.style.pointerEvents = "none";
        document.body.appendChild(translateElement);
      }

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en", // Default language is English
          includedLanguages: "en,es,fr,de,zh-CN,ja,ar,pl,pt,hi,hr", // 11 supported languages
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false, // Don't auto-display the banner
        },
        "google_translate_element"
      );
      setIsLoaded(true);
      
      // After Google Translate loads, detect and set the current language
      setTimeout(() => {
        const detectedLang = detectCurrentLanguage();
        setCurrentLanguage(detectedLang);
        
        // Also sync with the select element if it exists
        const select = document.querySelector<HTMLSelectElement>(
          "#google_translate_element select.goog-te-combo"
        );
        if (select && select.value !== detectedLang) {
          select.value = detectedLang === "en" ? "" : detectedLang;
        }
      }, 500);
    };

    // Load the Google Translate script dynamically
    // Using async loading to avoid blocking page render
    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    // Cleanup function: remove script and global function on unmount
    return () => {
      const script = document.getElementById("google-translate-script");
      if (script) {
        script.remove();
      }
      // Only delete if it exists
      if (window.googleTranslateElementInit) {
        delete window.googleTranslateElementInit;
      }
    };
  }, []);

  // Handle language change - properly trigger Google Translate
  const handleLanguageChange = (langCode: string) => {
    // Track language change event
    const selectedLang = languages.find((lang) => lang.code === langCode);
    trackEvent('translate_language_change', {
      language_code: langCode,
      language_name: selectedLang?.name || langCode,
      language_native: selectedLang?.native || langCode,
      previous_language: currentLanguage,
    });
    
    setCurrentLanguage(langCode);
    setIsOpen(false);
    
    // Function to trigger translation using Google Translate's select element
    const triggerTranslation = () => {
      const select = document.querySelector<HTMLSelectElement>(
        "#google_translate_element select.goog-te-combo"
      );
      
      if (select) {
        // Set the select value
        select.value = langCode === "en" ? "" : langCode;
        
        // Create and dispatch change event - this is what Google Translate listens to
        const changeEvent = new Event("change", { 
          bubbles: true, 
          cancelable: true 
        });
        
        // Trigger the change event
        select.dispatchEvent(changeEvent);
        
        // Also try calling the onchange handler directly if it exists
        if (select.onchange && typeof select.onchange === "function") {
          try {
            select.onchange(changeEvent as any);
          } catch (e) {
            // If that fails, use cookie system
            setGoogleTranslateCookie(langCode);
          }
        } else {
          // If no onchange handler, use cookie system
          setGoogleTranslateCookie(langCode);
        }
      } else {
        // If select not found yet, use cookie system and reload
        setGoogleTranslateCookie(langCode);
      }
    };
    
    // Wait for Google Translate to be loaded, then trigger translation
    if (isLoaded && window.google && window.google.translate) {
      // Small delay to ensure select element is ready
      setTimeout(triggerTranslation, 100);
    } else {
      // Wait for Google Translate to load
      const checkLoaded = setInterval(() => {
        if (isLoaded && window.google && window.google.translate) {
          clearInterval(checkLoaded);
          triggerTranslation();
        }
      }, 100);
      
      // Timeout after 3 seconds
      setTimeout(() => {
        clearInterval(checkLoaded);
        // Fallback: use cookie system
        setGoogleTranslateCookie(langCode);
      }, 3000);
    }
  };
  
  // Helper function to set Google Translate cookie (fallback method)
  const setGoogleTranslateCookie = (langCode: string) => {
    if (langCode === "en") {
      // Remove translation cookie for English
      document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "googtrans=; path=/; domain=" + window.location.hostname + "; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    } else {
      // Set translation cookie
      const cookieValue = `/en/${langCode}`;
      document.cookie = `googtrans=${cookieValue}; path=/; max-age=31536000; SameSite=Lax`;
    }
    
    // Reload page to apply translation
    window.location.reload();
  };

  // Get current language display name
  const currentLang = languages.find((lang) => lang.code === currentLanguage) || languages[0];

  // Single responsive component - uses CSS to show/hide elements based on screen size
  return (
    <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50">
      <Select 
        value={currentLanguage} 
        onValueChange={handleLanguageChange} 
        open={isOpen} 
        onOpenChange={(open) => {
          setIsOpen(open);
          // Track when dropdown is opened
          if (open) {
            trackEvent('translate_dropdown_open', {
              current_language: currentLanguage,
            });
          }
        }}
      >
        <SelectTrigger 
          className={cn(
            "group border-none p-0 h-auto shadow-none focus:ring-0",
            "flex items-center justify-start gap-3 sm:gap-3",
            "rounded-xl",
            "px-6 py-4 sm:px-5 sm:py-3.5 shadow-2xl",
            "bg-neutral-900/95 backdrop-blur-md border border-primary-500/30",
            "hover:border-primary-500/40",
            "transition-all duration-300 ease-out",
            "hover:shadow-primary-500/20 hover:shadow-xl",
            "active:scale-[0.98]",
            "cursor-pointer",
            "relative overflow-hidden",
            "w-fit",
            "[&>svg:last-child]:hidden", // Hide the default chevron from SelectTrigger
            "[&_[data-slot='select-icon']]:hidden" // Also hide via data-slot if present
          )}
        >
          {/* Languages icon - slightly bigger on mobile */}
          <Languages 
            className="w-6 h-6 sm:w-5 sm:h-5 transition-colors duration-300 flex-shrink-0 text-primary-400" 
          />
          
          {/* Language text - slightly bigger on mobile */}
          <SelectValue 
            className="text-lg sm:text-base font-medium text-primary-50 min-w-[100px] notranslate"
          />
          
          {/* Custom Chevron indicator - slightly bigger on mobile */}
          <svg
            className={cn(
              "w-5 h-5 sm:w-4 sm:h-4 text-primary-400/70 transition-transform duration-300 flex-shrink-0",
              isOpen && "rotate-180"
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>

          {/* Subtle glow effect on hover */}
          <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-primary-500/0 group-hover:bg-primary-500/5 blur-xl transition-all duration-500 -z-10" />
        </SelectTrigger>
        
        {/* Dropdown menu - matches button styling */}
        <SelectContent 
          className={cn(
            "bg-neutral-900/95 backdrop-blur-md border-primary-500/30 text-primary-50",
            "shadow-2xl rounded-xl p-2",
            "min-w-[200px]",
            "notranslate" // Prevent Google Translate from translating the dropdown
          )}
          align="end"
          sideOffset={8}
        >
          {languages.map((lang) => (
            <SelectItem
              key={lang.code}
              value={lang.code}
              textValue={lang.native}
              className={cn(
                "text-primary-50 hover:bg-primary-500/15 hover:text-primary-300",
                "focus:bg-primary-500/15 focus:text-primary-300",
                "cursor-pointer rounded-lg px-3 py-2.5",
                "transition-colors duration-200",
                "notranslate", // Prevent Google Translate from translating language names
                currentLanguage === lang.code && "bg-primary-500/10"
              )}
            >
              <span className="font-medium notranslate">{lang.native}</span>
              <span className="text-xs text-primary-400/70 ml-2 notranslate hide-in-select-value">({lang.name})</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Google Translate element - positioned off-screen for functionality */}
      <div 
        id="google_translate_element" 
        className="absolute -left-[9999px] -top-[9999px] opacity-0 pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}
