"use client";

import { cn } from "@/lib/utils";
import { MrRedBrand } from "@/components/atoms/MrRedBrand";
import { ResearchBriefView } from "@/components/molecules/ResearchBriefView";
import { parseResearchBrief } from "@/lib/research/types";

export interface ChatMessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatMessageProps {
  message: ChatMessageData;
}

function renderInlineMarkdown(text: string) {
  const linkPattern = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = linkPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={key++}>{renderBold(text.slice(lastIndex, match.index))}</span>
      );
    }
    parts.push(
      <a
        key={key++}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
      >
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={key++}>{renderBold(text.slice(lastIndex))}</span>);
  }

  return parts.length > 0 ? parts : renderBold(text);
}

function renderBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
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
  const research = !isUser ? parseResearchBrief(message.content) : null;

  return (
    <div
      className={cn("flex py-4", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[min(100%,48rem)] w-full",
          isUser && "flex flex-col items-end"
        )}
      >
        {!isUser && <MrRedBrand size="xs" className="mb-2" />}
        <div
          className={cn(
            "rounded-2xl text-sm leading-relaxed",
            research ? "p-0 bg-transparent" : "px-4 py-3 whitespace-pre-wrap",
            isUser
              ? "bg-primary text-primary-foreground px-4 py-3"
              : !research && "bg-muted text-foreground"
          )}
        >
          {research ? (
            <ResearchBriefView brief={research} />
          ) : (
            renderInlineMarkdown(message.content)
          )}
        </div>
      </div>
    </div>
  );
}
