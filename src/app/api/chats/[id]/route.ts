import { NextResponse } from "next/server";
import { db } from "@/db";
import { chatMessages, chats } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { useLocalStore } from "@/lib/dev-auth";
import { devStore } from "@/lib/dev-store";
import { asc, eq } from "drizzle-orm";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  if (useLocalStore()) {
    const chat = devStore.getChat(id, session.user.id);
    if (!chat) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({
      ...chat,
      messages: devStore.getChatMessages(id),
    });
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

    const messages = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.chatId, id))
      .orderBy(asc(chatMessages.createdAt));

    return NextResponse.json({ ...chat, messages });
  } catch {
    const chat = devStore.getChat(id, session.user.id);
    if (!chat) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({
      ...chat,
      messages: devStore.getChatMessages(id),
    });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  if (useLocalStore()) {
    const ok = devStore.deleteChat(id, session.user.id);
    if (!ok) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
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

    await db.delete(chatMessages).where(eq(chatMessages.chatId, id));
    await db.delete(chats).where(eq(chats.id, id));
    return NextResponse.json({ ok: true });
  } catch {
    const ok = devStore.deleteChat(id, session.user.id);
    if (!ok) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  }
}
