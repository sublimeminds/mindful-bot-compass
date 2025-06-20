
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
  // Check if React is properly initialized
  if (typeof React === 'undefined' || !React.useState) {
    console.warn('Toaster: React not properly initialized, returning null');
    return null;
  }

  try {
    const { toasts } = useToast();

    // Safety check for toasts
    if (!Array.isArray(toasts)) {
      console.warn('Toaster: Invalid toasts data');
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
    console.error('Toaster: Error in component:', error);
    return null;
  }
}
