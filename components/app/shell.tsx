"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/login")) {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar />
      <Topbar />
      <main className="px-4 py-4 lg:pl-60">{children}</main>
    </>
  );
}
