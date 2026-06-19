import type { ElementType, ReactNode } from "react";

type GradientTextProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
};

export function GradientText<T extends ElementType = "span">({
  as,
  children,
  className = "",
}: GradientTextProps<T>) {
  const Component = as ?? "span";
  const classNames = ["animated-gradient-text", className].filter(Boolean).join(" ");

  return (
    <Component className={classNames}>
      <span className="animated-gradient-text__content">{children}</span>
    </Component>
  );
}
