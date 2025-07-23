
import React from 'react';
import { useFooterContent } from '@/hooks/useFooterContent';
import { Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';

const DatabaseFooter: React.FC = () => {
  const { footerData, loading } = useFooterContent();

  if (loading) {
    return <div className="bg-gray-50 p-8">Loading footer...</div>;
  }

  // Filter out the connect section since we're handling social icons separately
  const filteredSections = footerData.sections.filter(section => section.name !== 'connect');

  const getSocialIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'youtube':
        return <Youtube className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {footerData.content.company_name}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {footerData.content.company_description}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              {footerData.content.tagline}
            </p>
          </div>

          {/* Dynamic Footer Sections */}
          {filteredSections.map((section) => {
            const sectionLinks = footerData.links.filter(link => link.section_id === section.id);
            const regularLinks = sectionLinks.filter(link => !['twitter', 'linkedin', 'instagram', 'youtube'].includes(link.title.toLowerCase()));
            const socialLinks = sectionLinks.filter(link => ['twitter', 'linkedin', 'instagram', 'youtube'].includes(link.title.toLowerCase()));

            return (
              <div key={section.id}>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  {section.label}
                </h4>
                <ul className="space-y-2">
                  {regularLinks.map((link) => (
                    <li key={link.id}>
                      <a
                        href={link.href}
                        target={link.opens_in_new_tab ? '_blank' : '_self'}
                        rel={link.opens_in_new_tab ? 'noopener noreferrer' : undefined}
                        className="text-sm text-gray-600 hover:text-therapy-700 transition-colors"
                      >
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
                
                {/* Social Icons for Support Section */}
                {section.name === 'support' && socialLinks.length > 0 && (
                  <div className="mt-4">
                    <div className="flex space-x-3">
                      {socialLinks.map((link) => (
                        <a
                          key={link.id}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-therapy-700 transition-colors"
                        >
                          {getSocialIcon(link.title)}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              {footerData.content.copyright_text}
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-sm text-gray-500">
                {footerData.content.version}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Contact:</span>
                <a
                  href={`mailto:${footerData.content.contact_email}`}
                  className="text-sm text-therapy-700 hover:text-therapy-800 transition-colors"
                >
                  {footerData.content.contact_email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DatabaseFooter;
