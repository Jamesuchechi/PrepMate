import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PrepMate | AI-Powered Interview Coach",
  description: "Practice. Get brutally honest feedback. Walk into every interview ready.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
