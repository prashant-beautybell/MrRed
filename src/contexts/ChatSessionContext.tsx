"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createChat,
  deleteChat as apiDeleteChat,
  fetchChats,
  type ChatSummary,
} from "@/lib/chat-api";

type ChatSessionContextValue = {
  chats: ChatSummary[];
  activeChatId: string | null;
  sessionKey: number;
  hasMessages: boolean;
  chatsLoading: boolean;
  newChat: () => void;
  selectChat: (id: string) => void;
  deleteChat: (id: string) => Promise<void>;
  refreshChats: () => Promise<void>;
  registerChat: (chat: ChatSummary) => void;
  setHasMessages: (has: boolean) => void;
};

const ChatSessionContext = createContext<ChatSessionContextValue | null>(null);

export function ChatSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatFromUrl = searchParams.get("chat");

  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(chatFromUrl);
  const [sessionKey, setSessionKey] = useState(0);
  const [hasMessages, setHasMessages] = useState(false);
  const [chatsLoading, setChatsLoading] = useState(true);

  const refreshChats = useCallback(async () => {
    try {
      const list = await fetchChats();
      setChats(list);
    } catch {
      setChats([]);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      setChatsLoading(true);
      await refreshChats();
      setChatsLoading(false);
    })();
  }, [refreshChats]);

  useEffect(() => {
    if (chatFromUrl) {
      setActiveChatId(chatFromUrl);
    }
  }, [chatFromUrl]);

  const newChat = useCallback(() => {
    setActiveChatId(null);
    setHasMessages(false);
    setSessionKey((k) => k + 1);
    router.replace("/dashboard");
  }, [router]);

  const selectChat = useCallback(
    (id: string) => {
      setActiveChatId(id);
      setSessionKey((k) => k + 1);
      router.replace(`/dashboard?chat=${id}`);
    },
    [router]
  );

  const deleteChat = useCallback(
    async (id: string) => {
      await apiDeleteChat(id);
      setChats((prev) => prev.filter((c) => c.id !== id));
      if (activeChatId === id) {
        newChat();
      }
    },
    [activeChatId, newChat]
  );

  const registerChat = useCallback((chat: ChatSummary) => {
    setChats((prev) => {
      const without = prev.filter((c) => c.id !== chat.id);
      return [chat, ...without];
    });
    setActiveChatId(chat.id);
    router.replace(`/dashboard?chat=${chat.id}`);
  }, [router]);

  const value = useMemo(
    () => ({
      chats,
      activeChatId,
      sessionKey,
      hasMessages,
      chatsLoading,
      newChat,
      selectChat,
      deleteChat,
      refreshChats,
      registerChat,
      setHasMessages,
    }),
    [
      chats,
      activeChatId,
      sessionKey,
      hasMessages,
      chatsLoading,
      newChat,
      selectChat,
      deleteChat,
      refreshChats,
      registerChat,
    ]
  );

  return (
    <ChatSessionContext.Provider value={value}>
      {children}
    </ChatSessionContext.Provider>
  );
}

const noop = () => {};
const noopAsync = async () => {};

export function useChatSession() {
  const ctx = useContext(ChatSessionContext);
  if (!ctx) {
    return {
      chats: [] as ChatSummary[],
      activeChatId: null,
      sessionKey: 0,
      hasMessages: false,
      chatsLoading: false,
      newChat: noop,
      selectChat: noop,
      deleteChat: noopAsync,
      refreshChats: noopAsync,
      registerChat: noop,
      setHasMessages: noop,
    };
  }
  return ctx;
}

export async function ensureChatSession(
  activeChatId: string | null,
  registerChat: (chat: ChatSummary) => void
): Promise<string> {
  if (activeChatId) return activeChatId;
  const chat = await createChat();
  registerChat(chat);
  return chat.id;
}
