// Animation mapping for navigation items based on their purpose and category
export const getAnimationForItem = (title: string, menuId?: string): string => {
  // Therapy AI Category Animations
  if (title.includes('AI') || title.includes('Therapy') || title.includes('Core')) {
    if (title.includes('Chat') || title.includes('Conversation')) return 'pulse-neural';
    if (title.includes('Personalization') || title.includes('Adaptive')) return 'breathe-mindful';
    if (title.includes('Group') || title.includes('Cultural')) return 'wave-therapy';
    if (title.includes('Voice') || title.includes('Speech')) return 'pulse-neural';
    if (title.includes('Trauma') || title.includes('Healing')) return 'glow-healing';
    if (title.includes('Mindfulness') || title.includes('CBT') || title.includes('DBT')) return 'breathe-mindful';
    return 'pulse-neural';
  }

  // Platform Category Animations
  if (title.includes('Community') || title.includes('Group') || title.includes('Social')) return 'orbit-social';
  if (title.includes('Crisis') || title.includes('Emergency') || title.includes('Alert')) return 'ping-alert';
  if (title.includes('Tracking') || title.includes('Progress') || title.includes('Mood')) return 'slide-smooth';
  if (title.includes('Family') || title.includes('Sharing') || title.includes('Account')) return 'bounce-family';
  if (title.includes('Team') || title.includes('Discovery')) return 'orbit-social';
  if (title.includes('Integration') || title.includes('Hub')) return 'connect-sync';

  // Tools & Data Category Animations
  if (title.includes('API') || title.includes('Data') || title.includes('Export')) return 'matrix-data';
  if (title.includes('Mobile') || title.includes('App')) return 'signal-mobile';
  if (title.includes('Integration') || title.includes('Sync') || title.includes('Connect')) return 'connect-sync';
  if (title.includes('Wearable') || title.includes('Device')) return 'signal-mobile';
  if (title.includes('Custom') || title.includes('Enterprise')) return 'matrix-data';
  if (title.includes('Export') || title.includes('Flow')) return 'flow-export';

  // Solutions Category Animations
  if (title.includes('Individual') || title.includes('Personal')) return 'heart-care';
  if (title.includes('Organization') || title.includes('Enterprise')) return 'expand-scale';
  if (title.includes('Security') || title.includes('HIPAA') || title.includes('Secure')) return 'shield-secure';
  if (title.includes('Healthcare') || title.includes('Provider')) return 'heart-care';
  if (title.includes('Pricing') || title.includes('Plan') || title.includes('Cost')) return 'coin-pricing';
  if (title.includes('Family') || title.includes('Families')) return 'bounce-family';

  // Resources Category Animations
  if (title.includes('Learning') || title.includes('Education') || title.includes('Library')) return 'book-open';
  if (title.includes('Blog') || title.includes('Insight') || title.includes('Article')) return 'lightbulb-idea';
  if (title.includes('Support') || title.includes('Help') || title.includes('Center')) return 'support-lift';
  if (title.includes('Research') || title.includes('Studies') || title.includes('Evidence')) return 'search-discover';
  if (title.includes('Directory') || title.includes('Find') || title.includes('Therapist')) return 'search-discover';
  if (title.includes('How') || title.includes('Works') || title.includes('Guide')) return 'book-open';

  // Default animation based on common keywords
  if (title.includes('Search') || title.includes('Find') || title.includes('Discovery')) return 'search-discover';
  if (title.includes('Secure') || title.includes('Safety') || title.includes('Protection')) return 'shield-secure';
  if (title.includes('Care') || title.includes('Health') || title.includes('Wellness')) return 'heart-care';
  if (title.includes('Learn') || title.includes('Education') || title.includes('Knowledge')) return 'book-open';
  
  return 'pulse-neural'; // Default fallback
};