"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { Search } from "lucide-react";
import Image from "next/image";

// Minimum on-screen size (px) for the floating zoom panel — thumbnails and swatch
// tiles render much smaller than this, so the panel is scaled up to stay legible
// no matter how small the source image container is.
const PANEL_MIN = 360;
// Gap (px) between the original image and the floating zoom panel.
const GAP = 16;
// White frame thickness (px) around the zoomed crop, so the panel reads as a
// distinct floating card rather than blending into whatever sits next to it.
const FRAME = 10;
// Height (px) reserved above the crop for the "Zoomed View" label + its gap —
// added on top of the crop's own height so the crop itself keeps the source
// image's aspect ratio instead of being squeezed to make room for the label.
const LABEL_H = 32;

/**
 * Hover-to-magnify product photo, styled after the Magic Zoom widget used on
 * competitor paper-catalogue sites: moving the cursor over the photo shows a
 * bracket-cornered "lens" over the area under the pointer, and a separate floating
 * panel — positioned beside the image, not inside it — displays that area magnified.
 * The panel is rendered through a portal straight into <body>, so it always floats
 * at the correct viewport position and is never clipped or misplaced by a card's
 * `overflow-hidden` or by an animated (transformed) ancestor like MotionDiv.
 *
 * Desktop/mouse only (`hidden md:block` on both the lens and the panel) — hover has
 * no meaning on touch devices, so those just show the plain photo.
 */
export function ZoomImage({
  src,
  alt,
  sizes,
  zoom = 2.5,
  priority,
  className = "",
  imgClassName = "object-cover",
  style,
  children,
}: {
  src: string;
  alt: string;
  sizes?: string;
  /** Magnification factor shown in the side panel. */
  zoom?: number;
  priority?: boolean;
  /** Classes for the positioning container (aspect ratio, rounding, etc). */
  className?: string;
  imgClassName?: string;
  /** Inline styles for the positioning container, e.g. a non-Tailwind aspect-ratio. */
  style?: CSSProperties;
  /** Overlay content (badges, tags) rendered above the lens layer, e.g. "Image indicative" pills. */
  children?: ReactNode;
}) {
  const [hovering, setHovering] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lensPct = 100 / zoom;
  const [lens, setLens] = useState({ left: 0, top: 0 });
  const [panel, setPanel] = useState<{ left: number; top: number; width: number; height: number; bgX: number; bgY: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Portals need a DOM to attach to — guard against SSR.
  useEffect(() => setMounted(true), []);

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;

    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    const lensLeft = Math.min(Math.max(xPct - lensPct / 2, 0), 100 - lensPct);
    const lensTop = Math.min(Math.max(yPct - lensPct / 2, 0), 100 - lensPct);
    setLens({ left: lensLeft, top: lensTop });

    const scale = Math.max(1, PANEL_MIN / Math.min(rect.width, rect.height));
    const panelWidth = rect.width * scale + FRAME * 2;
    const panelHeight = rect.height * scale + FRAME * 2 + LABEL_H;

    let panelLeft = rect.right + GAP;
    if (panelLeft + panelWidth > window.innerWidth - 8) {
      panelLeft = rect.left - panelWidth - GAP;
    }
    panelLeft = Math.min(Math.max(panelLeft, 8), Math.max(8, window.innerWidth - panelWidth - 8));

    let panelTop = rect.top;
    panelTop = Math.min(Math.max(panelTop, 8), Math.max(8, window.innerHeight - panelHeight - 8));

    setPanel({
      left: panelLeft,
      top: panelTop,
      width: panelWidth,
      height: panelHeight,
      bgX: lensLeft + lensPct / 2,
      bgY: lensTop + lensPct / 2,
    });
  }

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={style}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onMouseMove={handleMove}
    >
      <Image src={src} alt={alt} fill unoptimized priority={priority} sizes={sizes} className={`${imgClassName} md:cursor-zoom-in`} />

      {/* Lens — bracket-cornered selection box over the area being magnified */}
      {hovering && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute hidden md:block bg-white/20"
          style={{ left: `${lens.left}%`, top: `${lens.top}%`, width: `${lensPct}%`, height: `${lensPct}%` }}
        >
          <span className="absolute left-0 top-0 h-3.5 w-3.5 border-l-2 border-t-2 border-white drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]" />
          <span className="absolute right-0 top-0 h-3.5 w-3.5 border-r-2 border-t-2 border-white drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]" />
          <span className="absolute left-0 bottom-0 h-3.5 w-3.5 border-l-2 border-b-2 border-white drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]" />
          <span className="absolute right-0 bottom-0 h-3.5 w-3.5 border-r-2 border-b-2 border-white drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]" />
        </div>
      )}

      {children}

      {/* Floating zoom panel — portalled to <body> so it always sits at the right
          viewport position beside the image, never clipped by a card's overflow or
          trapped by an animated ancestor's transform. A thick white frame + strong
          shadow + a "Zoomed" chip make it read unmistakably as its own floating
          card, not a replacement of whatever it happens to sit over. */}
      {mounted && hovering && panel &&
        createPortal(
          <div
            aria-hidden="true"
            className="pointer-events-none fixed z-[999] hidden md:flex flex-col gap-1.5 rounded-2xl bg-white p-2.5 shadow-[0_24px_64px_rgba(0,0,0,0.28)] ring-1 ring-black/10"
            style={{ left: panel.left, top: panel.top, width: panel.width, height: panel.height }}
          >
            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-brand-navy px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
              <Search className="h-3 w-3" strokeWidth={2.5} />
              Zoomed View
            </span>
            <div
              className="flex-1 rounded-xl"
              style={{
                backgroundImage: `url(${src})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: `${zoom * 100}%`,
                backgroundPosition: `${panel.bgX}% ${panel.bgY}%`,
              }}
            />
          </div>,
          document.body
        )}
    </div>
  );
}
