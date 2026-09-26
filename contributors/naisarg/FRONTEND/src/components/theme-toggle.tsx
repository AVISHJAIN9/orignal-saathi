import { Monitor, Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ThemeToggleProps {
  className?: string;
  variant?: "outline" | "ghost" | "secondary" | "default";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ThemeToggle({
  className,
  variant = "outline",
  size = "icon",
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          aria-label="Toggle theme"
        >
          {resolvedTheme === "dark" ? (
            <Moon className="size-4 text-primary transition-transform duration-200 hover:rotate-12" />
          ) : (
            <Sun className="size-4 text-amber-500 transition-transform duration-200 hover:rotate-45" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={`flex cursor-pointer items-center gap-2 ${theme === "light" ? "font-semibold text-primary" : ""}`}
        >
          <Sun className="size-4 text-amber-500" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={`flex cursor-pointer items-center gap-2 ${theme === "dark" ? "font-semibold text-primary" : ""}`}
        >
          <Moon className="size-4 text-indigo-400" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={`flex cursor-pointer items-center gap-2 ${theme === "system" ? "font-semibold text-primary" : ""}`}
        >
          <Monitor className="size-4 text-muted-foreground" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
