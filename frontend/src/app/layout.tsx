import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import MobileNav from "@/components/MobileNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VedaAI – AI Assessment Creator",
  description:
    "Create structured exam question papers from topics, reference materials, and custom instructions using Groq LLM and BullMQ background workers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full flex">
        {/* Sidebar — hidden on mobile, visible on lg+ */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* TopBar at the top */}
          <TopBar />

          {/* Scrollable page content */}
          <main className="flex-1 overflow-y-auto bg-background p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
            {children}
          </main>
        </div>

        {/* Mobile bottom nav — visible on mobile, hidden on lg+ */}
        <MobileNav />
      </body>
    </html>
  );
}
