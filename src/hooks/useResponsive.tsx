import { useState, useEffect } from "react"

// Screen size breakpoints for responsive design
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  laptop: 1280,
  desktop: 1536,
} as const

type ScreenSize = {
  isMobile: boolean
  isTablet: boolean  
  isLaptop: boolean
  isDesktop: boolean
  width: number
}

// Mobile detection hook
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < BREAKPOINTS.mobile
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const mql = window.matchMedia(`(max-width: ${BREAKPOINTS.mobile - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.mobile)
    }
    
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < BREAKPOINTS.mobile)
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}

// Screen size detection hook with all breakpoint information
export function useScreenSize(): ScreenSize {
  const [screenSize, setScreenSize] = useState<ScreenSize>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isLaptop: false,
        isDesktop: false,
        width: 0
      }
    }
    
    const width = window.innerWidth
    return {
      isMobile: width < BREAKPOINTS.mobile,
      isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet,
      isLaptop: width >= BREAKPOINTS.tablet && width < BREAKPOINTS.laptop,
      isDesktop: width >= BREAKPOINTS.laptop,
      width
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const updateScreenSize = () => {
      const width = window.innerWidth
      setScreenSize({
        isMobile: width < BREAKPOINTS.mobile,
        isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet,
        isLaptop: width >= BREAKPOINTS.tablet && width < BREAKPOINTS.laptop,
        isDesktop: width >= BREAKPOINTS.laptop,
        width
      })
    }

    updateScreenSize()
    window.addEventListener("resize", updateScreenSize)
    return () => window.removeEventListener("resize", updateScreenSize)
  }, [])

  return screenSize
}

// Export both hooks as default and named exports
export default { useIsMobile, useScreenSize }