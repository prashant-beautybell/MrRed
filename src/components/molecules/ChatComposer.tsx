"use client";

import { forwardRef, useId, useRef } from "react";
import { Button } from "@/components/atoms/Button";
import { ChatDisclaimer } from "@/components/molecules/ChatDisclaimer";
import { FileText, Plus, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ComposerAttachment = {
  id: string;
  file: File;
};

export const COMPOSER_ACCEPTED_FILE_TYPES =
  ".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.ppt,.pptx,.md";

interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  variant?: "hero" | "bar";
  placeholder?: string;
  attachments?: ComposerAttachment[];
  onFilesSelected?: (files: FileList) => void;
  onRemoveAttachment?: (id: string) => void;
}

export const ChatComposer = forwardRef<HTMLTextAreaElement, ChatComposerProps>(
  function ChatComposer(
    {
      value,
      onChange,
      onSubmit,
      onKeyDown,
      disabled,
      variant = "bar",
      placeholder = "Ask about a company, stock, deal, or signal",
      attachments = [],
      onFilesSelected,
      onRemoveAttachment,
    },
    ref
  ) {
    const isHero = variant === "hero";
    const fileInputId = useId();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canSubmit = Boolean(value.trim() || attachments.length > 0);
    const uploadEnabled = Boolean(onFilesSelected);

    const openFilePicker = () => {
      if (disabled) return;
      fileInputRef.current?.click();
    };

    return (
      <div className="w-full">
        <div
          className={cn(
            "relative flex flex-col rounded-2xl border border-border bg-card shadow-sm transition-shadow",
            "focus-within:border-primary/30 focus-within:shadow-md",
            isHero ? "min-h-[160px] sm:min-h-[180px] p-4 sm:p-5" : "p-3"
          )}
        >
          {attachments.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="inline-flex max-w-full items-center gap-2 rounded-lg border border-border bg-muted/50 px-2.5 py-1.5"
                >
                  <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate text-xs text-foreground max-w-[12rem] sm:max-w-[16rem]">
                    {attachment.file.name}
                  </span>
                  {onRemoveAttachment && (
                    <button
                      type="button"
                      onClick={() => onRemoveAttachment(attachment.id)}
                      disabled={disabled}
                      className="rounded-md p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label={`Remove ${attachment.file.name}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={isHero ? 3 : 1}
            className={cn(
              "w-full resize-none bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground",
              "focus-visible:outline-none",
              isHero ? "min-h-[72px] flex-1" : "min-h-[44px] max-h-32"
            )}
            onInput={(e) => {
              if (isHero) return;
              const t = e.currentTarget;
              t.style.height = "auto";
              t.style.height = `${Math.min(t.scrollHeight, 128)}px`;
            }}
          />

          <div
            className={cn(
              "flex items-center gap-2",
              isHero ? "mt-3 pt-2 border-t border-border/60" : "mt-2",
              uploadEnabled ? "justify-between" : "justify-end"
            )}
          >
            {uploadEnabled && (
              <>
                <input
                  ref={fileInputRef}
                  id={fileInputId}
                  type="file"
                  multiple
                  accept={COMPOSER_ACCEPTED_FILE_TYPES}
                  className="sr-only"
                  disabled={disabled}
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      onFilesSelected?.(e.target.files);
                    }
                    e.target.value = "";
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0 rounded-xl"
                  disabled={disabled}
                  onClick={openFilePicker}
                  aria-label="Upload documents to analyze"
                  title="Upload documents (PDF, Word, Excel, CSV, PowerPoint)"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </>
            )}

            <Button
              type="button"
              size={isHero ? "default" : "icon"}
              className={cn(
                "rounded-xl shrink-0",
                isHero ? "px-4" : "h-10 w-10"
              )}
              disabled={!canSubmit || disabled}
              onClick={onSubmit}
            >
              <Send className={cn("h-4 w-4", isHero && "mr-2")} />
              {isHero && "Send"}
            </Button>
          </div>
        </div>
        <ChatDisclaimer className="mt-2" />
      </div>
    );
  }
);
