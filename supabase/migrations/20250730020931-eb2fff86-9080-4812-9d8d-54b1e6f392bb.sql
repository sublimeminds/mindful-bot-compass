-- Update navigation menu icons to use new custom category icons
UPDATE navigation_menus 
SET icon = CASE 
  WHEN label = 'Therapy AI' THEN 'therapy-ai-category'
  WHEN label = 'Platform' THEN 'platform-category'
  WHEN label = 'Tools & Data' THEN 'tools-data-category'
  WHEN label = 'Solutions' THEN 'solutions-category'
  WHEN label = 'Resources' THEN 'resources-category'
  ELSE icon
END
WHERE is_active = true;