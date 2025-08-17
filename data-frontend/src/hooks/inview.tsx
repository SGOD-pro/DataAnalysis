import { useEffect, useRef, useState, RefObject } from "react";
type UseInViewOptions = IntersectionObserverInit & {
  once?: boolean;
};
function useInView<T extends HTMLElement>(
  options?: UseInViewOptions
): [RefObject<T>, boolean] {
  const ref = useRef<T | null>(null); // ✅ allow null
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);

          if (options?.once) {
            observer.unobserve(entry.target); // 👈 stop observing after first hit
          }
        } else if (!options?.once) {
          setIsInView(false);
        }
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [options]);

  return [ref as RefObject<T>, isInView]; // ✅ cast back to RefObject<T>
}

export default useInView;
