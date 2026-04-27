import type { Metadata } from "next";
import "./globals.css";
import { Shell } from "@/components/app/shell";

export const metadata: Metadata = {
  title: "Networking Machine",
  description: "Private AI outreach command center for finance recruiting and professional networking"
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
