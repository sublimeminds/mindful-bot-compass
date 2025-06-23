
import React from "react"

type ToasterProps = {
  theme?: "light" | "dark" | "system"
  className?: string
}

const Toaster = ({ theme = "system", className, ...props }: ToasterProps) => {
  // Simplified toaster without next-themes dependency for now
  console.log('Sonner toaster rendered with theme:', theme)
  
  return null // Temporarily disabled to avoid React hook issues
}

const toast = (message: string, options?: { description?: string; duration?: number }) => {
  console.log('Toast message:', message, options)
  // Simplified toast function
}

export { Toaster, toast }
