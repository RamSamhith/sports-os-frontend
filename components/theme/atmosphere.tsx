/**
 * Atmosphere — a fixed full-viewport layer that sits behind every page.
 *
 * Four stacked layers, GPU-only (transform + opacity), each theme-paced:
 *   1. .atmosphere__mesh       — animated mesh gradient (slow drift)
 *   2. .atmosphere__aurora     — soft drifting radial glows
 *   3. .atmosphere__parallax   — ultra-slow parallax layer
 *   4. .atmosphere__veil       — soft diffusion for content contrast
 *
 * Each theme gets distinct gradient stops, blend modes, and motion speeds
 * via the --atm-* and --mesh-* / --aurora-* / --parallax-* / --veil-*
 * tokens. See app/globals.css.
 */
export function Atmosphere() {
  return (
    <div className="atmosphere" aria-hidden>
      <div className="atmosphere__mesh" />
      <div className="atmosphere__aurora" />
      <div className="atmosphere__parallax" />
      <div className="atmosphere__veil" />
    </div>
  );
}
