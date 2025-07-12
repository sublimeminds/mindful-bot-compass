import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const InitializeKnowledgeBase = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const initializeKnowledge = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('initialize-alex-knowledge');
      
      if (error) {
        throw error;
      }

      toast({
        title: "Knowledge Base Initialized",
        description: `Successfully initialized Alex AI's knowledge base with ${data.total_entries} comprehensive entries covering: ${data.categories.join(', ')}.`,
      });
      
      console.log('Knowledge base initialization result:', data);
    } catch (error) {
      console.error('Error initializing knowledge base:', error);
      toast({
        title: "Initialization Failed",
        description: "Failed to initialize the knowledge base. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg bg-background">
      <h3 className="text-lg font-semibold mb-2">Alex AI Knowledge Base</h3>
      <p className="text-muted-foreground mb-4">
        Initialize and populate Alex AI's comprehensive knowledge base with detailed information about TherapySync's features, pricing, processes, and protocols.
      </p>
      
      <Button 
        onClick={initializeKnowledge} 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Initializing...' : 'Initialize Knowledge Base'}
      </Button>
    </div>
  );
};