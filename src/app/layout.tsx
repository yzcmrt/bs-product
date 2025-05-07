import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "BullScan",
  description: "Real-time cryptocurrency tracking platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="min-h-full">
      <body className="min-h-screen flex flex-col bg-gray-900 text-white">
        <Navbar />
        <main className="flex-1 w-full px-3 py-4 sm:px-4 sm:py-6 md:py-8">
          {children}
        </main>
        <footer className="w-full py-2 px-3 sm:px-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} BullScan - Tüm hakları saklıdır
        </footer>
      </body>
    </html>
  );
}
