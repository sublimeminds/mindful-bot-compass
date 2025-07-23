
import React from 'react';
import { Link } from 'react-router-dom';
import { useFooterData } from '@/hooks/useFooterData';
import { Heart, ExternalLink } from 'lucide-react';

const DatabaseFooter = () => {
  const { footerData, loading, error, getContentValue, getLinksBySection } = useFooterData();

  if (loading) {
    return (
      <footer className="w-full bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
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
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              TherapySync
            </h3>
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info Section */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              {getContentValue('company_name') || 'TherapySync'}
            </h3>
            <p className="text-gray-600 mb-4">
              {getContentValue('company_description') || 'AI-powered mental health support designed to help you on your wellness journey.'}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Heart className="h-4 w-4 text-therapy-500" />
              <span>Made with care by {getContentValue('company_name') || 'TherapySync'}</span>
              <span className="text-xs">{getContentValue('version') || 'v2.1.0'}</span>
            </div>
          </div>
          
          {/* Dynamic Footer Sections */}
          {footerData.sections.map((section) => {
            const sectionLinks = getLinksBySection(section.id);
            
            return (
              <div key={section.id}>
                <h4 className="font-medium mb-3 text-gray-900">{section.label}</h4>
                <ul className="space-y-2">
                  {sectionLinks.map((link) => (
                    <li key={link.id}>
                      {link.opens_in_new_tab ? (
                        <a 
                          href={link.href} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-1"
                        >
                          {link.title}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <Link 
                          to={link.href} 
                          className="text-gray-600 hover:text-gray-900 text-sm"
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
        
        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600 text-sm">
            {getContentValue('copyright_text') || '© 2024 TherapySync. All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default DatabaseFooter;
