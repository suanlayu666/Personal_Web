import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type ScrollFloatTextProps = {
  as?: "h2";
  id?: string;
  children: string;
  className?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
};

gsap.registerPlugin(ScrollTrigger);

function splitCharacters(text: string) {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), (part) => part.segment);
  }

  return Array.from(text);
}

export function ScrollFloatText({
  as,
  id,
  children,
  className = "",
  animationDuration = 0.8,
  ease = "power3.out",
  scrollStart = "top 82%",
  scrollEnd = "bottom 56%",
  stagger = 0.018,
}: ScrollFloatTextProps) {
  const Component = as ?? "h2";
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const characters = useMemo(() => splitCharacters(children), [children]);
  const classNames = ["scroll-float", "scroll-float--shiny", className].filter(Boolean).join(" ");

  useEffect(() => {
    const element = headingRef.current;

    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const chars = element.querySelectorAll<HTMLElement>(".scroll-float__char");

    const tween = gsap.fromTo(
      chars,
      {
        opacity: 0,
        yPercent: 90,
        scaleY: 1.45,
        scaleX: 0.86,
        transformOrigin: "50% 0%",
      },
      {
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        duration: animationDuration,
        ease,
        stagger,
        scrollTrigger: {
          trigger: element,
          start: scrollStart,
          end: scrollEnd,
          scrub: 0.35,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [animationDuration, ease, scrollEnd, scrollStart, stagger]);

  return (
    <Component ref={headingRef} id={id} className={classNames} aria-label={children}>
      <span className="scroll-float__shine" aria-hidden="true" />
      <span className="scroll-float__text" aria-hidden="true">
        {characters.map((char, index) => (
          <span className="scroll-float__char" key={`${char}-${index}`}>
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </Component>
  );
}
