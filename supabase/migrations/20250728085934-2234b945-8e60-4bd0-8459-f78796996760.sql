-- Add therapy types overview to navigation menu items
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
  (SELECT id FROM navigation_menus WHERE name = 'therapy-ai' AND is_active = true LIMIT 1),
  'Therapy Types Overview',
  'Explore 70+ evidence-based therapy approaches powered by our AI system',
  '/therapy-types-overview',
  'therapy-types-overview',
  'from-therapy-400 via-harmony-500 to-balance-600',
  20,
  true
);