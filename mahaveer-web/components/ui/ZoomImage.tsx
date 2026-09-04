"use client";

import { useRef, useState, type CSSProperties, type ReactNode, type MouseEvent } from "react";
import Image from "next/image";

/**
 * Hover-to-magnify product photo — the same idea as the Magic Zoom widget used on
 * competitor paper-catalogue sites (e.g. sonapapers.com): moving the cursor over the
 * photo reveals a magnified crop of the exact spot under the pointer, so a customer
 * can inspect texture/grain detail without leaving the page. Implemented as an
 * in-place "inner zoom" (the magnified crop replaces the thumbnail itself, following
 * the cursor) rather than Magic Zoom's separate side panel, since this renders at
 * card-thumbnail size across the site (product grid, swatch grid) where there is no
 * spare room beside the image for a second panel — this still gives the same "see
 * fine detail on hover" outcome at every size it's used.
 *
 * Desktop/mouse only (`@media (hover:hover)` via the `hidden md:block` overlay) —
 * on touch devices hover has no meaning, so it just renders the plain photo.
 */
export function ZoomImage({
  src,
  alt,
  sizes,
  zoom = 2.2,
  priority,
  className = "",
  imgClassName = "object-cover",
  style,
  children,
}: {
  src: string;
  alt: string;
  sizes?: string;
  /** Magnification factor for the hover crop. */
  zoom?: number;
  priority?: boolean;
  /** Classes for the positioning container (aspect ratio, rounding, etc). */
  className?: string;
  imgClassName?: string;
  /** Inline styles for the positioning container, e.g. a non-Tailwind aspect-ratio. */
  style?: CSSProperties;
  /** Overlay content (badges, tags) rendered above the zoom layer, e.g. "Image indicative" pills. */
  children?: ReactNode;
}) {
  const [hovering, setHovering] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
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
      <Image src={src} alt={alt} fill unoptimized priority={priority} sizes={sizes} className={imgClassName} />
      {/* Magnified layer — only mounted while hovering, so it costs nothing otherwise. */}
      {hovering && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={{
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${zoom * 100}%`,
            backgroundPosition: `${pos.x}% ${pos.y}%`,
          }}
        />
      )}
      {children}
    </div>
  );
}
