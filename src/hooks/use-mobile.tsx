// Responsive design hooks for mobile/tablet/desktop detection
export { useIsMobile, useScreenSize } from './useResponsive'

// Legacy compatibility (DO NOT USE - deprecated)
// This file exists to prevent caching issues with old imports
console.warn('Importing from use-mobile is deprecated. Use useResponsive instead.')