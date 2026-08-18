import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Learniee | Parent Dashboard",
  description: "Search and book the right courses for your child.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 font-sans">
        {children}
      </body>
    </html>
  );
}
