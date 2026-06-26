import { cn } from "@/lib/utils";
import { MrRedMascot } from "@/components/atoms/MrRedMascot";

interface MrRedBrandProps {
  size?: "xs" | "sm" | "md" | "lg";
  showWordmark?: boolean;
  className?: string;
}

const textSizeMap = {
  xs: "text-sm",
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
};

export function MrRedBrand({
  size = "sm",
  showWordmark = true,
  className,
}: MrRedBrandProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <MrRedMascot size={size} />
      {showWordmark && (
        <span className={cn("font-bold italic tracking-tight", textSizeMap[size])}>
          <span className="text-foreground">Mr.</span>{" "}
          <span className="text-primary">Red</span>
        </span>
      )}
    </div>
  );
}
