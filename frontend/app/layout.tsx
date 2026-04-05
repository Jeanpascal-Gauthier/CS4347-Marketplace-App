import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CS4347 Marketplace",
  description: "E-commerce marketplace application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50`}
      >
        <nav className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-gray-900 tracking-tight">
              Marketplace
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/browse" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Browse
              </Link>
              <Link href="/create-listing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Sell
              </Link>
              <Link href="/orders" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Orders
              </Link>
              <Link href="/login" className="text-sm font-medium text-white bg-gray-900 px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}