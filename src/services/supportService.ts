
import { supabase } from '@/integrations/supabase/client';
import { DebugLogger } from '@/utils/debugLogger';

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags: string[];
  priority: number;
  viewCount: number;
  helpfulCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  viewCount: number;
  helpfulCount: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  category: 'technical' | 'billing' | 'feature' | 'bug' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  senderType: 'user' | 'admin';
  message: string;
  adminName?: string;
  createdAt: Date;
}

export class SupportService {
  // FAQ Methods
  static async getFAQItems(): Promise<FAQItem[]> {
    try {
      const { data, error } = await supabase
        .from('faq_items')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false })
        .order('view_count', { ascending: false });

      if (error) {
        DebugLogger.error('SupportService: Error fetching FAQ items', error, { 
          component: 'SupportService', 
          method: 'getFAQItems'
        });
        return [];
      }

      return data.map(item => ({
        id: item.id,
        category: item.category,
        question: item.question,
        answer: item.answer,
        tags: item.tags || [],
        priority: item.priority,
        viewCount: item.view_count,
        helpfulCount: item.helpful_count,
        isActive: item.is_active,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at)
      }));
    } catch (error) {
      DebugLogger.error('SupportService: Exception fetching FAQ items', error as Error, { 
        component: 'SupportService', 
        method: 'getFAQItems'
      });
      return [];
    }
  }

  static async searchFAQ(query: string): Promise<FAQItem[]> {
    try {
      const { data, error } = await supabase
        .from('faq_items')
        .select('*')
        .eq('is_active', true)
        .or(`question.ilike.%${query}%,answer.ilike.%${query}%,tags.cs.{${query}}`)
        .order('priority', { ascending: false });

      if (error) {
        DebugLogger.error('SupportService: Error searching FAQ', error, { 
          component: 'SupportService', 
          method: 'searchFAQ'
        });
        return [];
      }

      return data.map(item => ({
        id: item.id,
        category: item.category,
        question: item.question,
        answer: item.answer,
        tags: item.tags || [],
        priority: item.priority,
        viewCount: item.view_count,
        helpfulCount: item.helpful_count,
        isActive: item.is_active,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at)
      }));
    } catch (error) {
      DebugLogger.error('SupportService: Exception searching FAQ', error as Error, { 
        component: 'SupportService', 
        method: 'searchFAQ'
      });
      return [];
    }
  }

  // Help Articles Methods
  static async getHelpArticles(): Promise<HelpArticle[]> {
    try {
      const { data, error } = await supabase
        .from('help_articles')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('view_count', { ascending: false });

      if (error) {
        DebugLogger.error('SupportService: Error fetching help articles', error, { 
          component: 'SupportService', 
          method: 'getHelpArticles'
        });
        return [];
      }

      return data.map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        category: item.category,
        tags: item.tags || [],
        viewCount: item.view_count,
        helpfulCount: item.helpful_count,
        isFeatured: item.is_featured,
        isActive: item.is_active,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at)
      }));
    } catch (error) {
      DebugLogger.error('SupportService: Exception fetching help articles', error as Error, { 
        component: 'SupportService', 
        method: 'getHelpArticles'
      });
      return [];
    }
  }

  static async getHelpArticle(id: string): Promise<HelpArticle | null> {
    try {
      const { data, error } = await supabase
        .from('help_articles')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        DebugLogger.error('SupportService: Error fetching help article', error, { 
          component: 'SupportService', 
          method: 'getHelpArticle'
        });
        return null;
      }

      // Increment view count
      await supabase
        .from('help_articles')
        .update({ view_count: data.view_count + 1 })
        .eq('id', id);

      return {
        id: data.id,
        title: data.title,
        content: data.content,
        category: data.category,
        tags: data.tags || [],
        viewCount: data.view_count,
        helpfulCount: data.helpful_count,
        isFeatured: data.is_featured,
        isActive: data.is_active,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      DebugLogger.error('SupportService: Exception fetching help article', error as Error, { 
        component: 'SupportService', 
        method: 'getHelpArticle'
      });
      return null;
    }
  }

  // Support Ticket Methods
  static async createSupportTicket(ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt'>): Promise<SupportTicket | null> {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: ticket.userId,
          subject: ticket.subject,
          description: ticket.description,
          category: ticket.category,
          priority: ticket.priority,
          status: ticket.status
        })
        .select()
        .single();

      if (error) {
        DebugLogger.error('SupportService: Error creating support ticket', error, { 
          component: 'SupportService', 
          method: 'createSupportTicket'
        });
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        subject: data.subject,
        description: data.description,
        category: data.category,
        priority: data.priority,
        status: data.status,
        assignedTo: data.assigned_to,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      DebugLogger.error('SupportService: Exception creating support ticket', error as Error, { 
        component: 'SupportService', 
        method: 'createSupportTicket'
      });
      return null;
    }
  }

  static async getUserSupportTickets(userId: string): Promise<SupportTicket[]> {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        DebugLogger.error('SupportService: Error fetching user support tickets', error, { 
          component: 'SupportService', 
          method: 'getUserSupportTickets'
        });
        return [];
      }

      return data.map(item => ({
        id: item.id,
        userId: item.user_id,
        subject: item.subject,
        description: item.description,
        category: item.category,
        priority: item.priority,
        status: item.status,
        assignedTo: item.assigned_to,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at)
      }));
    } catch (error) {
      DebugLogger.error('SupportService: Exception fetching user support tickets', error as Error, { 
        component: 'SupportService', 
        method: 'getUserSupportTickets'
      });
      return [];
    }
  }

  static async addSupportMessage(message: Omit<SupportMessage, 'id' | 'createdAt'>): Promise<SupportMessage | null> {
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .insert({
          ticket_id: message.ticketId,
          sender_type: message.senderType,
          message: message.message,
          admin_name: message.adminName
        })
        .select()
        .single();

      if (error) {
        DebugLogger.error('SupportService: Error adding support message', error, { 
          component: 'SupportService', 
          method: 'addSupportMessage'
        });
        return null;
      }

      return {
        id: data.id,
        ticketId: data.ticket_id,
        senderType: data.sender_type,
        message: data.message,
        adminName: data.admin_name,
        createdAt: new Date(data.created_at)
      };
    } catch (error) {
      DebugLogger.error('SupportService: Exception adding support message', error as Error, { 
        component: 'SupportService', 
        method: 'addSupportMessage'
      });
      return null;
    }
  }

  static async getTicketMessages(ticketId: string): Promise<SupportMessage[]> {
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) {
        DebugLogger.error('SupportService: Error fetching ticket messages', error, { 
          component: 'SupportService', 
          method: 'getTicketMessages'
        });
        return [];
      }

      return data.map(item => ({
        id: item.id,
        ticketId: item.ticket_id,
        senderType: item.sender_type,
        message: item.message,
        adminName: item.admin_name,
        createdAt: new Date(item.created_at)
      }));
    } catch (error) {
      DebugLogger.error('SupportService: Exception fetching ticket messages', error as Error, { 
        component: 'SupportService', 
        method: 'getTicketMessages'
      });
      return [];
    }
  }
}
