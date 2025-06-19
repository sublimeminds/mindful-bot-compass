
-- Create tables for community and peer support features

-- Table for support groups
CREATE TABLE public.support_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- e.g., 'anxiety', 'depression', 'grief', 'addiction'
  group_type TEXT NOT NULL DEFAULT 'open', -- 'open', 'closed', 'moderated'
  max_members INTEGER DEFAULT 50,
  current_members INTEGER DEFAULT 0,
  moderator_id UUID REFERENCES auth.users(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for group memberships
CREATE TABLE public.group_memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES public.support_groups(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member', -- 'member', 'moderator', 'admin'
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(user_id, group_id)
);

-- Table for group discussions/posts
CREATE TABLE public.group_discussions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.support_groups(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  reply_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for discussion replies
CREATE TABLE public.discussion_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID NOT NULL REFERENCES public.group_discussions(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for peer support connections
CREATE TABLE public.peer_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requested_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'declined', 'blocked'
  connection_type TEXT NOT NULL DEFAULT 'support', -- 'support', 'accountability', 'friendship'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(requester_id, requested_id)
);

-- Table for shared milestones and achievements
CREATE TABLE public.shared_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  milestone_type TEXT NOT NULL, -- 'goal_completed', 'streak_achieved', 'therapy_milestone'
  title TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  celebration_count INTEGER DEFAULT 0,
  support_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for support_groups
ALTER TABLE public.support_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active support groups" 
  ON public.support_groups 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Moderators can manage their groups" 
  ON public.support_groups 
  FOR ALL
  USING (auth.uid() = moderator_id);

-- Add RLS policies for group_memberships
ALTER TABLE public.group_memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view group memberships" 
  ON public.group_memberships 
  FOR SELECT 
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.group_memberships gm 
    WHERE gm.group_id = group_memberships.group_id 
    AND gm.user_id = auth.uid() 
    AND gm.is_active = true
  ));

CREATE POLICY "Users can manage their own memberships" 
  ON public.group_memberships 
  FOR ALL
  USING (auth.uid() = user_id);

-- Add RLS policies for group_discussions
ALTER TABLE public.group_discussions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group members can view discussions" 
  ON public.group_discussions 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.group_memberships gm 
    WHERE gm.group_id = group_discussions.group_id 
    AND gm.user_id = auth.uid() 
    AND gm.is_active = true
  ));

CREATE POLICY "Group members can create discussions" 
  ON public.group_discussions 
  FOR INSERT 
  WITH CHECK (auth.uid() = author_id AND EXISTS (
    SELECT 1 FROM public.group_memberships gm 
    WHERE gm.group_id = group_discussions.group_id 
    AND gm.user_id = auth.uid() 
    AND gm.is_active = true
  ));

CREATE POLICY "Authors can update their discussions" 
  ON public.group_discussions 
  FOR UPDATE 
  USING (auth.uid() = author_id);

-- Add RLS policies for discussion_replies
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group members can view replies" 
  ON public.discussion_replies 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.group_discussions gd
    JOIN public.group_memberships gm ON gm.group_id = gd.group_id
    WHERE gd.id = discussion_replies.discussion_id 
    AND gm.user_id = auth.uid() 
    AND gm.is_active = true
  ));

CREATE POLICY "Group members can create replies" 
  ON public.discussion_replies 
  FOR INSERT 
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their replies" 
  ON public.discussion_replies 
  FOR UPDATE 
  USING (auth.uid() = author_id);

-- Add RLS policies for peer_connections
ALTER TABLE public.peer_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own connections" 
  ON public.peer_connections 
  FOR SELECT 
  USING (auth.uid() = requester_id OR auth.uid() = requested_id);

CREATE POLICY "Users can create connection requests" 
  ON public.peer_connections 
  FOR INSERT 
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update connections they're part of" 
  ON public.peer_connections 
  FOR UPDATE 
  USING (auth.uid() = requester_id OR auth.uid() = requested_id);

-- Add RLS policies for shared_milestones
ALTER TABLE public.shared_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view public milestones" 
  ON public.shared_milestones 
  FOR SELECT 
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own milestones" 
  ON public.shared_milestones 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own milestones" 
  ON public.shared_milestones 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_support_groups_updated_at
  BEFORE UPDATE ON public.support_groups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_group_discussions_updated_at
  BEFORE UPDATE ON public.group_discussions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_discussion_replies_updated_at
  BEFORE UPDATE ON public.discussion_replies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_peer_connections_updated_at
  BEFORE UPDATE ON public.peer_connections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
