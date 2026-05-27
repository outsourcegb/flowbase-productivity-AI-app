import { db } from "@/db";
import { users } from "@/db/schema";

interface SyncUserParams {
  clerkId: string;
  email: string;
  name?: string | null;
}

export async function syncUser({ clerkId, email, name }: SyncUserParams) {
  try {
    const [result] = await db
      .insert(users)
      .values({
        id: clerkId,
        email,
        name: name || null,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email,
          name: name || null,
        },
      })
      .returning();

    return { success: true, user: result };
  } catch (error) {
    console.error("Database sync failed for clerkId:", clerkId, error);
    return { success: false, error };
  }
}
