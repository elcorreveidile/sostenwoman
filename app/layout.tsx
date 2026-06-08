import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";
import { SampleBadge } from "@/components/SampleBadge";
import { SessionProvider } from "next-auth/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SostenWoman - Moda Sostenible",
  description: "Tienda de moda sostenible con prendas conscientes y éticas",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-stone-50">
        <SessionProvider>
          <CartProvider>
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
            <SampleBadge />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
