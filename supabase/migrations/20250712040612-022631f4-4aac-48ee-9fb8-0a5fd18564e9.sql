-- Check the subscription_plans table structure
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'subscription_plans' AND table_schema = 'public';