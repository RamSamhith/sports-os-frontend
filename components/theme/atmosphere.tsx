/**
 * Atmosphere — a fixed full-viewport layer that sits behind every page.
 *
 * Each theme gets three layered divs. The CSS keyframes and gradient
 * stops are theme-specific (see app/globals.css). Movement is GPU-only
 * (transform + opacity) and pauses under prefers-reduced-motion.
 */
export function Atmosphere() {
  return (
    <div className="atmosphere" aria-hidden>
      <div className="atmosphere__layer atmosphere__layer--1" />
      <div className="atmosphere__layer atmosphere__layer--2" />
      <div className="atmosphere__layer atmosphere__layer--3" />
    </div>
  );
}
