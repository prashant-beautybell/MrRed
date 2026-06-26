import { NextResponse } from "next/server";
import { db } from "@/db";
import { chatMessages, chats } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { chatTitleFromMessage } from "@/lib/chat-title";
import { useLocalStore } from "@/lib/dev-auth";
import { devStore } from "@/lib/dev-store";
import { nanoid } from "@/lib/id";
import { eq } from "drizzle-orm";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();
  const role = body.role as "user" | "assistant";
  const content = String(body.content ?? "").trim();

  if (!content || (role !== "user" && role !== "assistant")) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  if (useLocalStore()) {
    const chat = devStore.getChat(id, session.user.id);
    if (!chat) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const message = devStore.addChatMessage(id, session.user.id, {
      role,
      content,
    });

    if (role === "user" && chat.title === "New chat") {
      devStore.updateChat(id, session.user.id, {
        title: chatTitleFromMessage(content),
      });
    }

    return NextResponse.json(message, { status: 201 });
  }

  try {
    const [chat] = await db
      .select()
      .from(chats)
      .where(eq(chats.id, id))
      .limit(1);

    if (!chat || chat.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const messageId = nanoid();
    const now = new Date();
    const [message] = await db
      .insert(chatMessages)
      .values({
        id: messageId,
        chatId: id,
        role,
        content,
        createdAt: now,
      })
      .returning();

    const title =
      role === "user" && chat.title === "New chat"
        ? chatTitleFromMessage(content)
        : chat.title;

    await db
      .update(chats)
      .set({ updatedAt: now, title })
      .where(eq(chats.id, id));

    return NextResponse.json(message, { status: 201 });
  } catch {
    const chat = devStore.getChat(id, session.user.id);
    if (!chat) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const message = devStore.addChatMessage(id, session.user.id, {
      role,
      content,
    });

    if (role === "user" && chat.title === "New chat") {
      devStore.updateChat(id, session.user.id, {
        title: chatTitleFromMessage(content),
      });
    }

    return NextResponse.json(message, { status: 201 });
  }
}
