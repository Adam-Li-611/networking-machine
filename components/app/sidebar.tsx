"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Building2, CheckSquare, MessageSquareText, RadioTower, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Dashboard", icon: BarChart3 },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/firms", label: "Firms", icon: Building2 },
  { href: "/conversations", label: "Conversations", icon: MessageSquareText },
  { href: "/campaigns", label: "Campaigns", icon: RadioTower },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-56 border-r bg-card lg:block">
      <div className="border-b px-4 py-4">
        <div className="text-sm font-semibold">NetworkOS</div>
        <div className="text-xs text-muted-foreground">Private relationship CRM</div>
      </div>
      <nav className="grid gap-1 p-2">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-9 items-center gap-2 rounded-md px-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
                active && "bg-muted text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
