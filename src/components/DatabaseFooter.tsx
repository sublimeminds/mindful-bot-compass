
import React from 'react';
import { Link } from 'react-router-dom';
import { useFooterData } from '@/hooks/useFooterData';
import { Heart, ExternalLink, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GradientLogo from '@/components/ui/GradientLogo';

const DatabaseFooter = () => {
  const { footerData, loading, error, getContentValue, getLinksBySection } = useFooterData();

  if (loading) {
    return (
      <footer className="w-full bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  if (error) {
    // Fallback footer if database fails
    return (
      <footer className="w-full bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <GradientLogo size="md" />
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                TherapySync
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              AI-powered mental health support designed to help you on your wellness journey.
            </p>
            <div className="border-t border-gray-200 pt-8">
              <p className="text-gray-600 text-sm">
                © 2024 TherapySync. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 mb-8">
          {/* Company Info Section - Takes 2 columns */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <GradientLogo size="sm" />
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                {getContentValue('company_name') || 'TherapySync'}
              </span>
            </div>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              {getContentValue('company_description') || 'AI-powered mental health support designed to help you on your wellness journey.'}
            </p>
            <p className="text-sm text-therapy-600 font-medium mb-4">
              {getContentValue('tagline') || 'Your AI-powered companion for mental wellness'}
            </p>
            
            {/* Contact Information */}
            <div className="space-y-2 text-sm text-gray-600">
              {getContentValue('contact_email') && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${getContentValue('contact_email')}`} className="hover:text-therapy-600">
                    {getContentValue('contact_email')}
                  </a>
                </div>
              )}
              {getContentValue('phone_number') && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${getContentValue('phone_number')}`} className="hover:text-therapy-600">
                    {getContentValue('phone_number')}
                  </a>
                </div>
              )}
              {getContentValue('address') && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{getContentValue('address')}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Dynamic Footer Sections - Each takes 1 column */}
          {footerData.sections.slice(0, 4).map((section) => {
            const sectionLinks = getLinksBySection(section.id);
            
            return (
              <div key={section.id}>
                <h4 className="font-semibold mb-4 text-gray-900">{section.label}</h4>
                <ul className="space-y-2">
                  {sectionLinks.map((link) => (
                    <li key={link.id}>
                      {link.opens_in_new_tab ? (
                        <a 
                          href={link.href} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-therapy-600 text-sm flex items-center gap-1 transition-colors"
                        >
                          {link.title}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <Link 
                          to={link.href} 
                          className="text-gray-600 hover:text-therapy-600 text-sm transition-colors"
                        >
                          {link.title}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Newsletter Section */}
        {getContentValue('newsletter_title') && (
          <div className="border-t border-gray-200 pt-8 mb-8">
            <div className="max-w-md">
              <h4 className="font-semibold mb-2 text-gray-900">
                {getContentValue('newsletter_title')}
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                {getContentValue('newsletter_description')}
              </p>
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1"
                />
                <Button className="bg-therapy-600 hover:bg-therapy-700">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 md:mb-0">
            <Heart className="h-4 w-4 text-therapy-500" />
            <span>Made with care by {getContentValue('company_name') || 'TherapySync'}</span>
            <span className="text-xs bg-therapy-100 text-therapy-700 px-2 py-1 rounded">
              {getContentValue('version') || 'v2.1.0'}
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Legal Links */}
            {footerData.sections.find(s => s.name === 'legal') && (
              <div className="flex items-center gap-4">
                {getLinksBySection(footerData.sections.find(s => s.name === 'legal')?.id || '').slice(0, 3).map((link) => (
                  <Link 
                    key={link.id}
                    to={link.href} 
                    className="text-xs text-gray-500 hover:text-therapy-600 transition-colors"
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            )}
            
            <p className="text-gray-600 text-sm">
              {getContentValue('copyright_text') || '© 2024 TherapySync. All rights reserved.'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DatabaseFooter;
