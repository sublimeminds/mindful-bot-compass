INSERT INTO navigation_menu_items (
  menu_id,
  title,
  description,
  href,
  icon,
  gradient,
  position,
  is_active
) VALUES (
  (SELECT id FROM navigation_menus WHERE name = 'therapy-ai' LIMIT 1),
  'Therapy Types Overview',
  'Comprehensive overview of all therapy types and methodologies available',
  '/therapy-types-overview',
  'therapy-types-overview',
  'from-therapy-400 via-therapy-500 to-therapy-600',
  11,
  true
);