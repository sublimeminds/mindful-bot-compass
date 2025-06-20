
import React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Comprehensive React safety check
  if (typeof React === 'undefined' || React === null || !React.useState || !React.useEffect) {
    console.warn('useIsMobile: React hooks not available, returning false');
    return false;
  }

  try {
    const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

    React.useEffect(() => {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
      const onChange = () => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      }
      mql.addEventListener("change", onChange)
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      return () => mql.removeEventListener("change", onChange)
    }, [])

    return !!isMobile
  } catch (error) {
    console.error('useIsMobile: Error using React hooks:', error);
    return false;
  }
}
