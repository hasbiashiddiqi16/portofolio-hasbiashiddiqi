import type { ReactNode } from "react";
import { useInView } from "../hooks/useInView";

type Variant = "up" | "left" | "right" | "scale";

type Props = {
  children: ReactNode;
  delay?: number;
  variant?: Variant;
  className?: string;
};

const variantClass: Record<Variant, string> = {
  up: "reveal",
  left: "reveal-left",
  right: "reveal-right",
  scale: "reveal-scale",
};

export default function Reveal({
  children,
  delay = 0,
  variant = "up",
  className = "",
}: Props) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);

  return (
    <div
      ref={ref}
      className={`${variantClass[variant]} ${inView ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
