import { useEffect } from 'react';

export const useScrollToTop = (trigger: any) => {
  useEffect(() => {
    if (trigger !== undefined && trigger !== null) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [trigger]);
};

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};