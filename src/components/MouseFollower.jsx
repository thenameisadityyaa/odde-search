import { useEffect, useRef, useState } from "react";

/**
 * MouseFollower — Brave-aesthetic cursor ring
 * - Small dot + outer ring in default state
 * - Smooth spring-follow using requestAnimationFrame
 * - Expands & inverts on hover of buttons/links/inputs
 */
export default function MouseFollower() {
    const dotRef = useRef(null);
    const ringRef = useRef(null);

    // Current rendered position (lerped)
    const pos = useRef({ x: -100, y: -100 });
    // Target position (raw mouse)
    const target = useRef({ x: -100, y: -100 });
    const hovered = useRef(false);
    const rafId = useRef(null);

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Hide the native cursor globally
        document.documentElement.style.cursor = "none";

        const onMove = (e) => {
            target.current = { x: e.clientX, y: e.clientY };
            if (!visible) setVisible(true);
        };

        const onLeave = () => setVisible(false);
        const onEnter = () => setVisible(true);

        // Detect interactive elements
        const onMouseOver = (e) => {
            const el = e.target.closest("button, a, input, textarea, select, [role='button'], label");
            if (el) {
                hovered.current = true;
            }
        };
        const onMouseOut = (e) => {
            const el = e.target.closest("button, a, input, textarea, select, [role='button'], label");
            if (el) {
                hovered.current = false;
            }
        };

        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseleave", onLeave);
        document.addEventListener("mouseenter", onEnter);
        document.addEventListener("mouseover", onMouseOver);
        document.addEventListener("mouseout", onMouseOut);

        // Spring loop
        const LERP = 0.11; // lower = smoother/slower follow
        const DOT_LERP = 0.42; // dot follows faster

        let dotPos = { x: -100, y: -100 };

        const tick = () => {
            // Ring follows with spring
            pos.current.x += (target.current.x - pos.current.x) * LERP;
            pos.current.y += (target.current.y - pos.current.y) * LERP;

            // Dot follows faster (nearly instant)
            dotPos.x += (target.current.x - dotPos.x) * DOT_LERP;
            dotPos.y += (target.current.y - dotPos.y) * DOT_LERP;

            const ring = ringRef.current;
            const dot = dotRef.current;

            if (ring) {
                const isHovered = hovered.current;
                const ringSize = isHovered ? 44 : 28;
                ring.style.transform = `translate(${pos.current.x - ringSize / 2}px, ${pos.current.y - ringSize / 2}px)`;
                ring.style.width = `${ringSize}px`;
                ring.style.height = `${ringSize}px`;
                ring.style.borderColor = isHovered ? "var(--accent)" : "rgba(241,241,243,0.35)";
                ring.style.backgroundColor = isHovered ? "rgba(251,84,43,0.08)" : "transparent";
            }

            if (dot) {
                dot.style.transform = `translate(${dotPos.x - 3}px, ${dotPos.y - 3}px)`;
                dot.style.opacity = hovered.current ? "0" : "1";
            }

            rafId.current = requestAnimationFrame(tick);
        };

        rafId.current = requestAnimationFrame(tick);

        return () => {
            document.documentElement.style.cursor = "";
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseleave", onLeave);
            document.removeEventListener("mouseenter", onEnter);
            document.removeEventListener("mouseover", onMouseOver);
            document.removeEventListener("mouseout", onMouseOut);
            cancelAnimationFrame(rafId.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Don't render on touch devices
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
        return null;
    }

    return (
        <>
            {/* Outer ring — slow spring follow */}
            <div
                ref={ringRef}
                aria-hidden
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    border: "1.5px solid rgba(241,241,243,0.35)",
                    pointerEvents: "none",
                    zIndex: 9999,
                    opacity: visible ? 1 : 0,
                    willChange: "transform, width, height",
                    transition: "width 0.2s cubic-bezier(0.22,1,0.36,1), height 0.2s cubic-bezier(0.22,1,0.36,1), border-color 0.2s ease, background-color 0.2s ease, opacity 0.3s ease",
                    mixBlendMode: "normal",
                }}
            />
            {/* Center dot — fast follow */}
            <div
                ref={dotRef}
                aria-hidden
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    pointerEvents: "none",
                    zIndex: 9999,
                    opacity: visible ? 1 : 0,
                    willChange: "transform, opacity",
                    transition: "opacity 0.15s ease",
                }}
            />
        </>
    );
}
