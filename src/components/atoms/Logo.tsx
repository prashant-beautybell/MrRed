import Link from "next/link";
import { cn } from "@/lib/utils";
import { MrRedMascot } from "@/components/atoms/MrRedMascot";
import { MrRedWordmark } from "@/components/atoms/MrRedWordmark";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showImage?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { mascot: "xs" as const },
  md: { mascot: "sm" as const },
  lg: { mascot: "md" as const },
};

export function Logo({ size = "md", showImage = true, className }: LogoProps) {
  const sizes = sizeMap[size];

  return (
    <Link href="/dashboard" className={cn("flex items-center gap-2", className)}>
      {showImage && <MrRedMascot size={sizes.mascot} />}
      <MrRedWordmark
        size={size === "lg" ? "md" : "sm"}
        showSwoosh={size !== "sm"}
      />
    </Link>
  );
}
