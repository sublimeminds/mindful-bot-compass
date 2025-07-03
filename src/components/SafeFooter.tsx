import React from 'react';
import { Link } from 'react-router-dom';
import SmartErrorBoundary from '@/components/SmartErrorBoundary';
import GradientLogo from '@/components/ui/GradientLogo';

// Safe Footer component with fallback functionality
const SafeFooterContent = () => {
  // Safe translation function with fallbacks
  const t = (key: string, fallback: string) => {
    try {
      // Try to get i18n if available
      const { useTranslation } = require('react-i18next');
      const { t: translate } = useTranslation();
      return translate(key, fallback);
    } catch {
      // Return fallback if i18n not available
      return fallback;
    }
  };

  return (
    <footer className="bg-gradient-to-br from-slate-50 via-therapy-50/30 to-calm-50/30 border-t border-slate-200/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <SmartErrorBoundary componentName="Logo" fallback={<div className="w-8 h-8 bg-therapy-500 rounded-lg"></div>}>
                <GradientLogo size="sm" className="animate-swirl-breathe" />
              </SmartErrorBoundary>
              <span className="text-2xl font-bold bg-gradient-to-r from-therapy-600 via-calm-500 to-therapy-700 bg-clip-text text-transparent">
                TherapySync
              </span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t('footer.description', 'Empowering mental wellness through AI-driven therapy and personalized support with cutting-edge technology.')}
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-3">
              <a
                href="https://instagram.com/therapysync"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center hover:from-pink-600 hover:to-rose-600 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-pink-200"
                aria-label="Follow us on Instagram"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              
              <a
                href="https://facebook.com/therapysync"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-blue-200"
                aria-label="Follow us on Facebook"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              
              <a
                href="https://twitter.com/therapysync"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl flex items-center justify-center hover:from-slate-900 hover:to-black transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-slate-300"
                aria-label="Follow us on Twitter"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              
              <a
                href="https://linkedin.com/company/therapysync"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-blue-700 to-blue-800 rounded-xl flex items-center justify-center hover:from-blue-800 hover:to-blue-900 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-blue-200"
                aria-label="Follow us on LinkedIn"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
              {t('footer.platform.title', 'Platform')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/features-showcase" className="text-slate-600 hover:text-therapy-600 text-sm transition-colors duration-200 hover:translate-x-1 inline-block">
                  {t('footer.platform.features', 'New Features')}
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-slate-600 hover:text-therapy-600 text-sm transition-colors duration-200 hover:translate-x-1 inline-block">
                  {t('footer.platform.pricing', 'Pricing')}
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-slate-600 hover:text-therapy-600 text-sm transition-colors duration-200 hover:translate-x-1 inline-block">
                  {t('footer.platform.howItWorks', 'How It Works')}
                </Link>
              </li>
              <li>
                <Link to="/cultural-ai-features" className="text-slate-600 hover:text-therapy-600 text-sm transition-colors duration-200 hover:translate-x-1 inline-block">
                  {t('footer.platform.culturalAI', 'Cultural AI')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
              {t('footer.support.title', 'Support')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-slate-600 hover:text-therapy-600 text-sm transition-colors duration-200 hover:translate-x-1 inline-block">
                  {t('footer.support.help', 'Help Center')}
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-slate-600 hover:text-therapy-600 text-sm transition-colors duration-200 hover:translate-x-1 inline-block">
                  {t('footer.support.contact', 'Contact Support')}
                </Link>
              </li>
              <li>
                <Link to="/crisis-resources" className="text-slate-600 hover:text-therapy-600 text-sm transition-colors duration-200 hover:translate-x-1 inline-block">
                  {t('footer.support.crisis', 'Crisis Resources')}
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-slate-600 hover:text-therapy-600 text-sm transition-colors duration-200 hover:translate-x-1 inline-block">
                  {t('footer.support.community', 'Community')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Specialized Therapy */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
              {t('footer.therapy.title', 'Specialized Therapy')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/therapy-types" className="text-slate-600 hover:text-therapy-600 text-sm transition-colors duration-200 hover:translate-x-1 inline-block">
                  {t('footer.therapy.types', 'All Therapy Types')}
                </Link>
              </li>
              <li>
                <Link to="/couples-therapy" className="text-slate-600 hover:text-therapy-600 text-sm transition-colors duration-200 hover:translate-x-1 inline-block">
                  {t('footer.therapy.couples', 'Couples Therapy')}
                </Link>
              </li>
              <li>
                <Link to="/adhd-therapy" className="text-slate-600 hover:text-therapy-600 text-sm transition-colors duration-200 hover:translate-x-1 inline-block">
                  {t('footer.therapy.adhd', 'ADHD Support')}
                </Link>
              </li>
              <li>
                <Link to="/lgbtq-therapy" className="text-slate-600 hover:text-therapy-600 text-sm transition-colors duration-200 hover:translate-x-1 inline-block">
                  {t('footer.therapy.lgbtq', 'LGBTQ+ Support')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gradient-to-r from-therapy-200/50 to-calm-200/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <p className="text-slate-600 text-sm">
                © {new Date().getFullYear()} TherapySync. {t('footer.copyright', 'All rights reserved.')}
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/privacy" className="text-slate-600 hover:text-therapy-600 text-sm transition-colors duration-200">
                {t('footer.legal.privacy', 'Privacy Policy')}
              </Link>
              <Link to="/terms" className="text-slate-600 hover:text-therapy-600 text-sm transition-colors duration-200">
                {t('footer.legal.terms', 'Terms of Service')}
              </Link>
              <Link to="/cookies" className="text-slate-600 hover:text-therapy-600 text-sm transition-colors duration-200">
                {t('footer.legal.cookies', 'Cookie Policy')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Safe Footer with error boundary
const SafeFooter = () => {
  return (
    <SmartErrorBoundary 
      componentName="Footer"
      fallback={
        <footer className="bg-slate-50 border-t border-slate-200 py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-slate-600">© {new Date().getFullYear()} TherapySync. All rights reserved.</p>
          </div>
        </footer>
      }
    >
      <SafeFooterContent />
    </SmartErrorBoundary>
  );
};

export default SafeFooter;