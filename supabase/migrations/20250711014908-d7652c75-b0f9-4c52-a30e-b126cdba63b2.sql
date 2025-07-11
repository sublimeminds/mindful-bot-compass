-- Add RLS policies for community system
-- Community posts
CREATE POLICY "Users can view community posts" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Users can create community posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own posts" ON public.community_posts FOR UPDATE USING (auth.uid() = author_id);

-- Post interactions
CREATE POLICY "Users can view post interactions" ON public.post_interactions FOR SELECT USING (true);
CREATE POLICY "Users can create interactions" ON public.post_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their interactions" ON public.post_interactions FOR UPDATE USING (auth.uid() = user_id);

-- Community events
CREATE POLICY "Users can view community events" ON public.community_events FOR SELECT USING (true);
CREATE POLICY "Users can create events" ON public.community_events FOR INSERT WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "Organizers can update events" ON public.community_events FOR UPDATE USING (auth.uid() = organizer_id);

-- Event participants
CREATE POLICY "Users can view event participants" ON public.event_participants FOR SELECT USING (true);
CREATE POLICY "Users can join events" ON public.event_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their participation" ON public.event_participants FOR UPDATE USING (auth.uid() = user_id);

-- Session feedback
CREATE POLICY "Users can create session feedback" ON public.session_feedback FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their feedback" ON public.session_feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all feedback" ON public.session_feedback FOR SELECT USING (is_admin(auth.uid()));

-- Community milestones
CREATE POLICY "Users can view shared milestones" ON public.community_milestones FOR SELECT USING (is_shared = true OR auth.uid() = user_id);
CREATE POLICY "Users can create their milestones" ON public.community_milestones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their milestones" ON public.community_milestones FOR UPDATE USING (auth.uid() = user_id);

-- Therapist reviews
CREATE POLICY "Users can view therapist reviews" ON public.therapist_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.therapist_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their reviews" ON public.therapist_reviews FOR UPDATE USING (auth.uid() = user_id);

-- Wellness challenges
CREATE POLICY "Users can view challenges" ON public.wellness_challenges FOR SELECT USING (true);
CREATE POLICY "Users can create challenges" ON public.wellness_challenges FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Challenge participants
CREATE POLICY "Users can view challenge participants" ON public.challenge_participants FOR SELECT USING (true);
CREATE POLICY "Users can join challenges" ON public.challenge_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their participation" ON public.challenge_participants FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_community_posts_author ON public.community_posts(author_id);
CREATE INDEX idx_community_posts_category ON public.community_posts(category);
CREATE INDEX idx_community_posts_created ON public.community_posts(created_at DESC);
CREATE INDEX idx_post_interactions_post ON public.post_interactions(post_id);
CREATE INDEX idx_post_interactions_user ON public.post_interactions(user_id);
CREATE INDEX idx_community_events_start ON public.community_events(start_time);
CREATE INDEX idx_community_events_type ON public.community_events(event_type);
CREATE INDEX idx_session_feedback_therapist ON public.session_feedback(therapist_id);
CREATE INDEX idx_session_feedback_date ON public.session_feedback(session_date DESC);
CREATE INDEX idx_therapist_reviews_therapist ON public.therapist_reviews(therapist_id);
CREATE INDEX idx_therapist_reviews_rating ON public.therapist_reviews(overall_rating DESC);

-- Update triggers for timestamps
CREATE TRIGGER update_community_posts_updated_at
    BEFORE UPDATE ON public.community_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_events_updated_at
    BEFORE UPDATE ON public.community_events
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_therapist_reviews_updated_at
    BEFORE UPDATE ON public.therapist_reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();