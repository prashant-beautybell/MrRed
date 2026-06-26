import Image from "next/image";
import { cn } from "@/lib/utils";

const MASCOT_SRC = "/mrred-mascot.png";

const sizeMap = {
  xs: 40,
  sm: 52,
  md: 72,
  lg: 112,
  xl: 160,
  "2xl": 220,
  hero: 280,
};

interface MrRedMascotProps {
  size?: keyof typeof sizeMap;
  className?: string;
  priority?: boolean;
}

export function MrRedMascot({
  size = "sm",
  className,
  priority = false,
}: MrRedMascotProps) {
  const height = sizeMap[size];
  const width = Math.round(height * 0.72);

  return (
    <Image
      src={MASCOT_SRC}
      alt="Mr. Red"
      width={width}
      height={height}
      priority={priority}
      unoptimized
      className={cn(
        "object-contain shrink-0 select-none bg-transparent",
        className
      )}
      style={{ height, width: "auto", maxWidth: width }}
    />
  );
}
