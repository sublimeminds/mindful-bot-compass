-- Enhanced Goal Tracking System Database Updates

-- Add new columns to goals table for advanced features
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS streak_count integer DEFAULT 0;
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS best_streak integer DEFAULT 0;
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS last_progress_date date;
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS difficulty_level text DEFAULT 'medium';
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS motivation_level integer DEFAULT 5;
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS visibility text DEFAULT 'private';
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS template_id uuid;
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS parent_goal_id uuid;

-- Create goal templates table
CREATE TABLE IF NOT EXISTS public.goal_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty_level TEXT NOT NULL DEFAULT 'medium',
  estimated_duration_days INTEGER DEFAULT 30,
  target_value INTEGER NOT NULL DEFAULT 100,
  unit TEXT NOT NULL DEFAULT 'points',
  tags TEXT[] DEFAULT '{}',
  icon TEXT DEFAULT 'Target',
  is_featured BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  success_rate NUMERIC DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create goal progress history table for detailed tracking
CREATE TABLE IF NOT EXISTS public.goal_progress_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID NOT NULL,
  previous_value INTEGER NOT NULL,
  new_value INTEGER NOT NULL,
  change_amount INTEGER NOT NULL,
  progress_type TEXT NOT NULL DEFAULT 'manual', -- manual, automatic, milestone
  notes TEXT,
  mood_rating INTEGER,
  context_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create goal achievements table
CREATE TABLE IF NOT EXISTS public.goal_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  goal_id UUID,
  achievement_type TEXT NOT NULL, -- streak, completion, milestone, improvement
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  points_earned INTEGER DEFAULT 0,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Create goal sharing table for collaboration
CREATE TABLE IF NOT EXISTS public.goal_sharing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID NOT NULL,
  shared_by UUID NOT NULL,
  shared_with UUID NOT NULL,
  permission_level TEXT NOT NULL DEFAULT 'view', -- view, comment, encourage
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Create goal insights table for AI recommendations
CREATE TABLE IF NOT EXISTS public.goal_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  goal_id UUID,
  insight_type TEXT NOT NULL, -- recommendation, warning, celebration, tip
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  confidence_score NUMERIC DEFAULT 0.5,
  priority INTEGER DEFAULT 5,
  action_items TEXT[] DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE,
  viewed_at TIMESTAMP WITH TIME ZONE,
  acted_upon_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.goal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_progress_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_sharing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies for goal_templates (public read)
CREATE POLICY "Anyone can view goal templates" ON public.goal_templates FOR SELECT USING (true);

-- RLS Policies for goal_progress_history
CREATE POLICY "Users can view their goal progress history" ON public.goal_progress_history 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.goals 
    WHERE goals.id = goal_progress_history.goal_id 
    AND goals.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create progress history for their goals" ON public.goal_progress_history 
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.goals 
    WHERE goals.id = goal_progress_history.goal_id 
    AND goals.user_id = auth.uid()
  )
);

-- RLS Policies for goal_achievements
CREATE POLICY "Users can view their achievements" ON public.goal_achievements 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their achievements" ON public.goal_achievements 
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for goal_sharing
CREATE POLICY "Users can view shared goals" ON public.goal_sharing 
FOR SELECT USING (auth.uid() = shared_by OR auth.uid() = shared_with);

CREATE POLICY "Users can share their goals" ON public.goal_sharing 
FOR INSERT WITH CHECK (
  auth.uid() = shared_by AND
  EXISTS (
    SELECT 1 FROM public.goals 
    WHERE goals.id = goal_sharing.goal_id 
    AND goals.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update goal sharing they're involved in" ON public.goal_sharing 
FOR UPDATE USING (auth.uid() = shared_by OR auth.uid() = shared_with);

-- RLS Policies for goal_insights
CREATE POLICY "Users can view their goal insights" ON public.goal_insights 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create goal insights" ON public.goal_insights 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their goal insights" ON public.goal_insights 
FOR UPDATE USING (auth.uid() = user_id);

-- Add triggers for updated_at columns
CREATE OR REPLACE FUNCTION public.update_goal_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_goal_templates_updated_at
    BEFORE UPDATE ON public.goal_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.update_goal_templates_updated_at();

-- Insert sample goal templates
INSERT INTO public.goal_templates (name, description, category, difficulty_level, target_value, unit, tags, icon, is_featured) VALUES
('Daily Mindfulness Practice', 'Establish a consistent daily mindfulness routine to reduce stress and improve focus', 'Mental Wellness', 'easy', 30, 'days', '{"mindfulness", "daily-habit", "stress-relief"}', 'Brain', true),
('Anxiety Management', 'Practice anxiety reduction techniques and track your progress', 'Mental Health', 'medium', 100, 'points', '{"anxiety", "coping-skills", "mental-health"}', 'Heart', true),
('Sleep Quality Improvement', 'Maintain consistent sleep schedule and improve sleep quality', 'Physical Health', 'medium', 8, 'hours-average', '{"sleep", "health", "routine"}', 'Moon', true),
('Exercise Routine', 'Build a regular exercise habit for physical and mental wellbeing', 'Physical Health', 'medium', 20, 'sessions', '{"exercise", "health", "fitness"}', 'Activity', true),
('Gratitude Practice', 'Daily gratitude journaling to improve overall mood and perspective', 'Mental Wellness', 'easy', 30, 'entries', '{"gratitude", "journaling", "positivity"}', 'Heart', true),
('Social Connection', 'Strengthen relationships and build meaningful social connections', 'Social', 'medium', 10, 'interactions', '{"relationships", "social", "connection"}', 'Users', false),
('Therapy Session Attendance', 'Consistent attendance at therapy sessions for personal growth', 'Mental Health', 'easy', 12, 'sessions', '{"therapy", "mental-health", "growth"}', 'MessageCircle', false),
('Stress Reduction', 'Learn and practice stress management techniques', 'Mental Wellness', 'medium', 50, 'techniques-practiced', '{"stress", "relaxation", "coping"}', 'Shield', false);

-- Create function to update goal streaks
CREATE OR REPLACE FUNCTION public.update_goal_streak(goal_id_param UUID)
RETURNS VOID AS $$
DECLARE
    goal_record RECORD;
    today DATE;
    yesterday DATE;
BEGIN
    today := CURRENT_DATE;
    yesterday := today - INTERVAL '1 day';
    
    -- Get goal info
    SELECT * INTO goal_record FROM public.goals WHERE id = goal_id_param;
    
    IF goal_record.last_progress_date = today THEN
        -- Already updated today, no change
        RETURN;
    ELSIF goal_record.last_progress_date = yesterday THEN
        -- Continuous streak
        UPDATE public.goals 
        SET 
            streak_count = streak_count + 1,
            best_streak = GREATEST(best_streak, streak_count + 1),
            last_progress_date = today
        WHERE id = goal_id_param;
    ELSE
        -- Streak broken or first time
        UPDATE public.goals 
        SET 
            streak_count = 1,
            best_streak = GREATEST(best_streak, 1),
            last_progress_date = today
        WHERE id = goal_id_param;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;