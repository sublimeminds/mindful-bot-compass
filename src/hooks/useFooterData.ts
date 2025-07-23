
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FooterSection {
  id: string;
  name: string;
  label: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FooterLink {
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
}

export interface FooterContent {
  id: string;
  content_key: string;
  content_type: string;
  content_value: string;
  language_code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FooterData {
  sections: FooterSection[];
  links: FooterLink[];
  content: FooterContent[];
}

export const useFooterData = () => {
  const [footerData, setFooterData] = useState<FooterData>({
    sections: [],
    links: [],
    content: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFooterData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all footer data in parallel
      const [sectionsResult, linksResult, contentResult] = await Promise.all([
        supabase
          .from('footer_sections')
          .select('*')
          .eq('is_active', true)
          .order('position'),
        supabase
          .from('footer_links')
          .select('*')
          .eq('is_active', true)
          .order('position'),
        supabase
          .from('footer_content')
          .select('*')
          .eq('is_active', true)
      ]);

      if (sectionsResult.error) throw sectionsResult.error;
      if (linksResult.error) throw linksResult.error;
      if (contentResult.error) throw contentResult.error;

      setFooterData({
        sections: sectionsResult.data || [],
        links: linksResult.data || [],
        content: contentResult.data || []
      });
    } catch (err) {
      console.error('Error fetching footer data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch footer data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFooterData();
  }, []);

  const getContentValue = (key: string) => {
    const content = footerData.content.find(c => c.content_key === key);
    return content?.content_value || '';
  };

  const getLinksBySection = (sectionId: string) => {
    return footerData.links.filter(link => link.section_id === sectionId);
  };

  return {
    footerData,
    loading,
    error,
    refetch: fetchFooterData,
    getContentValue,
    getLinksBySection
  };
};
