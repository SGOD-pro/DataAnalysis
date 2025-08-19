import { useEffect, useRef, RefObject } from "react";

function useInViewOnce<T extends HTMLElement>(
  callback: () => void,
  options?: IntersectionObserverInit
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
        observer.unobserve(entry.target);
      }
    }, { threshold: 1, ...options });

    observer.observe(element);
    return () => observer.disconnect();
  }, [callback, options]);

  return ref;
}

export default useInViewOnce;
