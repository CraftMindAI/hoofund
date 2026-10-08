"use client";

import {
  animate,
  motion,
  MotionConfig,
  useInView,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

const ease = [0.2, 0.7, 0.2, 1] as const;

/** Respects the visitor's "reduce motion" OS setting for every animation below. */
export function MotionRoot({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

const tags = {
  div: motion.div,
  li: motion.li,
  ul: motion.ul,
  ol: motion.ol,
  article: motion.article,
  figure: motion.figure,
  section: motion.section,
  p: motion.p,
  h1: motion.h1,
};
type Tag = keyof typeof tags;

type BaseProps = {
  as?: Tag;
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
};

/** Fades and slides its content up once it scrolls into view. */
export function Reveal({ as = "div", delay = 0, y = 40, className, style, children }: BaseProps & { delay?: number; y?: number }) {
  const Comp = tags[as];
  return (
    <Comp
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </Comp>
  );
}

const container: Variants = {
  hidden: {},
  show: (gap: number) => ({ transition: { staggerChildren: gap } }),
};

const item: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease } },
};

/** Staggers its <StaggerItem> children in, on mount (`onMount`) or when scrolled into view. */
export function Stagger({
  as = "div",
  gap = 0.12,
  onMount = false,
  className,
  style,
  children,
}: BaseProps & { gap?: number; onMount?: boolean }) {
  const Comp = tags[as];
  return (
    <Comp
      className={className}
      style={style}
      variants={container}
      custom={gap}
      initial="hidden"
      {...(onMount ? { animate: "show" } : { whileInView: "show", viewport: { once: true, amount: 0.15 } })}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({ as = "div", lift = false, className, style, children }: BaseProps & { lift?: boolean }) {
  const Comp = tags[as];
  return (
    <Comp
      className={className}
      style={style}
      variants={item}
      {...(lift && {
        whileHover: { y: -8, transition: { type: "spring", stiffness: 300, damping: 18 } },
        whileTap: { scale: 0.98 },
      })}
    >
      {children}
    </Comp>
  );
}

/** Gently bobs up and down forever. */
export function Floating({
  className,
  style,
  children,
  delay = 0,
  distance = 12,
  duration = 6,
}: BaseProps & { delay?: number; distance?: number; duration?: number }) {
  return (
    <motion.div
      className={className}
      style={style}
      animate={{ y: [0, -distance, 0], rotate: [-1.5, 1, -1.5] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

/** Moves its content slower than the page scroll for a depth effect. */
export function Parallax({ className, children, offset = 60 }: BaseProps & { offset?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="absolute inset-[-12%]">
        {children}
      </motion.div>
    </div>
  );
}

const inr = new Intl.NumberFormat("en-IN");

/** Counts a rupee amount like "₹5,82,400" up from zero when it scrolls into view. */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const target = Number(value.replace(/[^\d]/g, ""));

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => {
        el.textContent = `₹${inr.format(Math.round(v))}`;
      },
    });
    return () => controls.stop();
  }, [inView, target]);

  // Server HTML keeps the real figure, so it is correct without JavaScript.
  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
