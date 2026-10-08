"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/** Looping background video that slowly zooms out as the section scrolls past. */
export function BannerVideo({
  src,
  poster,
  label,
  start = "top bottom",
}: {
  src: string;
  poster: string;
  label: string;
  /** ScrollTrigger start for the zoom; use "top top" for a section at the top of the page. */
  start?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        video.current?.play().catch(() => {});
        gsap.fromTo(
          video.current,
          { scale: 1.25 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: wrap.current, start, end: "bottom top", scrub: true },
          },
        );
      });
      // Reduced motion: leave the poster frame showing instead of playing.
      mm.add("(prefers-reduced-motion: reduce)", () => video.current?.pause());
    },
    { scope: wrap },
  );

  return (
    <div ref={wrap} className="absolute inset-0 overflow-hidden">
      <video
        ref={video}
        className="h-full w-full object-cover"
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
      />
    </div>
  );
}

/** Heading whose words rise out of a mask when it scrolls into view. */
export function SplitHeading({
  as: Tag = "h2",
  className,
  children,
}: {
  as?: "h2" | "h3";
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Split by words only, so Tamil letter clusters are never broken apart.
        const split = SplitText.create(ref.current, {
          type: "words",
          mask: "words",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.words, {
              yPercent: 110,
              rotate: 4,
              opacity: 0,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.08,
              scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
            }),
        });
        return () => split.revert();
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Endless ticker that speeds up with scroll velocity and follows the scroll direction. */
export function VelocityMarquee({ className, children }: { className?: string; children: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const loop = gsap.to(track.current, { xPercent: -50, ease: "none", duration: 36, repeat: -1 });
        let direction = 1;
        const st = ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            if (self.direction !== 0) direction = self.direction;
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 6);
            gsap.to(loop, { timeScale: direction * boost, duration: 0.2, overwrite: true });
            gsap.to(loop, { timeScale: direction, duration: 1.2, delay: 0.2, ease: "power2.out" });
          },
        });
        return () => {
          st.kill();
          loop.kill();
        };
      });
    },
    { scope: track },
  );

  return (
    <div ref={track} className={`flex w-max ${className ?? ""}`}>
      {children}
    </div>
  );
}

/** Gold line that fills across the "how it works" steps as you scroll through them. */
export function StepsProgress({ children }: { children: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ".steps-line",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: wrap.current, start: "top 75%", end: "bottom 45%", scrub: 0.6 },
          },
        );
      });
    },
    { scope: wrap },
  );

  return (
    <div ref={wrap}>
      {children}
      <div aria-hidden className="mt-6 hidden h-1.5 rounded-full bg-forest/10 md:block">
        <div className="steps-line h-full origin-left rounded-full bg-gradient-to-r from-gold to-earth" />
      </div>
    </div>
  );
}
