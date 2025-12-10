import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import UnifiedChatWidget from "@/components/chatbot/UnifiedChatWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "upPowerSkill - AI-Powered Learning Platform",
  description: "แพลตฟอร์มการเรียนรู้ที่ขับเคลื่อนด้วย AI เพื่อเสริมพลังการเรียนรู้ของคุณ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={inter.className}>
        {children}
        <UnifiedChatWidget />
      </body>
    </html>
  );
}