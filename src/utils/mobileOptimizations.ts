
// Mobile optimization utilities
export class MobileOptimizer {
  private static instance: MobileOptimizer;

  static getInstance(): MobileOptimizer {
    if (!MobileOptimizer.instance) {
      MobileOptimizer.instance = new MobileOptimizer();
    }
    return MobileOptimizer.instance;
  }

  // Check if device is mobile
  isMobileDevice(): boolean {
    return window.innerWidth < 768;
  }

  // Check if device has touch capability
  isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  // Optimize button sizes for mobile
  optimizeButtonSize(element: HTMLElement): void {
    if (this.isMobileDevice()) {
      const currentHeight = element.offsetHeight;
      if (currentHeight < 44) {
        element.style.minHeight = '44px';
        element.style.minWidth = '44px';
      }
    }
  }

  // Add touch-friendly spacing
  addTouchSpacing(element: HTMLElement): void {
    if (this.isTouchDevice()) {
      element.style.padding = '12px 16px';
      element.style.margin = '8px 0';
    }
  }

  // Optimize form inputs for mobile
  optimizeFormInputs(): void {
    if (this.isMobileDevice()) {
      const inputs = document.querySelectorAll('input, textarea, select');
      inputs.forEach((input) => {
        const element = input as HTMLElement;
        element.style.fontSize = '16px'; // Prevent zoom on iOS
        element.style.minHeight = '44px';
      });
    }
  }

  // Handle mobile viewport
  setupMobileViewport(): void {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
      document.head.appendChild(meta);
    }
  }

  // Handle iOS safe areas
  setupSafeAreas(): void {
    if (this.isIOS()) {
      document.documentElement.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)');
      document.documentElement.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
      document.documentElement.style.setProperty('--safe-area-inset-left', 'env(safe-area-inset-left)');
      document.documentElement.style.setProperty('--safe-area-inset-right', 'env(safe-area-inset-right)');
    }
  }

  // Check if device is iOS
  isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  // Prevent pull-to-refresh on iOS
  preventPullToRefresh(): void {
    if (this.isIOS()) {
      document.addEventListener('touchstart', (e) => {
        if (window.scrollY === 0 && e.touches[0].clientY > 0) {
          // Allow if it's a designated pull-to-refresh area
          const target = e.target as HTMLElement;
          if (!target.closest('[data-pull-to-refresh]')) {
            e.preventDefault();
          }
        }
      }, { passive: false });
    }
  }

  // Optimize images for mobile
  optimizeImages(): void {
    if (this.isMobileDevice()) {
      const images = document.querySelectorAll('img');
      images.forEach((img) => {
        // Add loading="lazy" for performance
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
        // Add responsive classes
        if (!img.classList.contains('responsive')) {
          img.classList.add('max-w-full', 'h-auto');
        }
      });
    }
  }

  // Handle mobile scroll behavior
  optimizeScrollBehavior(): void {
    if (this.isMobileDevice()) {
      // Smooth scrolling
      document.documentElement.style.scrollBehavior = 'smooth';
      
      // Optimize momentum scrolling on iOS
      if (this.isIOS()) {
        document.body.style.webkitOverflowScrolling = 'touch';
      }
    }
  }

  // Initialize all mobile optimizations
  initialize(): void {
    this.setupMobileViewport();
    this.setupSafeAreas();
    this.preventPullToRefresh();
    this.optimizeFormInputs();
    this.optimizeImages();
    this.optimizeScrollBehavior();
    
    // Re-optimize on resize
    window.addEventListener('resize', () => {
      this.optimizeFormInputs();
      this.optimizeImages();
    });
  }
}

// Export singleton instance
export const mobileOptimizer = MobileOptimizer.getInstance();

// React hook for mobile optimizations
export const useMobileOptimizations = () => {
  React.useEffect(() => {
    mobileOptimizer.initialize();
  }, []);

  return {
    isMobile: mobileOptimizer.isMobileDevice(),
    isTouch: mobileOptimizer.isTouchDevice(),
    isIOS: mobileOptimizer.isIOS(),
    optimizeButton: mobileOptimizer.optimizeButtonSize.bind(mobileOptimizer),
    addTouchSpacing: mobileOptimizer.addTouchSpacing.bind(mobileOptimizer),
  };
};
