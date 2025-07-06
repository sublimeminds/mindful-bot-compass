import React from 'react';
import { isReactReady } from '@/utils/reactSafeGuard';

/**
 * Safe hook wrapper that prevents React hook execution when React isn't ready
 */
export function useSafeReactHook<T>(
  hookFn: () => T,
  fallbackValue: T,
  hookName: string = 'unknown'
): T {
  if (!isReactReady()) {
    console.warn(`useSafeReactHook: ${hookName} called before React ready, using fallback`);
    return fallbackValue;
  }

  try {
    return hookFn();
  } catch (error) {
    console.error(`useSafeReactHook: Error in ${hookName}:`, error);
    return fallbackValue;
  }
}

/**
 * Safe useEffect wrapper
 */
export function useSafeEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList,
  componentName: string = 'Component'
): void {
  if (!isReactReady()) {
    console.warn(`useSafeEffect: ${componentName} effect skipped, React not ready`);
    return;
  }

  try {
    React.useEffect(effect, deps);
  } catch (error) {
    console.error(`useSafeEffect: Error in ${componentName}:`, error);
  }
}

/**
 * Safe useState wrapper
 */
export function useSafeState<T>(
  initialState: T | (() => T),
  componentName: string = 'Component'
): [T, React.Dispatch<React.SetStateAction<T>>] {
  if (!isReactReady()) {
    console.warn(`useSafeState: ${componentName} state skipped, React not ready`);
    const fallbackValue = typeof initialState === 'function' 
      ? (initialState as () => T)() 
      : initialState;
    return [fallbackValue, () => {}] as [T, React.Dispatch<React.SetStateAction<T>>];
  }

  try {
    return React.useState(initialState);
  } catch (error) {
    console.error(`useSafeState: Error in ${componentName}:`, error);
    const fallbackValue = typeof initialState === 'function' 
      ? (initialState as () => T)() 
      : initialState;
    return [fallbackValue, () => {}] as [T, React.Dispatch<React.SetStateAction<T>>];
  }
}