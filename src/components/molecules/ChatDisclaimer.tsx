import { cn } from "@/lib/utils";

interface ChatDisclaimerProps {
  className?: string;
}

export function ChatDisclaimer({ className }: ChatDisclaimerProps) {
  return (
    <div
      className={cn(
        "text-center text-xs text-muted-foreground leading-relaxed space-y-1",
        className
      )}
    >
      <p>
        Mr Red pulls data from different source and algorithms and can make
        mistakes. Please double-check responses.
      </p>
    </div>
  );
}
