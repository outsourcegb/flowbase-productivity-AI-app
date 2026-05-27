import { ClerkProvider } from '@clerk/nextjs';
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Next.js Premium Startup Boilerplate",
  description: "Created using the ultimate interactive Next.js stack generator CLI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={jakarta.variable} suppressHydrationWarning>
        <body style={{ margin: 0, padding: 0 }}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}





