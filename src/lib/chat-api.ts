export type ChatSummary = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type StoredChatMessage = {
  id: string;
  chatId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type ChatWithMessages = ChatSummary & {
  messages: StoredChatMessage[];
};

export async function fetchChats(): Promise<ChatSummary[]> {
  const res = await fetch("/api/chats");
  if (!res.ok) throw new Error("Failed to load chats");
  return res.json();
}

async function readApiError(res: Response, fallback: string) {
  try {
    const data = (await res.json()) as { error?: string };
    return data.error ?? fallback;
  } catch {
    return fallback;
  }
}

export async function createChat(): Promise<ChatSummary> {
  const res = await fetch("/api/chats", { method: "POST" });
  if (!res.ok) {
    throw new Error(await readApiError(res, "Failed to create chat"));
  }
  return res.json();
}

export async function fetchChat(id: string): Promise<ChatWithMessages> {
  const res = await fetch(`/api/chats/${id}`);
  if (!res.ok) throw new Error("Failed to load chat");
  return res.json();
}

export async function deleteChat(id: string): Promise<void> {
  const res = await fetch(`/api/chats/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete chat");
}

export async function postChatMessage(
  chatId: string,
  role: "user" | "assistant",
  content: string
): Promise<StoredChatMessage> {
  const res = await fetch(`/api/chats/${chatId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, content }),
  });
  if (!res.ok) {
    throw new Error(await readApiError(res, "Failed to save message"));
  }
  return res.json();
}
