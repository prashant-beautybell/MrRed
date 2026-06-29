"use client";

import { forwardRef, useCallback, useId, useRef } from "react";
import { Button } from "@/components/atoms/Button";
import { ChatDisclaimer } from "@/components/molecules/ChatDisclaimer";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { FileText, Mic, Paperclip, Send, Square, X } from "lucide-react";
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

const composerShell = cn(
  "relative flex flex-col overflow-hidden transition-all duration-300",
  "rounded-2xl sm:rounded-[1.35rem]",
  "border-2 border-primary/40",
  "bg-gradient-to-b from-white via-signal-red-bg/40 to-signal-red-bg/70",
  "shadow-[0_4px_28px_-10px_rgba(220,38,38,0.28),inset_0_1px_0_rgba(255,255,255,0.9)]",
  "focus-within:border-primary/70",
  "focus-within:shadow-[0_12px_48px_-14px_rgba(220,38,38,0.42),inset_0_1px_0_rgba(255,255,255,0.95)]"
);

const iconButtonClass = cn(
  "h-10 w-10 shrink-0 rounded-xl",
  "border border-primary/15 bg-white/80 text-foreground",
  "hover:bg-white hover:border-primary/30 hover:text-primary",
  "shadow-sm transition-all"
);

export const ChatComposer = forwardRef<HTMLTextAreaElement, ChatComposerProps>(
  function ChatComposer(
    {
      value,
      onChange,
      onSubmit,
      onKeyDown,
      disabled,
      variant = "bar",
      placeholder = "Ask anything — deals, travel, people, local picks…",
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

    const handleTranscript = useCallback(
      (text: string) => {
        onChange(value.trim() ? `${value.trim()} ${text}` : text);
      },
      [onChange, value]
    );

    const { isListening, supported, toggleListening } =
      useSpeechRecognition(handleTranscript);

    const openFilePicker = () => {
      if (disabled) return;
      fileInputRef.current?.click();
    };

    return (
      <div className="w-full">
        <div
          className={cn(
            composerShell,
            isHero ? "min-h-[168px] sm:min-h-[188px] p-4 sm:p-5" : "p-3 sm:p-3.5"
          )}
        >
          {attachments.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="inline-flex max-w-full items-center gap-2 rounded-lg border border-primary/15 bg-white/90 px-2.5 py-1.5 shadow-sm"
                >
                  <FileText className="h-3.5 w-3.5 shrink-0 text-primary/70" />
                  <span className="truncate text-xs font-medium text-foreground max-w-[12rem] sm:max-w-[16rem]">
                    {attachment.file.name}
                  </span>
                  {onRemoveAttachment && (
                    <button
                      type="button"
                      onClick={() => onRemoveAttachment(attachment.id)}
                      disabled={disabled}
                      className="rounded-md p-0.5 text-muted-foreground hover:bg-primary/10 hover:text-primary"
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
              "w-full resize-none bg-transparent text-sm sm:text-[15px] text-foreground placeholder:text-muted-foreground/80",
              "focus-visible:outline-none leading-relaxed",
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
              isHero ? "mt-3 pt-3 border-t border-primary/15" : "mt-2.5"
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
                  variant="ghost"
                  size="icon"
                  className={iconButtonClass}
                  disabled={disabled}
                  onClick={openFilePicker}
                  aria-label="Upload documents to analyze"
                  title="Upload documents (PDF, Word, Excel, CSV, PowerPoint)"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </>
            )}

            <div className="ml-auto flex items-center gap-2">
              {supported && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn(
                    iconButtonClass,
                    isListening &&
                      "border-primary bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground animate-pulse"
                  )}
                  disabled={disabled}
                  onClick={toggleListening}
                  aria-label={isListening ? "Stop listening" : "Voice input"}
                  title={isListening ? "Stop listening" : "Voice input"}
                >
                  {isListening ? (
                    <Square className="h-3.5 w-3.5 fill-current" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              )}

              <Button
                type="button"
                size={isHero ? "default" : "icon"}
                className={cn(
                  "shrink-0 rounded-xl shadow-md",
                  "bg-primary hover:bg-primary/90 text-primary-foreground",
                  "disabled:opacity-40 disabled:shadow-none",
                  isHero ? "h-10 px-5 font-medium" : "h-10 w-10"
                )}
                disabled={!canSubmit || disabled}
                onClick={onSubmit}
              >
                <Send className={cn("h-4 w-4", isHero && "mr-2")} />
                {isHero && "Send"}
              </Button>
            </div>
          </div>
        </div>
        <ChatDisclaimer className="mt-3 opacity-80" />
      </div>
    );
  }
);
