"use client";

import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Trash2 } from "lucide-react";
import { useChatSession } from "@/contexts/ChatSessionContext";
import { cn } from "@/lib/utils";

export function ChatHistoryList() {
  const {
    chats,
    activeChatId,
    chatsLoading,
    selectChat,
    deleteChat,
  } = useChatSession();

  if (chatsLoading) {
    return (
      <div className="px-3 py-2">
        <p className="text-xs text-muted-foreground">Loading chats...</p>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <p className="px-3 py-2 text-xs text-muted-foreground">
        No chats yet. Start a new conversation.
      </p>
    );
  }

  return (
    <div>
      <p className="px-3 py-2 text-xs font-medium text-muted-foreground">
        Recent chats
      </p>
      <ul className="flex flex-col gap-0.5">
        {chats.map((chat) => {
          const isActive = activeChatId === chat.id;
          return (
            <li key={chat.id}>
              <div
                className={cn(
                  "group flex items-center gap-1 rounded-lg",
                  isActive && "bg-primary/10"
                )}
              >
                <button
                  type="button"
                  onClick={() => selectChat(chat.id)}
                  className={cn(
                    "flex min-w-0 flex-1 items-start gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <MessageSquare className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">
                      {chat.title}
                    </span>
                    <span className="block text-xs opacity-70">
                      {formatDistanceToNow(new Date(chat.updatedAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    void deleteChat(chat.id);
                  }}
                  className="mr-1 rounded p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-destructive group-hover:opacity-100"
                  aria-label={`Delete ${chat.title}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
