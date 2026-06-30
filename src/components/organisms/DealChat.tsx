"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SignalLoader } from "@/components/atoms/SignalLoader";
import { MrRedBrand } from "@/components/atoms/MrRedBrand";
import { SIGNAL_STEP_MS_FAST } from "@/lib/signal-loader-timing";
import { ChatMessage, type ChatMessageData } from "@/components/molecules/ChatMessage";
import { ChatComposer, type ComposerAttachment } from "@/components/molecules/ChatComposer";
import { DancingMrRed } from "@/components/molecules/DancingMrRed";
import { SuggestionChip } from "@/components/molecules/SuggestionChip";
import {
  pickSuggestions,
  generateMockReply,
} from "@/lib/chat-suggestions";
import {
  ensureChatSession,
  useChatSession,
} from "@/contexts/ChatSessionContext";
import { fetchChat, postChatMessage } from "@/lib/chat-api";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGESTION_COUNT = 5;
const ROTATE_MS = 12000;
const MAX_ATTACHMENTS = 5;
const MAX_FILE_BYTES = 10 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set([
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "csv",
  "txt",
  "ppt",
  "pptx",
  "md",
]);

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function focusComposer(ref: React.RefObject<HTMLTextAreaElement | null>) {
  requestAnimationFrame(() => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    const len = el.value.length;
    el.setSelectionRange(len, len);
  });
}

function isAllowedFile(file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return ALLOWED_EXTENSIONS.has(ext);
}

function formatMessageContent(text: string, files: ComposerAttachment[]) {
  const trimmed = text.trim();
  if (files.length === 0) return trimmed;

  const names = files.map((f) => f.file.name).join(", ");
  const prefix = `[Attached: ${names}]`;
  return trimmed ? `${prefix}\n\n${trimmed}` : `${prefix}\n\nPlease analyze the attached document(s).`;
}

function toChatMessages(
  messages: { id: string; role: "user" | "assistant"; content: string }[]
): ChatMessageData[] {
  return messages.map((m) => ({
    id: m.id,
    role: m.role,
    content: m.content,
  }));
}

export function DealChat() {
  const {
    activeChatId,
    sessionKey,
    setHasMessages,
    registerChat,
    refreshChats,
  } = useChatSession();

  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<ComposerAttachment[]>([]);
  const [sendError, setSendError] = useState<string | null>(null);
  const sendingRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const rotateSuggestions = useCallback(() => {
    setSuggestions((prev) => pickSuggestions(SUGGESTION_COUNT, prev));
  }, []);

  useEffect(() => {
    setInput("");
    setAttachments([]);
    setThinking(false);
    rotateSuggestions();

    if (!activeChatId) {
      setMessages([]);
      setLoadingChat(false);
      return;
    }

    if (sendingRef.current) return;

    let cancelled = false;
    setLoadingChat(true);

    void (async () => {
      try {
        const chat = await fetchChat(activeChatId);
        if (cancelled) return;
        setMessages(toChatMessages(chat.messages));
      } catch {
        if (!cancelled) setMessages([]);
      } finally {
        if (!cancelled) setLoadingChat(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // Reload thread only when user picks a chat or starts fresh (sessionKey).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionKey, rotateSuggestions]);

  useEffect(() => {
    setHasMessages(messages.length > 0);
  }, [messages.length, setHasMessages]);

  useEffect(() => {
    rotateSuggestions();
    const interval = setInterval(rotateSuggestions, ROTATE_MS);
    return () => clearInterval(interval);
  }, [rotateSuggestions]);

  useEffect(() => {
    if (messages.length === 0) return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, thinking]);

  const sendMessage = async (text: string, files = attachments) => {
    const trimmed = text.trim();
    const hasFiles = files.length > 0;
    if ((!trimmed && !hasFiles) || thinking) return;

    const content = formatMessageContent(trimmed, files);
    setSendError(null);
    sendingRef.current = true;

    let chatId = activeChatId;
    try {
      chatId = await ensureChatSession(activeChatId, registerChat);
    } catch {
      sendingRef.current = false;
      setSendError("Could not start a chat. Check you're signed in and the database is connected.");
      return;
    }

    const optimisticUser: ChatMessageData = {
      id: `tmp-${Date.now()}`,
      role: "user",
      content,
    };
    setMessages((m) => [...m, optimisticUser]);
    setInput("");
    setAttachments([]);
    setThinking(true);

    try {
      const savedUser = await postChatMessage(chatId, "user", content);
      setMessages((m) =>
        m.map((msg) => (msg.id === optimisticUser.id ? savedUser : msg))
      );

      await new Promise((r) => setTimeout(r, 1400));
      const reply = generateMockReply(content);
      const savedAssistant = await postChatMessage(chatId, "assistant", reply);
      setMessages((m) => [...m, savedAssistant]);
      void refreshChats();
    } catch (err) {
      setMessages((m) => m.filter((msg) => msg.id !== optimisticUser.id));
      setInput(trimmed);
      setAttachments(files);
      setSendError(
        err instanceof Error
          ? err.message
          : "Message failed to save. On Vercel, set DATABASE_URL and run npm run db:push."
      );
    } finally {
      sendingRef.current = false;
      setThinking(false);
      rotateSuggestions();
    }
  };

  const handleFilesSelected = (fileList: FileList) => {
    const incoming = Array.from(fileList);
    const valid = incoming.filter((file) => {
      if (!isAllowedFile(file)) return false;
      return file.size <= MAX_FILE_BYTES;
    });

    if (valid.length === 0) return;

    setAttachments((current) => {
      const remaining = MAX_ATTACHMENTS - current.length;
      if (remaining <= 0) return current;

      const next = valid.slice(0, remaining).map((file) => ({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
      }));

      return [...current, ...next];
    });
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((current) => current.filter((item) => item.id !== id));
  };

  const handleSuggestionClick = (text: string) => {
    setInput(text);
    focusComposer(textareaRef);
  };

  const handleSubmit = () => {
    void sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  };

  const isEmpty = messages.length === 0 && !loadingChat;
  const greeting = getGreeting();

  if (loadingChat) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-6rem)] gap-3">
        <SignalLoader size="md" stepMs={SIGNAL_STEP_MS_FAST} />
        <p className="text-sm text-muted-foreground">Loading chat...</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <>
      <div className="flex w-full flex-col min-h-[calc(100dvh-6rem)] py-10 pb-28 sm:pb-10">
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center mb-10 sm:mb-12">
            <MrRedBrand size="lg" className="mb-5" />
            <p className="text-xl font-medium tracking-tight text-foreground mb-3">
              {greeting}
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg">
              Deep research with real product links, then one clear{" "}
              <span className="text-foreground font-medium">red</span>,{" "}
              <span className="text-signal-amber font-medium">amber</span>, or{" "}
              <span className="text-signal-green font-medium">green</span> verdict
              — built for decisions, not generic comparisons.
            </p>
          </div>

          <div className="mx-auto w-full max-w-3xl">
            {sendError && (
              <p className="mb-3 rounded-lg border border-signal-red/30 bg-signal-red-bg px-3 py-2 text-sm text-signal-red">
                {sendError}
              </p>
            )}
            <ChatComposer
              ref={textareaRef}
              variant="hero"
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              onKeyDown={handleKeyDown}
              disabled={thinking}
              attachments={attachments}
              onFilesSelected={handleFilesSelected}
              onRemoveAttachment={handleRemoveAttachment}
              placeholder="Ask anything — deals, people, hotels, flights, local picks, or surprise me…"
            />
          </div>

          <div className="mx-auto w-full max-w-3xl mt-8 sm:mt-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <p className="text-sm font-medium text-muted-foreground">
                Suggested questions
              </p>
              <button
                type="button"
                onClick={rotateSuggestions}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                Refresh
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
              {suggestions.map((s) => (
                <SuggestionChip
                  key={s}
                  text={s}
                  variant="pill"
                  onClick={() => handleSuggestionClick(s)}
                />
              ))}
            </div>
          </div>

        </div>
        <DancingMrRed />
      </>
    );
  }

  return (
    <>
      <div className="flex w-full flex-col h-[calc(100dvh-5.5rem)] max-h-[920px]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="w-full py-6 sm:py-8">
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}
            {thinking && (
              <div className="flex items-center gap-3 py-4">
                <MrRedBrand size="xs" />
                <SignalLoader size="sm" stepMs={SIGNAL_STEP_MS_FAST} />
                <span className="text-sm text-muted-foreground">is analyzing</span>
              </div>
            )}
          </div>
        </div>

        <div
          className={cn(
            "shrink-0 border-t border-border/60 bg-white/80 backdrop-blur-xl",
            "py-4 pb-5"
          )}
        >
          <div className="mx-auto w-full max-w-3xl px-1">
          {sendError && (
            <p className="mb-3 rounded-lg border border-signal-red/30 bg-signal-red-bg px-3 py-2 text-sm text-signal-red">
              {sendError}
            </p>
          )}
          <div className="mb-3">
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.slice(0, 3).map((s) => (
                <SuggestionChip
                  key={s}
                  text={s}
                  variant="pill"
                  onClick={() => handleSuggestionClick(s)}
                  className="text-xs py-2 px-3"
                />
              ))}
            </div>
          </div>
          <ChatComposer
            ref={textareaRef}
            variant="bar"
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
            disabled={thinking}
            attachments={attachments}
            onFilesSelected={handleFilesSelected}
            onRemoveAttachment={handleRemoveAttachment}
          />
          </div>
        </div>
      </div>
    </>
  );
}
