import { NextResponse } from "next/server";
import { db } from "@/db";
import { chats } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { nanoid } from "@/lib/id";
import { useLocalStore } from "@/lib/dev-auth";
import { devStore } from "@/lib/dev-store";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (useLocalStore()) {
    return NextResponse.json(devStore.listChats(session.user.id));
  }

  try {
    const rows = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, session.user.id))
      .orderBy(desc(chats.updatedAt));
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json(devStore.listChats(session.user.id));
  }
}

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (useLocalStore()) {
    const chat = devStore.createChat(session.user.id);
    return NextResponse.json(chat, { status: 201 });
  }

  try {
    const id = nanoid();
    const now = new Date();
    const [chat] = await db
      .insert(chats)
      .values({
        id,
        userId: session.user.id,
        title: "New chat",
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    return NextResponse.json(chat, { status: 201 });
  } catch {
    const chat = devStore.createChat(session.user.id);
    return NextResponse.json(chat, { status: 201 });
  }
}
