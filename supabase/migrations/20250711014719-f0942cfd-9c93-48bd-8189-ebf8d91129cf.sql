-- Create community system tables (excluding peer_connections which already exists)

-- Community posts and interactions
CREATE TABLE public.community_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  post_type TEXT NOT NULL DEFAULT 'discussion',
  category TEXT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.post_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  interaction_type TEXT NOT NULL, -- 'like', 'comment', 'share', 'report'
  comment_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Community events system
CREATE TABLE public.community_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'group_therapy', 'support_group', 'workshop', 'social'
  category TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  max_participants INTEGER,
  is_virtual BOOLEAN NOT NULL DEFAULT true,
  meeting_link TEXT,
  location TEXT,
  tags TEXT[] DEFAULT '{}',
  participant_count INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.event_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.community_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  attendance_status TEXT DEFAULT 'registered', -- 'registered', 'attended', 'no_show', 'cancelled'
  feedback_rating INTEGER,
  feedback_comment TEXT,
  UNIQUE(event_id, user_id)
);

-- Enhanced session feedback for real therapist data
CREATE TABLE public.session_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  user_id UUID NOT NULL,
  therapist_id UUID,
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  effectiveness_rating INTEGER NOT NULL CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
  comfort_rating INTEGER NOT NULL CHECK (comfort_rating >= 1 AND comfort_rating <= 5),
  communication_rating INTEGER NOT NULL CHECK (communication_rating >= 1 AND communication_rating <= 5),
  mood_before INTEGER CHECK (mood_before >= 1 AND mood_before <= 10),
  mood_after INTEGER CHECK (mood_after >= 1 AND mood_after <= 10),
  session_helpful BOOLEAN,
  would_recommend BOOLEAN,
  feedback_text TEXT,
  improvement_suggestions TEXT,
  session_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Community milestones and achievements
CREATE TABLE public.community_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  milestone_type TEXT NOT NULL, -- 'streak', 'goal_completed', 'peer_helped', 'event_attended'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  achievement_date DATE NOT NULL,
  points_earned INTEGER DEFAULT 0,
  is_shared BOOLEAN NOT NULL DEFAULT false,
  celebration_count INTEGER DEFAULT 0,
  support_count INTEGER DEFAULT 0,
  milestone_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Therapist reviews from real users
CREATE TABLE public.therapist_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id UUID NOT NULL,
  user_id UUID NOT NULL,
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  communication_rating INTEGER NOT NULL CHECK (communication_rating >= 1 AND communication_rating <= 5),
  expertise_rating INTEGER NOT NULL CHECK (expertise_rating >= 1 AND expertise_rating <= 5),
  empathy_rating INTEGER NOT NULL CHECK (empathy_rating >= 1 AND empathy_rating <= 5),
  effectiveness_rating INTEGER NOT NULL CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
  review_title TEXT,
  review_text TEXT,
  would_recommend BOOLEAN NOT NULL,
  therapy_duration_weeks INTEGER,
  improvement_percentage INTEGER,
  specific_areas_helped TEXT[],
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  is_verified BOOLEAN NOT NULL DEFAULT true,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Community wellness challenges
CREATE TABLE public.wellness_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  challenge_type TEXT NOT NULL, -- 'daily', 'weekly', 'monthly'
  category TEXT NOT NULL, -- 'mood_tracking', 'mindfulness', 'exercise', 'journaling'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  target_participants INTEGER,
  reward_points INTEGER DEFAULT 100,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.challenge_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID NOT NULL REFERENCES public.wellness_challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  joined_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completion_percentage NUMERIC(5,2) DEFAULT 0,
  days_completed INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  completion_date DATE,
  UNIQUE(challenge_id, user_id)
);

-- Enable Row Level Security for new tables
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;