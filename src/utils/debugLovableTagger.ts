/**
 * Debug utility for lovable-tagger issues
 * Helps identify and diagnose lovable-tagger related errors
 */

export const debugLovableTagger = () => {
  const results = {
    timestamp: new Date().toISOString(),
    windowExists: typeof window !== 'undefined',
    lovExists: false,
    lovStructure: null as any,
    errors: [] as string[],
    recommendations: [] as string[]
  };

  try {
    if (typeof window !== 'undefined') {
      results.lovExists = !!(window as any).lov;
      
      if ((window as any).lov) {
        results.lovStructure = {
          initialized: (window as any).lov.initialized,
          tagger: !!(window as any).lov.tagger,
          config: !!(window as any).lov.config,
          utils: !!(window as any).lov.utils,
          type: typeof (window as any).lov
        };
      }
    } else {
      results.errors.push('Window object not available (server-side rendering)');
    }
  } catch (error) {
    results.errors.push(`Error accessing window.lov: ${error}`);
  }

  // Generate recommendations
  if (!results.windowExists) {
    results.recommendations.push('Ensure this code runs in browser environment only');
  }
  
  if (!results.lovExists) {
    results.recommendations.push('Initialize lovable-tagger using initializeLovableTagger()');
  }
  
  if (results.lovStructure && !results.lovStructure.initialized) {
    results.recommendations.push('Lovable-tagger exists but not properly initialized');
  }

  return results;
};

export const logLovableTaggerStatus = () => {
  const debug = debugLovableTagger();
  
  console.group('🔍 Lovable Tagger Debug Status');
  console.log('Timestamp:', debug.timestamp);
  console.log('Window exists:', debug.windowExists);
  console.log('Lov exists:', debug.lovExists);
  
  if (debug.lovStructure) {
    console.log('Lov structure:', debug.lovStructure);
  }
  
  if (debug.errors.length > 0) {
    console.warn('Errors:', debug.errors);
  }
  
  if (debug.recommendations.length > 0) {
    console.info('Recommendations:', debug.recommendations);
  }
  
  console.groupEnd();
  
  return debug;
};

// Auto-log on import in development
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    logLovableTaggerStatus();
  }, 1000);
}