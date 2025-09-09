import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { Star } from "lucide-react";

const LazyChartLoading = ({
  children,
  delay = 0,
  loadingText = "Loading chart...",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const elementRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Add delay before actually loading the component
          setTimeout(() => setShouldLoad(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={elementRef} className="chart-wrapper">
      {shouldLoad ? (
        children
      ) : (
        <div className="chart-placeholder-loading">
          <Star className="loading-icon" />
          <span>{loadingText}</span>
        </div>
      )}
    </div>
  );
};

export default LazyChartLoading;
