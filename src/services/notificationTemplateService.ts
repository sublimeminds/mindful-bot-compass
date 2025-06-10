
import { supabase } from '@/integrations/supabase/client';

export interface NotificationTemplate {
  id: string;
  name: string;
  type: 'session_reminder' | 'milestone_achieved' | 'insight_generated' | 'mood_check' | 'progress_update';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class NotificationTemplateService {
  static async getTemplates(): Promise<NotificationTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('notification_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notification templates:', error);
        return [];
      }

      return data?.map(template => ({
        id: template.id,
        name: template.name,
        type: template.type as NotificationTemplate['type'],
        title: template.title,
        message: template.message,
        priority: template.priority as NotificationTemplate['priority'],
        variables: template.variables || [],
        isActive: template.is_active,
        createdAt: new Date(template.created_at),
        updatedAt: new Date(template.updated_at)
      })) || [];
    } catch (error) {
      console.error('Error in getTemplates:', error);
      return [];
    }
  }

  static async getTemplateByType(type: string): Promise<NotificationTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('notification_templates')
        .select('*')
        .eq('type', type)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching template by type:', error);
        return null;
      }

      if (!data) return null;

      return {
        id: data.id,
        name: data.name,
        type: data.type as NotificationTemplate['type'],
        title: data.title,
        message: data.message,
        priority: data.priority as NotificationTemplate['priority'],
        variables: data.variables || [],
        isActive: data.is_active,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error in getTemplateByType:', error);
      return null;
    }
  }

  static async createTemplate(template: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notification_templates')
        .insert({
          name: template.name,
          type: template.type,
          title: template.title,
          message: template.message,
          priority: template.priority,
          variables: template.variables,
          is_active: template.isActive
        });

      if (error) {
        console.error('Error creating notification template:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in createTemplate:', error);
      return false;
    }
  }

  static processTemplate(template: NotificationTemplate, variables: Record<string, any>): { title: string; message: string } {
    let processedTitle = template.title;
    let processedMessage = template.message;

    // Replace variables in title and message
    template.variables.forEach(variable => {
      const value = variables[variable] || '';
      const placeholder = `{{${variable}}}`;
      processedTitle = processedTitle.replace(new RegExp(placeholder, 'g'), value);
      processedMessage = processedMessage.replace(new RegExp(placeholder, 'g'), value);
    });

    return {
      title: processedTitle,
      message: processedMessage
    };
  }
}
