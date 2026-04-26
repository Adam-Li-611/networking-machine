import { Plus, Search } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 px-4 py-3 backdrop-blur lg:pl-60">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            className="h-9 w-full rounded-md border bg-card pl-9 pr-3 text-sm"
            placeholder="Search contacts, firms, conversations, campaigns..."
          />
        </div>
        <ButtonLink href="/contacts/new" variant="outline" size="sm">
          <Plus className="h-4 w-4" />
          Contact
        </ButtonLink>
        <ButtonLink href="/conversations/new" variant="outline" size="sm">
          <Plus className="h-4 w-4" />
          Call
        </ButtonLink>
        <ButtonLink href="/campaigns/new" variant="outline" size="sm">
          <Plus className="h-4 w-4" />
          Campaign
        </ButtonLink>
        <ButtonLink href="/tasks/new" size="sm">
          <Plus className="h-4 w-4" />
          Task
        </ButtonLink>
      </div>
    </header>
  );
}
