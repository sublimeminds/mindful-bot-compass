
-- Create conversation_memory table for storing therapy session insights
CREATE TABLE public.conversation_memory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  session_id UUID,
  memory_type TEXT NOT NULL CHECK (memory_type IN ('insight', 'breakthrough', 'concern', 'goal', 'pattern', 'trigger', 'technique', 'relationship', 'crisis')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  emotional_context JSONB DEFAULT '{}',
  importance_score NUMERIC NOT NULL DEFAULT 0.5 CHECK (importance_score >= 0 AND importance_score <= 1),
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create emotional_patterns table for tracking user emotional patterns
CREATE TABLE public.emotional_patterns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  pattern_type TEXT NOT NULL CHECK (pattern_type IN ('trigger', 'coping_strategy', 'mood_cycle', 'stress_response', 'emotional_regulation')),
  pattern_data JSONB NOT NULL DEFAULT '{}',
  frequency_score NUMERIC NOT NULL DEFAULT 0,
  effectiveness_score NUMERIC NOT NULL DEFAULT 0.5 CHECK (effectiveness_score >= 0 AND effectiveness_score <= 1),
  last_occurred TIMESTAMP WITH TIME ZONE,
  first_identified TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create session_context table for managing session priorities and follow-ups
CREATE TABLE public.session_context (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  session_id UUID,
  context_type TEXT NOT NULL CHECK (context_type IN ('agenda', 'follow_up', 'concern_check', 'technique_review', 'crisis_assessment')),
  priority_level INTEGER NOT NULL DEFAULT 5 CHECK (priority_level >= 1 AND priority_level <= 10),
  context_data JSONB NOT NULL DEFAULT '{}',
  requires_attention BOOLEAN NOT NULL DEFAULT false,
  addressed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create therapeutic_relationship table for tracking AI-user relationship
CREATE TABLE public.therapeutic_relationship (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  therapist_id UUID,
  trust_level NUMERIC NOT NULL DEFAULT 0.5 CHECK (trust_level >= 0 AND trust_level <= 1),
  rapport_score NUMERIC NOT NULL DEFAULT 0.5 CHECK (rapport_score >= 0 AND rapport_score <= 1),
  communication_preferences JSONB DEFAULT '{}',
  effective_techniques TEXT[] DEFAULT '{}',
  ineffective_techniques TEXT[] DEFAULT '{}',
  boundary_preferences JSONB DEFAULT '{}',
  last_interaction TIMESTAMP WITH TIME ZONE,
  relationship_milestones JSONB[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create FAQ items table
CREATE TABLE public.faq_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  priority INTEGER NOT NULL DEFAULT 5,
  view_count INTEGER NOT NULL DEFAULT 0,
  helpful_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create help articles table
CREATE TABLE public.help_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER NOT NULL DEFAULT 0,
  helpful_count INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create support tickets table
CREATE TABLE public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('technical', 'billing', 'feature', 'bug', 'other')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  assigned_to UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create support messages table for ticket conversations
CREATE TABLE public.support_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID REFERENCES public.support_tickets NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'admin')),
  message TEXT NOT NULL,
  admin_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.conversation_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotional_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapeutic_relationship ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.help_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for conversation_memory
CREATE POLICY "Users can view their own memories" ON public.conversation_memory FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own memories" ON public.conversation_memory FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own memories" ON public.conversation_memory FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for emotional_patterns
CREATE POLICY "Users can view their own patterns" ON public.emotional_patterns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own patterns" ON public.emotional_patterns FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own patterns" ON public.emotional_patterns FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for session_context
CREATE POLICY "Users can view their own context" ON public.session_context FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own context" ON public.session_context FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own context" ON public.session_context FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for therapeutic_relationship
CREATE POLICY "Users can view their own relationship" ON public.therapeutic_relationship FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own relationship" ON public.therapeutic_relationship FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own relationship" ON public.therapeutic_relationship FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for FAQ items (public read)
CREATE POLICY "Anyone can view active FAQ items" ON public.faq_items FOR SELECT USING (is_active = true);

-- RLS policies for help articles (public read)
CREATE POLICY "Anyone can view active help articles" ON public.help_articles FOR SELECT USING (is_active = true);

-- RLS policies for support tickets
CREATE POLICY "Users can view their own tickets" ON public.support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own tickets" ON public.support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tickets" ON public.support_tickets FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for support messages
CREATE POLICY "Users can view messages for their tickets" ON public.support_messages 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.support_tickets 
      WHERE id = ticket_id AND user_id = auth.uid()
    )
  );
CREATE POLICY "Users can create messages for their tickets" ON public.support_messages 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.support_tickets 
      WHERE id = ticket_id AND user_id = auth.uid()
    )
  );

-- Insert sample FAQ data
INSERT INTO public.faq_items (category, question, answer, tags, priority) VALUES
('Getting Started', 'How do I start my first therapy session?', 'To start your first therapy session, go to the Therapy page and click "Start New Session". You''ll be guided through selecting a therapist personality that matches your needs.', ARRAY['therapy', 'getting-started'], 10),
('Getting Started', 'What should I expect from my first session?', 'Your first session will focus on understanding your goals and concerns. The AI therapist will ask questions to get to know you better and establish a comfortable therapeutic relationship.', ARRAY['therapy', 'expectations'], 9),
('Billing', 'How does the subscription work?', 'We offer Free, Pro, and Premium plans. The Free plan includes basic features, while paid plans unlock advanced therapy features, unlimited sessions, and personalized insights.', ARRAY['billing', 'subscription'], 8),
('Technical Support', 'Why isn''t my mood data syncing?', 'Mood data syncing issues are usually resolved by refreshing the page. If the problem persists, try logging out and back in, or contact our support team.', ARRAY['mood-tracking', 'technical'], 7),
('Therapy Features', 'Can I change my therapist personality?', 'Yes! You can change your therapist personality at any time by going to your Profile settings and selecting a new therapist that better matches your current needs.', ARRAY['therapy', 'personalization'], 8);

-- Insert sample help articles
INSERT INTO public.help_articles (title, content, category, tags, is_featured) VALUES
('Getting Started with Therapy Sessions', 'This comprehensive guide will walk you through starting your first therapy session, selecting the right therapist personality, and making the most of your therapeutic experience...', 'Getting Started', ARRAY['therapy', 'guide'], true),
('Understanding Mood Tracking', 'Learn how to effectively track your mood, understand the different metrics, and use mood data to improve your mental health journey...', 'Features', ARRAY['mood-tracking', 'analytics'], true),
('Setting and Achieving Goals', 'Goal setting is a crucial part of therapy. This article explains how to set SMART goals, track progress, and celebrate achievements...', 'Features', ARRAY['goals', 'progress'], false),
('Privacy and Data Security', 'Your privacy is our top priority. Learn about how we protect your data, what information we collect, and your rights as a user...', 'Privacy', ARRAY['privacy', 'security'], true);
