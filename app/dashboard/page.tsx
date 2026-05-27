import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";

export default async function DashboardPage() {
  const user = await currentUser();

  // Route guard in case middleware didn't intercept
  if (!user) {
    redirect("/sign-in");
  }

  // Fetch the synced user from our local database to prove it works
  const dbUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, user.id),
  });

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#09090b", color: "#fafafa", fontFamily: "sans-serif", padding: "2rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #27272a", paddingBottom: "1rem", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>Dashboard Workspace</h1>
        <UserButton afterSignOutUrl="/" />
      </header>

      <section style={{ maxWidth: "600px", background: "#18181b", padding: "1.5rem", borderRadius: "8px", border: "1px solid #27272a" }}>
        <h2 style={{ fontSize: "1.2rem", marginTop: 0, color: "#a1a1aa" }}>Synced User Profile (Neon DB)</h2>
        
        {dbUser ? (
          <div style={{ marginTop: "1rem", display: "grid", gap: "0.5rem" }}>
            <p><strong>DB Identifier:</strong> <span style={{ color: "#38bdf8" }}>{dbUser.id}</span></p>
            <p><strong>Full Name:</strong> {dbUser.name || "N/A"}</p>
            <p><strong>Email Address:</strong> {dbUser.email}</p>
            <p><strong>Synced At:</strong> {new Date(dbUser.createdAt).toLocaleString()}</p>
          </div>
        ) : (
          <p style={{ color: "#ef4444" }}>User record not found in database. Synced redirect failed or database is out of sync.</p>
        )}
      </section>
    </main>
  );
}
