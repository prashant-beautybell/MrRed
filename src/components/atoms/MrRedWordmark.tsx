import { cn } from "@/lib/utils";

interface MrRedWordmarkProps {
  size?: "sm" | "md" | "lg" | "hero";
  className?: string;
  showSwoosh?: boolean;
  /** Stretch swoosh to container width (e.g. auth form column). */
  fullWidth?: boolean;
}

const textSizeMap = {
  sm: "text-xl",
  md: "text-3xl",
  lg: "text-4xl sm:text-5xl",
  hero: "text-5xl sm:text-6xl",
};

const swooshWidthMap = {
  sm: "w-28 h-2",
  md: "w-36 h-2.5",
  lg: "w-44 sm:w-52 h-3",
  hero: "w-52 sm:w-64 h-3.5",
};

export function MrRedWordmark({
  size = "lg",
  className,
  showSwoosh = true,
  fullWidth = false,
}: MrRedWordmarkProps) {
  return (
    <div
      className={cn(
        "inline-flex flex-col",
        fullWidth ? "w-full items-start" : "items-center",
        className
      )}
    >
      <p
        className={cn(
          "font-bold italic leading-none",
          fullWidth
            ? "text-[length:clamp(2.5rem,16cqw,3.75rem)] tracking-tight"
            : cn("tracking-tight", textSizeMap[size])
        )}
      >
        <span className="text-foreground">Mr.</span>{" "}
        <span className="text-primary">Red</span>
      </p>
      {showSwoosh && (
        <svg
          viewBox="0 0 260 24"
          aria-hidden
          preserveAspectRatio="none"
          className={cn(
            "text-primary -mt-0.5",
            fullWidth ? "mt-1 h-3 w-full sm:h-3.5" : swooshWidthMap[size]
          )}
        >
          <path
            d="M8 16 C70 4, 130 4, 252 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M12 18 C72 8, 128 8, 248 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.35"
          />
        </svg>
      )}
    </div>
  );
}
