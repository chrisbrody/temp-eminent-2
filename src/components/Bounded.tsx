import type { ReactNode } from "react";
import clsx from "clsx";

type BoundedProps = {
  as?: "div" | "section" | "header";
  yPadding?: "sm" | "base" | "lg";
  collapsible?: boolean;
  className?: string;
  widthClass?: string;
  children?: ReactNode;
};

export function Bounded({
  as: Comp = "div",
  yPadding = "base",
  collapsible = true,
  className,
  widthClass = "max-w-6xl",
  children,
}: BoundedProps) {
  return (
      <Comp
          data-collapsible={collapsible}
          className={clsx(
              "px-6",
              yPadding === "sm" && "py-8 md:py-10",
              yPadding === "base" && "",
              yPadding === "lg" && "py-32 md:py-48",
              className,
          )}
      >
        <div className={clsx("mx-auto w-full", widthClass)}>{children}</div>
      </Comp>
  );
}
