"use server";

import { db } from "@/lib/db";
import { sessions } from "@/lib/db/schema";
import { redirect } from "next/navigation";

export async function createSession(formData: FormData) {
    const partyName = formData.get("partyName") as string;

    if (!partyName || partyName.trim() === "") {
        throw new Error("Party name is required");
    }

    // Calculate TTL (24 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const [newSession] = await db.insert(sessions).values({
        party_name: partyName,
        expires_at: expiresAt,
    }).returning();

    redirect(`/studio/${newSession.id}`);
}
