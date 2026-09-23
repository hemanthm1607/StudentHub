import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "StudentHub — Learn. Practice. Improve. Teach.",
  description:
    "A free student learning, practice, assessment and skill-sharing platform designed for engineering and computer science students.",
  openGraph: {
    title: "StudentHub — Learn. Practice. Improve. Teach.",
    description:
      "A free student learning, practice, assessment and skill-sharing platform designed for engineering and computer science students.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="flex min-h-full flex-col bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
