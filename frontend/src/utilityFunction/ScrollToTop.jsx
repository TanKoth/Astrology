import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top-left of the window
  }, [pathname]); // Re-run effect whenever the pathname changes

  return null; // This component doesn't render any UI
}
