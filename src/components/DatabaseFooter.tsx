
import React from 'react';
import { useFooterContent } from '@/hooks/useFooterContent';
import { Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';
import GradientLogo from '@/components/ui/GradientLogo';

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

  // Get social links
  const socialLinks = footerData.links.filter(link => 
    ['twitter', 'linkedin', 'instagram', 'youtube'].includes(link.title.toLowerCase())
  );

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info with Logo */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <GradientLogo size="sm" />
              <h3 className="text-xl font-bold bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                {footerData.content.company_name}
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {footerData.content.company_description}
            </p>
            <p className="text-sm text-gray-600 mb-6">
              {footerData.content.tagline}
            </p>
            
            {/* Social Icons */}
            {socialLinks.length > 0 && (
              <div className="flex space-x-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-therapy-700 transition-colors p-2 rounded-full hover:bg-therapy-50"
                  >
                    {getSocialIcon(link.title)}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic Footer Sections */}
          {filteredSections.map((section) => {
            const sectionLinks = footerData.links.filter(link => 
              link.section_id === section.id && 
              !['twitter', 'linkedin', 'instagram', 'youtube'].includes(link.title.toLowerCase())
            );

            return (
              <div key={section.id}>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  {section.label}
                </h4>
                <ul className="space-y-2">
                  {sectionLinks.map((link) => (
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
