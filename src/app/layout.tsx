import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { TopNav } from "@/components/TopNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quantum Education System",
  description: "Learn Quantum Computing Interactively",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} flex min-h-screen bg-gradient-to-br from-gray-900 to-black text-white`}>
        <main className="flex-1 flex flex-col w-full min-h-screen">
          <TopNav />
          <div className="flex-1 flex w-full h-full">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
