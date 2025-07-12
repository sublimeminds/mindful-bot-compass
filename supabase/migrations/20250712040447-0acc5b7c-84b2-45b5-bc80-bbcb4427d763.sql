-- Check if subscription_plans table exists and what plans are there
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'subscription_plans';