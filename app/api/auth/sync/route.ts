import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { syncUser } from "@/lib/db-sync";

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const primaryEmail = user.emailAddresses.find(
    (email) => email.id === user.primaryEmailAddressId
  )?.emailAddress;

  if (!primaryEmail) {
    return new NextResponse("Missing email address", { status: 400 });
  }

  const fullName = user.firstName 
    ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}`
    : null;

  const result = await syncUser({
    clerkId: user.id,
    email: primaryEmail,
    name: fullName,
  });

  if (!result.success) {
    return new NextResponse("Failed to sync user session", { status: 500 });
  }

  // Redirect to dashboard (or home page if preferred) after successful sync
  redirect("/dashboard");
}
