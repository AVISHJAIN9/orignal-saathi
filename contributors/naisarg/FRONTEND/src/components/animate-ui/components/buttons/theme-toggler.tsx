// Adapted from Animate UI's Theme Toggler button (https://animate-ui.com)
// Licensed under the MIT License.

import * as React from "react";
import { flushSync } from "react-dom";
import { motion } from "motion/react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { useTheme, type Theme } from "@/components/theme-provider";

type WipeDirection = "ltr" | "rtl" | "ttb" | "btt";

function nextMode(current: Theme, modes: Theme[]) {
  const index = modes.indexOf(current);
  return modes[(index + 1) % modes.length] ?? modes[0];
}

function clipPathKeyframes(
  direction: WipeDirection | undefined,
  origin: { x: number; y: number },
) {
  switch (direction) {
    case "ltr":
      return ["inset(0 100% 0 0)", "inset(0 0 0 0)"];
    case "rtl":
      return ["inset(0 0 0 100%)", "inset(0 0 0 0)"];
    case "ttb":
      return ["inset(0 0 100% 0)", "inset(0 0 0 0)"];
    case "btt":
      return ["inset(100% 0 0 0)", "inset(0 0 0 0)"];
    default: {
      const radius = Math.hypot(
        Math.max(origin.x, window.innerWidth - origin.x),
        Math.max(origin.y, window.innerHeight - origin.y),
      );
      return [
        `circle(0px at ${origin.x}px ${origin.y}px)`,
        `circle(${radius}px at ${origin.x}px ${origin.y}px)`,
      ];
    }
  }
}

import { AnimatedThemeIcon } from "@/components/theme-toggle-icon";

type ThemeTogglerButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "variant" | "size"
> &
  VariantProps<typeof buttonVariants> & {
    direction?: WipeDirection;
    modes?: Theme[];
  };

function ThemeTogglerButton({
  className,
  variant = "outline",
  size = "icon",
  direction = "ltr",
  modes = ["light", "dark"],
  ...props
}: ThemeTogglerButtonProps) {
  const { theme, setTheme } = useTheme();
  const target = nextMode(theme, modes);
  const isDark = theme === "dark" || (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const origin = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    if (!("startViewTransition" in document)) {
      setTheme(target);
      return;
    }

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(target);
      });
    });

    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: clipPathKeyframes(direction, origin) },
          {
            duration: 500,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {});
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      aria-label={`Switch to ${target} theme`}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <AnimatedThemeIcon isDark={isDark} className="text-foreground" />
      <span className="sr-only">Switch to {target} theme</span>
    </Button>
  );
}

export { ThemeTogglerButton };
export type { ThemeTogglerButtonProps };
