import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import { BootScript } from "@/components/theme/boot-script";
import { ThemeProvider, themeInitScript } from "@/components/theme/theme-provider";
import { LanguageProvider, langInitScript } from "@/components/i18n/language-provider";
import { sessionInitScript } from "@/lib/session-script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const arabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Kinora – Fitness & Coaching",
  description: "Track your progress, stay consistent, and become the best version of yourself.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${arabic.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <BootScript code={themeInitScript} />
        <BootScript code={langInitScript} />
        <BootScript code={sessionInitScript} />
      </head>
      <body className="min-h-full">
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
