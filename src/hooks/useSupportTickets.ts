import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category: string;
  assigned_to: string | null;
  resolution_notes: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

export const useSupportTickets = (isAdmin = false) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTickets = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (!isAdmin) {
        // Regular users only see their own tickets
        query = query.eq('user_id', (await supabase.auth.getUser()).data.user?.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTickets((data as SupportTicket[]) || []);
    } catch (error) {
      console.error('Error fetching support tickets:', error);
      toast({
        title: "Error",
        description: "Failed to load support tickets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (ticketData: {
    subject: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          ...ticketData,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      setTickets(prev => [data as SupportTicket, ...prev]);
      toast({
        title: "Success",
        description: "Support ticket created successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating support ticket:', error);
      toast({
        title: "Error",
        description: "Failed to create support ticket",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateTicket = async (id: string, updates: Partial<SupportTicket>) => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTickets(prev => prev.map(ticket => ticket.id === id ? data as SupportTicket : ticket));
      toast({
        title: "Success",
        description: "Ticket updated successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error updating support ticket:', error);
      toast({
        title: "Error",
        description: "Failed to update ticket",
        variant: "destructive",
      });
      return null;
    }
  };

  const resolveTicket = async (id: string, resolutionNotes: string) => {
    return updateTicket(id, {
      status: 'resolved',
      resolution_notes: resolutionNotes,
      resolved_at: new Date().toISOString()
    });
  };

  const assignTicket = async (id: string, assignedTo: string) => {
    return updateTicket(id, {
      assigned_to: assignedTo,
      status: 'in_progress'
    });
  };

  useEffect(() => {
    fetchTickets();
  }, [isAdmin]);

  return {
    tickets,
    loading,
    fetchTickets,
    createTicket,
    updateTicket,
    resolveTicket,
    assignTicket
  };
};