import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import { ShieldAlert, Terminal, Key, BookOpen } from 'lucide-react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dauntless Ops",
  description: "AI-Driven Incident Response Platform",
};

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.email === 'admin@dauntless.ops';
  return (
    <html lang="en">
      <body className={`${inter.className} bg-mesh bg-grid-pattern text-white min-h-screen flex flex-col relative`}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-purple-900/30 blur-[120px] rounded-full pointer-events-none -z-10" />
        <nav className="w-full bg-gray-950/40 backdrop-blur-xl border-b border-white/10 p-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white hover:text-purple-400 transition-colors">
              <ShieldAlert className="text-red-500" /> Dauntless Ops
            </Link>
            <div className="flex items-center gap-6 text-sm font-medium text-gray-300">
              <Link href="/dashboard" className="flex items-center gap-2 hover:text-white transition-colors">
                <Terminal size={16} /> NOC Dashboard
              </Link>
              <Link href="/dashboard/billing" className="hover:text-white transition-colors">Billing</Link>
              <Link href="/developer" className="flex items-center gap-2 hover:text-white transition-colors">
                <Key size={16} /> API Keys
              </Link>
              <Link href="/docs" className="flex items-center gap-2 hover:text-white transition-colors">
                <BookOpen size={16} /> API Docs
              </Link>
              {isAdmin && (
                <Link href="/admin" className="text-red-400 hover:text-red-300 font-bold transition-colors">Admin Panel</Link>
              )}
              {session ? (
                <Link href="/api/auth/signout" className="bg-white/10 hover:bg-white/20 text-white px-4 py-1 rounded-full transition-colors">Sign Out</Link>
              ) : (
                <Link href="/login" className="bg-white/10 hover:bg-white/20 text-white px-4 py-1 rounded-full transition-colors">Login</Link>
              )}
            </div>
          </div>
        </nav>
        <main className="flex-1 w-full mx-auto">
            {children}
        </main>
      </body>
    </html>
  );
}
