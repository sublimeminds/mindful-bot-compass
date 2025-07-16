
// Updated: useScreenSize hook now available - final cache fix
import { useState, useEffect } from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024
const LAPTOP_BREAKPOINT = 1280
const DESKTOP_BREAKPOINT = 1536

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export function useScreenSize() {
  const [screenSize, setScreenSize] = useState<{
    isMobile: boolean
    isTablet: boolean  
    isLaptop: boolean
    isDesktop: boolean
    width: number
  }>({
    isMobile: false,
    isTablet: false,
    isLaptop: false,
    isDesktop: false,
    width: 0
  })

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth
      setScreenSize({
        isMobile: width < MOBILE_BREAKPOINT,
        isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
        isLaptop: width >= TABLET_BREAKPOINT && width < LAPTOP_BREAKPOINT,
        isDesktop: width >= LAPTOP_BREAKPOINT,
        width
      })
    }

    updateScreenSize()
    window.addEventListener("resize", updateScreenSize)
    return () => window.removeEventListener("resize", updateScreenSize)
  }, [])

  return screenSize
}
