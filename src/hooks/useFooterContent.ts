
import { useFooterData } from './useFooterData';

export interface FooterContentData {
  sections: Array<{
    id: string;
    name: string;
    label: string;
    position: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  }>;
  links: Array<{
    id: string;
    section_id: string;
    title: string;
    href: string;
    icon?: string;
    position: number;
    is_active: boolean;
    opens_in_new_tab: boolean;
    created_at: string;
    updated_at: string;
  }>;
  content: {
    company_name: string;
    company_description: string;
    tagline: string;
    copyright_text: string;
    version: string;
    contact_email: string;
  };
}

export const useFooterContent = () => {
  const { footerData, loading, error, refetch } = useFooterData();

  // Transform content array into object format
  const content = {
    company_name: footerData.content.find(c => c.content_key === 'company_name')?.content_value || 'TherapySync',
    company_description: footerData.content.find(c => c.content_key === 'company_description')?.content_value || 'Advanced AI therapy platform for mental health support',
    tagline: footerData.content.find(c => c.content_key === 'tagline')?.content_value || 'Transforming mental health care through AI',
    copyright_text: footerData.content.find(c => c.content_key === 'copyright_text')?.content_value || '© 2024 TherapySync. All rights reserved.',
    version: footerData.content.find(c => c.content_key === 'version')?.content_value || 'v1.0.0',
    contact_email: footerData.content.find(c => c.content_key === 'contact_email')?.content_value || 'hello@therapysync.com'
  };

  return {
    footerData: {
      sections: footerData.sections,
      links: footerData.links,
      content
    },
    loading,
    error,
    refetch
  };
};
