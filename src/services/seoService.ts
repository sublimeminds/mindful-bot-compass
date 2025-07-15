
interface SEOMetaData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  language?: string;
  region?: string;
  canonical?: string;
  hreflang?: Array<{ lang: string; url: string }>;
  robots?: string;
  alternateUrls?: Array<{ lang: string; url: string }>;
}

interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

interface SEOAnalytics {
  pageViews: number;
  bounceRate: number;
  avgTimeOnPage: number;
  searchImpressions: number;
  searchClicks: number;
  coreWebVitals: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
  };
}

interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  alternates?: Array<{ hreflang: string; href: string }>;
}

export class SEOService {
  private static defaultMeta: SEOMetaData = {
    title: 'TherapySync - AI-Powered Mental Wellness Companion',
    description: 'Transform your mental wellness journey with TherapySync\'s AI-powered therapy sessions, mood tracking, and personalized insights. Start your path to better mental health today.',
    keywords: 'AI therapy, mental health, wellness, mood tracking, online therapy, mental wellness, therapy app',
    image: '/lovable-uploads/24c86eb9-4983-4fdc-a4b4-94e0db57ebd2.png',
    siteName: 'TherapySync',
    type: 'website'
  };

  private static supportedLanguages = [
    { code: 'en', name: 'English', region: 'US' },
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

  static updateMetaTags(meta: Partial<SEOMetaData>) {
    const finalMeta = { ...this.defaultMeta, ...meta };
    
    // Update title
    document.title = finalMeta.title;
    
    // Basic meta tags
    this.updateMetaTag('description', finalMeta.description);
    this.updateMetaTag('keywords', finalMeta.keywords || '');
    this.updateMetaTag('robots', finalMeta.robots || 'index, follow');
    this.updateMetaTag('author', 'TherapySync');
    this.updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    
    // Language and region tags
    if (finalMeta.language) {
      this.updateMetaTag('language', finalMeta.language);
      this.updateMetaTag('content-language', finalMeta.language);
      document.documentElement.lang = finalMeta.language;
    }
    
    // Canonical URL
    if (finalMeta.canonical) {
      this.updateCanonicalTag(finalMeta.canonical);
    }
    
    // Hreflang tags
    if (finalMeta.hreflang && finalMeta.hreflang.length > 0) {
      this.updateHreflangTags(finalMeta.hreflang);
    }
    
    // Open Graph tags
    this.updateMetaTag('og:title', finalMeta.title);
    this.updateMetaTag('og:description', finalMeta.description);
    this.updateMetaTag('og:image', finalMeta.image || '');
    this.updateMetaTag('og:url', finalMeta.url || window.location.href);
    this.updateMetaTag('og:type', finalMeta.type || 'website');
    this.updateMetaTag('og:site_name', finalMeta.siteName || 'TherapySync');
    
    if (finalMeta.language) {
      this.updateMetaTag('og:locale', finalMeta.language.replace('-', '_'));
    }
    
    // Twitter Card tags
    this.updateMetaTag('twitter:card', 'summary_large_image');
    this.updateMetaTag('twitter:title', finalMeta.title);
    this.updateMetaTag('twitter:description', finalMeta.description);
    this.updateMetaTag('twitter:image', finalMeta.image || '');
    
    // Additional structured data for internationalization
    if (finalMeta.alternateUrls && finalMeta.alternateUrls.length > 0) {
      this.addAlternateUrlsStructuredData(finalMeta.alternateUrls);
    }
  }

  private static updateCanonicalTag(canonicalUrl: string) {
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }

  private static updateHreflangTags(hreflangData: Array<{ lang: string; url: string }>) {
    // Remove existing hreflang tags
    const existingHreflang = document.querySelectorAll('link[hreflang]');
    existingHreflang.forEach(link => link.remove());
    
    // Add new hreflang tags
    hreflangData.forEach(({ lang, url }) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lang;
      link.href = url;
      document.head.appendChild(link);
    });
  }

  private static addAlternateUrlsStructuredData(alternateUrls: Array<{ lang: string; url: string }>) {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      inLanguage: alternateUrls.map(alt => alt.lang),
      url: window.location.href,
      potentialAction: {
        '@type': 'ReadAction',
        target: alternateUrls.map(alt => alt.url)
      }
    };
    
    this.addStructuredData(structuredData);
  }

  private static updateMetaTag(name: string, content: string) {
    const property = name.startsWith('og:') || name.startsWith('twitter:') ? 'property' : 'name';
    let element = document.querySelector(`meta[${property}="${name}"]`) as HTMLMetaElement;
    
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(property, name);
      document.head.appendChild(element);
    }
    
    element.setAttribute('content', content);
  }

  static addStructuredData(data: StructuredData) {
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  static getPageSEOConfig(pageName: string): Partial<SEOMetaData> {
    const configs: Record<string, Partial<SEOMetaData>> = {
      home: {
        title: 'TherapySync - AI-Powered Mental Wellness Companion',
        description: 'Transform your mental wellness journey with TherapySync\'s AI-powered therapy sessions, mood tracking, and personalized insights.',
        keywords: 'AI therapy, mental health, wellness, online therapy, therapy app'
      },
      plans: {
        title: 'Pricing Plans - TherapySync',
        description: 'Choose the perfect TherapySync plan for your mental wellness journey. Free and premium options available with AI therapy, mood tracking, and more.',
        keywords: 'therapy pricing, mental health plans, AI therapy cost, wellness subscription'
      },
      dashboard: {
        title: 'Dashboard - TherapySync',
        description: 'Your personal mental wellness dashboard with AI insights, mood tracking, and therapy session management.',
        keywords: 'therapy dashboard, mental health tracking, wellness analytics'
      },
      onboarding: {
        title: 'Get Started - TherapySync',
        description: 'Begin your personalized mental wellness journey with TherapySync\'s guided onboarding process.',
        keywords: 'mental health assessment, therapy onboarding, wellness setup'
      }
    };

    return configs[pageName] || {};
  }

  static generateOrganizationStructuredData(): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'TherapySync',
      description: 'AI-powered mental wellness companion providing personalized therapy and wellness solutions',
      url: window.location.origin,
      logo: `${window.location.origin}/lovable-uploads/24c86eb9-4983-4fdc-a4b4-94e0db57ebd2.png`,
      sameAs: [
        // Add social media URLs when available
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: ['English', 'Spanish', 'French', 'German']
      }
    };
  }

  // Generate hreflang URLs for current page
  static generateHreflangUrls(currentPath: string): Array<{ lang: string; url: string }> {
    const baseUrl = window.location.origin;
    const cleanPath = currentPath.replace(/^\/[a-z]{2}\//, '/'); // Remove existing language prefix
    
    return this.supportedLanguages.map(lang => ({
      lang: lang.code === 'en' ? 'x-default' : lang.code,
      url: lang.code === 'en' ? `${baseUrl}${cleanPath}` : `${baseUrl}/${lang.code}${cleanPath}`
    }));
  }

  // Generate alternate URLs for current page
  static generateAlternateUrls(currentPath: string): Array<{ lang: string; url: string }> {
    const baseUrl = window.location.origin;
    const cleanPath = currentPath.replace(/^\/[a-z]{2}\//, '/');
    
    return this.supportedLanguages.map(lang => ({
      lang: lang.code,
      url: lang.code === 'en' ? `${baseUrl}${cleanPath}` : `${baseUrl}/${lang.code}${cleanPath}`
    }));
  }

  // Get canonical URL for current page
  static getCanonicalUrl(currentPath: string, preferredLang: string = 'en'): string {
    const baseUrl = window.location.origin;
    const cleanPath = currentPath.replace(/^\/[a-z]{2}\//, '/');
    
    return preferredLang === 'en' ? `${baseUrl}${cleanPath}` : `${baseUrl}/${preferredLang}${cleanPath}`;
  }

  // Get multilingual page SEO config with translation integration (async)
  static async getMultilingualPageSEOConfigAsync(pageName: string, language: string = 'en'): Promise<Partial<SEOMetaData>> {
    const baseConfig = this.getPageSEOConfig(pageName);
    const currentPath = window.location.pathname;
    
    // Try to get translated SEO content from database
    let translatedConfig = baseConfig;
    if (language !== 'en') {
      try {
        // Dynamically import Supabase to avoid circular dependencies
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          'https://dbwrbjjmraodegffupnx.supabase.co',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRid3JiamptcmFvZGVnZmZ1cG54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NjcwNTksImV4cCI6MjA2NTA0MzA1OX0.cY8oKDsNDOzYj7GsWFjFvFoze47lZQe9JM9khJMc6G4'
        );
        
        const { data: seoTranslations } = await supabase
          .from('seo_translations')
          .select('meta_title, meta_description, meta_keywords')
          .eq('page_key', pageName)
          .eq('target_language', language)
          .eq('is_active', true)
          .single();

        if (seoTranslations) {
          translatedConfig = {
            ...baseConfig,
            title: seoTranslations.meta_title,
            description: seoTranslations.meta_description,
            keywords: Array.isArray(seoTranslations.meta_keywords) 
              ? seoTranslations.meta_keywords.join(', ')
              : seoTranslations.meta_keywords || baseConfig.keywords
          };
        }
      } catch (error) {
        console.warn(`No SEO translations found for ${pageName} in ${language}:`, error);
      }
    }
    
    return {
      ...translatedConfig,
      language,
      canonical: this.getCanonicalUrl(currentPath, 'en'), // Always canonical to English version
      hreflang: this.generateHreflangUrls(currentPath),
      alternateUrls: this.generateAlternateUrls(currentPath)
    };
  }

  // Legacy sync method for backward compatibility
  static getMultilingualPageSEOConfig(pageName: string, language: string = 'en'): Partial<SEOMetaData> {
    const baseConfig = this.getPageSEOConfig(pageName);
    const currentPath = window.location.pathname;
    
    return {
      ...baseConfig,
      language,
      canonical: this.getCanonicalUrl(currentPath, 'en'),
      hreflang: this.generateHreflangUrls(currentPath),
      alternateUrls: this.generateAlternateUrls(currentPath)
    };
  }

  // Generate sitemap data
  static generateSitemapData(): SitemapEntry[] {
    const baseUrl = window.location.origin;
    const pages = [
      { path: '/', priority: 1.0, changefreq: 'daily' as const },
      { path: '/pricing', priority: 0.9, changefreq: 'weekly' as const },
      { path: '/features', priority: 0.8, changefreq: 'weekly' as const },
      { path: '/get-started', priority: 0.8, changefreq: 'monthly' as const },
      { path: '/therapy-types', priority: 0.7, changefreq: 'monthly' as const },
      { path: '/how-it-works', priority: 0.7, changefreq: 'monthly' as const },
      { path: '/solutions/individuals', priority: 0.6, changefreq: 'monthly' as const },
      { path: '/solutions/families', priority: 0.6, changefreq: 'monthly' as const },
      { path: '/solutions/providers', priority: 0.6, changefreq: 'monthly' as const },
      { path: '/crisis-support', priority: 0.8, changefreq: 'weekly' as const },
      { path: '/community', priority: 0.5, changefreq: 'daily' as const },
    ];

    const sitemapEntries: SitemapEntry[] = [];
    
    pages.forEach(page => {
      this.supportedLanguages.forEach(lang => {
        const url = lang.code === 'en' ? `${baseUrl}${page.path}` : `${baseUrl}/${lang.code}${page.path}`;
        const alternates = this.supportedLanguages.map(altLang => ({
          hreflang: altLang.code === 'en' ? 'x-default' : altLang.code,
          href: altLang.code === 'en' ? `${baseUrl}${page.path}` : `${baseUrl}/${altLang.code}${page.path}`
        }));

        sitemapEntries.push({
          url,
          lastmod: new Date().toISOString(),
          changefreq: page.changefreq,
          priority: page.priority,
          alternates
        });
      });
    });

    return sitemapEntries;
  }

  // Generate XML sitemap
  static generateXMLSitemap(): string {
    const sitemapData = this.generateSitemapData();
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
    
    sitemapData.forEach(entry => {
      xml += '  <url>\n';
      xml += `    <loc>${entry.url}</loc>\n`;
      xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
      xml += `    <priority>${entry.priority}</priority>\n`;
      
      if (entry.alternates) {
        entry.alternates.forEach(alt => {
          xml += `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />\n`;
        });
      }
      
      xml += '  </url>\n';
    });
    
    xml += '</urlset>';
    return xml;
  }

  // SEO Health Check
  static performSEOHealthCheck(): { score: number; issues: string[]; recommendations: string[] } {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Check title
    const title = document.title;
    if (!title) {
      issues.push('Missing page title');
      score -= 20;
    } else if (title.length < 30 || title.length > 60) {
      issues.push('Title length should be 30-60 characters');
      score -= 10;
    }

    // Check description
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content');
    if (!description) {
      issues.push('Missing meta description');
      score -= 15;
    } else if (description.length < 120 || description.length > 160) {
      issues.push('Meta description should be 120-160 characters');
      score -= 5;
    }

    // Check H1 tags
    const h1Tags = document.querySelectorAll('h1');
    if (h1Tags.length === 0) {
      issues.push('Missing H1 tag');
      score -= 15;
    } else if (h1Tags.length > 1) {
      issues.push('Multiple H1 tags found');
      score -= 10;
    }

    // Check canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      issues.push('Missing canonical URL');
      score -= 10;
    }

    // Check hreflang tags
    const hreflangTags = document.querySelectorAll('link[hreflang]');
    if (hreflangTags.length === 0) {
      recommendations.push('Consider adding hreflang tags for international SEO');
    }

    // Generate recommendations based on score
    if (score < 80) {
      recommendations.push('Focus on fixing critical SEO issues first');
    }
    if (issues.some(issue => issue.includes('title'))) {
      recommendations.push('Optimize page title for better click-through rates');
    }
    if (issues.some(issue => issue.includes('description'))) {
      recommendations.push('Write compelling meta descriptions to improve CTR');
    }

    return { score: Math.max(0, score), issues, recommendations };
  }

  // Monitor Core Web Vitals (simplified version)
  static async measureCoreWebVitals(): Promise<Partial<SEOAnalytics['coreWebVitals']>> {
    const vitals: Partial<SEOAnalytics['coreWebVitals']> = {};

    try {
      // Measure LCP (Largest Contentful Paint)
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        vitals.lcp = lastEntry.startTime;
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });

      // Measure CLS (Cumulative Layout Shift)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        vitals.cls = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Measure FID (First Input Delay) - simplified
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          vitals.fid = (entry as any).processingStart - entry.startTime;
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

    } catch (error) {
      console.warn('Core Web Vitals measurement failed:', error);
    }

    return vitals;
  }

  // Get supported languages
  static getSupportedLanguages() {
    return this.supportedLanguages;
  }

  // Detect language from URL
  static detectLanguageFromUrl(): string {
    const pathname = window.location.pathname;
    const langMatch = pathname.match(/^\/([a-z]{2})\//);
    return langMatch ? langMatch[1] : 'en';
  }

  // Generate language-specific URLs
  static generateLanguageUrls(basePath: string): Array<{ lang: string; url: string; name: string }> {
    const baseUrl = window.location.origin;
    const cleanPath = basePath.replace(/^\/[a-z]{2}\//, '/');
    
    return this.supportedLanguages.map(lang => ({
      lang: lang.code,
      url: lang.code === 'en' ? `${baseUrl}${cleanPath}` : `${baseUrl}/${lang.code}${cleanPath}`,
      name: lang.name
    }));
  }
}
