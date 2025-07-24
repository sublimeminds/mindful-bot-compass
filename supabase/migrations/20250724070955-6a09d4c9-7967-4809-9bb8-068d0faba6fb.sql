-- Reset avatar_image_url to null since we're using AI-generated images from local assets
UPDATE therapist_personalities 
SET avatar_image_url = NULL 
WHERE avatar_image_url LIKE 'https://dbwrbjjmraodegffupnx.supabase.co/storage/v1/object/public/profile-pictures/therapist-profiles/%';