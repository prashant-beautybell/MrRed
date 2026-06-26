"use client";

import { cn } from "@/lib/utils";
import { MrRedBrand } from "@/components/atoms/MrRedBrand";

export interface ChatMessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatMessageProps {
  message: ChatMessageData;
}

function renderContent(content: string) {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex py-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[min(100%,42rem)]",
          isUser && "flex flex-col items-end"
        )}
      >
        {!isUser && <MrRedBrand size="xs" className="mb-2" />}
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          )}
        >
          {renderContent(message.content)}
        </div>
      </div>
    </div>
  );
}
