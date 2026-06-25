import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showImage?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { text: "text-lg", image: 32 },
  md: { text: "text-2xl", image: 48 },
  lg: { text: "text-4xl", image: 72 },
};

export function Logo({ size = "md", showImage = true, className }: LogoProps) {
  const sizes = sizeMap[size];

  return (
    <Link href="/dashboard" className={cn("flex items-center gap-2", className)}>
      {showImage && (
        <Image
          src="/mrred-logo.png"
          alt="MrRed"
          width={sizes.image}
          height={sizes.image}
          priority={size === "lg"}
          className="object-contain"
          style={{ width: sizes.image, height: "auto" }}
        />
      )}
      <span className={cn("font-bold italic tracking-tight", sizes.text)}>
        <span className="text-foreground">MR</span>{" "}
        <span className="text-primary">RED</span>
      </span>
    </Link>
  );
}
