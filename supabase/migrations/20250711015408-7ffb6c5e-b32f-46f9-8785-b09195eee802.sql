-- Create analytics and community helper functions
CREATE OR REPLACE FUNCTION get_therapist_session_metrics(therapist_id UUID)
RETURNS TABLE(
  success_rate NUMERIC,
  mood_improvement_avg NUMERIC,
  total_sessions BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(AVG(
      CASE 
        WHEN sf.mood_after > sf.mood_before THEN 1.0 
        ELSE 0.0 
      END
    ), 0.0) as success_rate,
    COALESCE(AVG(sf.mood_after - sf.mood_before), 0.0) as mood_improvement_avg,
    COUNT(*) as total_sessions
  FROM session_feedback sf
  WHERE sf.therapist_id = get_therapist_session_metrics.therapist_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get therapist review metrics
CREATE OR REPLACE FUNCTION get_therapist_review_metrics(therapist_id UUID)
RETURNS TABLE(
  average_rating NUMERIC,
  user_satisfaction NUMERIC,
  recommendation_rate NUMERIC,
  total_reviews BIGINT,
  effectiveness_areas TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(AVG(tr.overall_rating), 0.0) as average_rating,
    COALESCE(AVG((tr.overall_rating + tr.communication_rating + tr.expertise_rating + tr.empathy_rating + tr.effectiveness_rating) / 5.0), 0.0) as user_satisfaction,
    COALESCE(AVG(CASE WHEN tr.would_recommend THEN 1.0 ELSE 0.0 END), 0.0) as recommendation_rate,
    COUNT(*) as total_reviews,
    ARRAY_AGG(DISTINCT unnest(tr.specific_areas_helped)) as effectiveness_areas
  FROM therapist_reviews tr
  WHERE tr.therapist_id = get_therapist_review_metrics.therapist_id;
END;
$$ LANGUAGE plpgsql;

-- Community helper functions
CREATE OR REPLACE FUNCTION increment_post_likes(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE community_posts SET like_count = like_count + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_post_likes(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE community_posts SET like_count = GREATEST(0, like_count - 1) WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_post_comments(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE community_posts SET comment_count = comment_count + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_event_participants(event_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE community_events SET participant_count = participant_count + 1 WHERE id = event_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_event_participants(event_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE community_events SET participant_count = GREATEST(0, participant_count - 1) WHERE id = event_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_milestone_celebrations(milestone_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE community_milestones SET celebration_count = celebration_count + 1 WHERE id = milestone_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_review_helpful_count(review_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE therapist_reviews SET helpful_count = helpful_count + 1 WHERE id = review_id;
END;
$$ LANGUAGE plpgsql;