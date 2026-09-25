import type { Metadata } from "next";
import { Libre_Bodoni } from "next/font/google";
import "./globals.css";

// Libre Bodoni (regular + italic) exposed as --font-libre-bodoni,
// consumed by --font-heading in globals.css
const libreBodoni = Libre_Bodoni({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-libre-bodoni",
});

export const metadata: Metadata = {
  title: "Youphoria — Own. Stream. Jam. Repeat.",
  description: "Stream your own music, anywhere, and jam in sync with friends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={libreBodoni.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
