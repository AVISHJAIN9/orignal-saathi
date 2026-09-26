import { useEffect } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "@/components/theme-provider";

function clipPathKeyframes(x: number, y: number) {
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );
  return [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${endRadius}px at ${x}px ${y}px)`,
  ];
}

export function useThemeShortcut() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + L to toggle theme
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "l") {
        e.preventDefault();
        
        const target = theme === "dark" ? "light" : "dark";
        
        // Use center of screen if triggered via keyboard
        const origin = {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
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
              { clipPath: clipPathKeyframes(origin.x, origin.y) },
              {
                duration: 500,
                easing: "ease-in-out",
                pseudoElement: "::view-transition-new(root)",
              }
            );
          })
          .catch(() => {});
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [theme, setTheme]);
}
