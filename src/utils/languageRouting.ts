import React from 'react';
// Temporarily inline language detection to fix module resolution conflict

// Language routing configuration
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', region: 'US', isDefault: true },
  { code: 'de', name: 'Deutsch', region: 'DE' },
  { code: 'es', name: 'Español', region: 'ES' },
  { code: 'fr', name: 'Français', region: 'FR' },
  { code: 'it', name: 'Italiano', region: 'IT' },
  { code: 'pt', name: 'Português', region: 'BR' },
  { code: 'ja', name: '日本語', region: 'JP' },
  { code: 'ko', name: '한국어', region: 'KR' },
  { code: 'zh', name: '中文', region: 'CN' },
  { code: 'ar', name: 'العربية', region: 'SA' },
];

export class LanguageRouter {
  // Extract language from URL path
  static extractLanguageFromPath(pathname: string): { language: string; cleanPath: string } {
    const langMatch = pathname.match(/^\/([a-z]{2})(\/.*)?$/);
    
    if (langMatch) {
      const [, lang, rest = '/'] = langMatch;
      if (SUPPORTED_LANGUAGES.find(l => l.code === lang)) {
        return {
          language: lang,
          cleanPath: rest
        };
      }
    }
    
    return {
      language: 'en', // Default language
      cleanPath: pathname
    };
  }

  // Generate URL with language prefix
  static generateLanguageUrl(path: string, language: string): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    
    if (language === 'en') {
      return cleanPath; // Default language doesn't need prefix
    }
    
    return `/${language}${cleanPath}`;
  }

  // Get current language from browser location
  static getCurrentLanguage(): string {
    return this.extractLanguageFromPath(window.location.pathname).language;
  }

  // Get clean path without language prefix
  static getCleanPath(pathname?: string): string {
    const path = pathname || window.location.pathname;
    return this.extractLanguageFromPath(path).cleanPath;
  }

  // Detect user's preferred language (simplified to avoid module conflicts)
  static detectPreferredLanguage(): string {
    try {
      // 1. Check URL
      const urlLang = this.getCurrentLanguage();
      if (urlLang !== 'en') return urlLang;

      // 2. Check localStorage
      const savedLang = localStorage.getItem('preferred-language');
      if (savedLang && SUPPORTED_LANGUAGES.find(l => l.code === savedLang)) {
        return savedLang;
      }

      // 3. Check browser language (inline to avoid import conflicts)
      const browserLang = navigator.language || 'en';
      const langCode = browserLang.split('-')[0].toLowerCase();
      const supportedCodes = SUPPORTED_LANGUAGES.map(l => l.code);
      
      if (supportedCodes.includes(langCode)) {
        return langCode;
      }

      // 4. Default to English
      return 'en';
    } catch (error) {
      console.warn('Language detection failed, using English:', error);
      return 'en';
    }
  }

  // Generate all language alternatives for current page
  static generateLanguageAlternatives(basePath?: string): Array<{ lang: string; url: string; name: string }> {
    const cleanPath = this.getCleanPath(basePath);
    const baseUrl = window.location.origin;
    
    return SUPPORTED_LANGUAGES.map(lang => ({
      lang: lang.code,
      url: `${baseUrl}${this.generateLanguageUrl(cleanPath, lang.code)}`,
      name: lang.name
    }));
  }

  // Check if language change should redirect
  static shouldRedirectForLanguage(currentPath: string, preferredLanguage: string): string | null {
    const { language: currentLang, cleanPath } = this.extractLanguageFromPath(currentPath);
    
    // Don't redirect if already on preferred language, if it's the default, or if user dismissed
    if (currentLang === preferredLanguage || 
        preferredLanguage === 'en' || 
        sessionStorage.getItem('language-redirect-dismissed')) {
      return null;
    }
    
    // Generate the redirect URL
    return this.generateLanguageUrl(cleanPath, preferredLanguage);
  }

  // Method to dismiss language suggestions
  static dismissLanguageSuggestion() {
    sessionStorage.setItem('language-redirect-dismissed', 'true');
    sessionStorage.removeItem('language-suggestion');
  }

  // Method to get current language suggestion
  static getLanguageSuggestion() {
    const suggestion = sessionStorage.getItem('language-suggestion');
    if (!suggestion) return null;
    
    try {
      const parsed = JSON.parse(suggestion);
      // Expire suggestions after 24 hours
      if (Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000) {
        sessionStorage.removeItem('language-suggestion');
        return null;
      }
      return parsed;
    } catch {
      sessionStorage.removeItem('language-suggestion');
      return null;
    }
  }

  // Save language preference
  static saveLanguagePreference(language: string) {
    if (SUPPORTED_LANGUAGES.find(l => l.code === language)) {
      localStorage.setItem('preferred-language', language);
      
      // Update HTML lang attribute
      document.documentElement.lang = language;
      
      // Basic document title update only
      const currentPath = window.location.pathname;
      const { cleanPath } = this.extractLanguageFromPath(currentPath);
      const pageName = cleanPath.slice(1) || 'home';
      document.title = `${pageName.charAt(0).toUpperCase() + pageName.slice(1)} - MentalQ AI`;
    }
  }

  // Navigate to language-specific URL
  static navigateToLanguage(language: string, navigate: (path: string) => void) {
    const currentPath = window.location.pathname;
    const { cleanPath } = this.extractLanguageFromPath(currentPath);
    const newPath = this.generateLanguageUrl(cleanPath, language);
    
    this.saveLanguagePreference(language);
    navigate(newPath);
  }

  // Get language-aware route patterns for React Router
  static generateRoutePatterns(basePath: string): string[] {
    const patterns = [basePath]; // Default English route
    
    // Add language-prefixed routes
    SUPPORTED_LANGUAGES
      .filter(lang => lang.code !== 'en')
      .forEach(lang => {
        patterns.push(`/${lang.code}${basePath}`);
      });
    
    return patterns;
  }

  // Initialize language routing on app start
  static initializeLanguageRouting() {
    const preferredLang = this.detectPreferredLanguage();
    const currentPath = window.location.pathname;
    const suggestedRedirect = this.shouldRedirectForLanguage(currentPath, preferredLang);
    
    // Update HTML lang attribute
    document.documentElement.lang = preferredLang;
    
    // Store language suggestion for banner display (non-intrusive)
    if (suggestedRedirect && !sessionStorage.getItem('language-redirect-dismissed')) {
      // Don't show automatic prompts, let components handle the UI
      sessionStorage.setItem('language-suggestion', JSON.stringify({
        suggestedLanguage: preferredLang,
        suggestedRedirect,
        timestamp: Date.now()
      }));
    }
    
    return {
      currentLanguage: preferredLang,
      availableLanguages: SUPPORTED_LANGUAGES,
      suggestedRedirect
    };
  }

  // Get basic SEO data for current language and page
  static getCurrentPageSEO(): any {
    const language = this.getCurrentLanguage();
    const cleanPath = this.getCleanPath();
    const pageName = cleanPath.slice(1) || 'home';
    
    return {
      title: `${pageName.charAt(0).toUpperCase() + pageName.slice(1)} - MentalQ AI`,
      description: `MentalQ AI - Advanced AI-powered mental health support in ${language}`,
      language
    };
  }
}

// Helper function to create language-aware route component
export function createLanguageAwareRoute(
  component: React.ComponentType<any>,
  pageName: string
) {
  return function LanguageAwareComponent(props: any) {
    React.useEffect(() => {
      const language = LanguageRouter.getCurrentLanguage();
      document.title = `${pageName.charAt(0).toUpperCase() + pageName.slice(1)} - MentalQ AI`;
      document.documentElement.lang = language;
    }, []);

    return React.createElement(component, props);
  };
}

export default LanguageRouter;