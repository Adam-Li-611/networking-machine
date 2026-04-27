import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";

export const metadata: Metadata = {
  title: "NetworkOS",
  description: "Private personal CRM for finance recruiting and professional networking"
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Sidebar />
        <Topbar />
        <main className="px-4 py-4 lg:pl-60">{children}</main>
      </body>
    </html>
  );
}
