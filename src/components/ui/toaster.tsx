
import React from 'react';
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  // Enhanced safety check for React hooks availability
  if (typeof React === 'undefined' || !React.useState || !React.useEffect) {
    console.warn('Toaster: React hooks not available, skipping render');
    return null;
  }

  // Ensure React context is available
  if (typeof React.createContext === 'undefined') {
    console.warn('Toaster: React context not available, skipping render');
    return null;
  }

  try {
    const { toasts } = useToast();

    // Additional safety check - ensure toasts is an array
    if (!Array.isArray(toasts)) {
      console.warn('Toaster: Invalid toasts data, skipping render');
      return null;
    }

    return (
      <ToastProvider>
        {toasts.map(function ({ id, title, description, action, ...props }) {
          return (
            <Toast key={id} {...props}>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              {action}
              <ToastClose />
            </Toast>
          )
        })}
        <ToastViewport />
      </ToastProvider>
    )
  } catch (error) {
    console.warn('Toaster: Error rendering toaster component:', error);
    return null;
  }
}
