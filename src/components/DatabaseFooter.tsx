
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink, Heart } from 'lucide-react';

interface FooterSection {
  id: string;
  name: string;
  label: string;
  position: number;
}

interface FooterLink {
  id: string;
  section_id: string;
  title: string;
  href: string;
  position: number;
  opens_in_new_tab: boolean;
}

interface FooterContent {
  content_key: string;
  content_value: string;
}

const DatabaseFooter = () => {
  const { data: sections = [], isLoading: sectionsLoading } = useQuery({
    queryKey: ['footer-sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('footer_sections')
        .select('*')
        .eq('is_active', true)
        .order('position');
      
      if (error) throw error;
      return data as FooterSection[];
    },
  });

  const { data: links = [], isLoading: linksLoading } = useQuery({
    queryKey: ['footer-links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('footer_links')
        .select('*')
        .eq('is_active', true)
        .order('position');
      
      if (error) throw error;
      return data as FooterLink[];
    },
  });

  const { data: content = [], isLoading: contentLoading } = useQuery({
    queryKey: ['footer-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('footer_content')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data as FooterContent[];
    },
  });

  const getContentValue = (key: string, defaultValue: string = '') => {
    const item = content.find(c => c.content_key === key);
    return item?.content_value || defaultValue;
  };

  const groupedLinks = sections.reduce((acc, section) => {
    acc[section.id] = links.filter(link => link.section_id === section.id);
    return acc;
  }, {} as Record<string, FooterLink[]>);

  if (sectionsLoading || linksLoading || contentLoading) {
    return (
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="space-y-2">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="h-3 bg-gray-200 rounded w-16"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {sections.map((section) => (
            <div key={section.id} className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                {section.label}
              </h3>
              <ul className="space-y-2">
                {groupedLinks[section.id]?.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      target={link.opens_in_new_tab ? '_blank' : undefined}
                      rel={link.opens_in_new_tab ? 'noopener noreferrer' : undefined}
                      className="text-sm text-gray-600 hover:text-therapy-600 transition-colors flex items-center gap-1"
                    >
                      {link.title}
                      {link.opens_in_new_tab && (
                        <ExternalLink className="h-3 w-3" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-therapy-500" />
            <span className="text-sm text-gray-600">
              {getContentValue('company_name', 'TherapySync')} - {getContentValue('tagline', 'Your AI-powered companion for mental wellness')}
            </span>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-600">
              {getContentValue('copyright_text', '© 2024 TherapySync. All rights reserved.')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DatabaseFooter;
