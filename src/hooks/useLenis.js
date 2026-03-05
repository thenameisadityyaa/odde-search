import { useEffect } from "react";
import Lenis from "lenis";

/**
 * useLenis — initialises Lenis smooth scroll globally.
 * Call once at the app root (inside AppContent).
 */
export default function useLenis() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,           // scroll duration multiplier
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease-out
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        });

        // Expose for external use (e.g. ScrollTrigger integration)
        window.__lenis = lenis;

        let rafId;
        function raf(time) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
            delete window.__lenis;
        };
    }, []);
}
