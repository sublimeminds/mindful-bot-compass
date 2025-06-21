
interface SEOMetaData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
}

interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
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

  static updateMetaTags(meta: Partial<SEOMetaData>) {
    const finalMeta = { ...this.defaultMeta, ...meta };
    
    // Update title
    document.title = finalMeta.title;
    
    // Update or create meta tags
    this.updateMetaTag('description', finalMeta.description);
    this.updateMetaTag('keywords', finalMeta.keywords || '');
    
    // Open Graph tags
    this.updateMetaTag('og:title', finalMeta.title);
    this.updateMetaTag('og:description', finalMeta.description);
    this.updateMetaTag('og:image', finalMeta.image || '');
    this.updateMetaTag('og:url', finalMeta.url || window.location.href);
    this.updateMetaTag('og:type', finalMeta.type || 'website');
    this.updateMetaTag('og:site_name', finalMeta.siteName || 'TherapySync');
    
    // Twitter Card tags
    this.updateMetaTag('twitter:card', 'summary_large_image');
    this.updateMetaTag('twitter:title', finalMeta.title);
    this.updateMetaTag('twitter:description', finalMeta.description);
    this.updateMetaTag('twitter:image', finalMeta.image || '');
    
    // Additional meta tags
    this.updateMetaTag('robots', 'index, follow');
    this.updateMetaTag('author', 'TherapySync');
    this.updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');
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
}
