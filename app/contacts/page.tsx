import { Download, Plus, Upload } from "lucide-react";
import { getContacts, getReferenceData } from "@/lib/data";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form";
import { PageHeader } from "@/components/page-header";
import { priorityOptions, relationshipStageOptions, warmthOptions } from "@/components/forms/options";
import { ContactsTable } from "@/components/tables/contacts-table";

export default async function ContactsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const [contacts, refs] = await Promise.all([getContacts(params), getReferenceData()]);
  const rows = contacts.map((contact) => ({
    id: contact.id,
    fullName: contact.fullName,
    primaryEmail: contact.primaryEmail,
    firm: contact.currentFirm?.name ?? null,
    title: contact.currentTitle,
    group: contact.currentGroup,
    location: contact.location,
    priority: contact.priority,
    warmth: contact.warmth,
    stage: contact.relationshipStage,
    lastTouchAt: contact.lastTouchAt?.toISOString() ?? null,
    nextTouchAt: contact.nextTouchAt?.toISOString() ?? null,
    activeCampaign: contact.outreachCampaigns[0]?.name ?? null,
    tags: contact.tags.map(({ tag }) => ({ id: tag.id, name: tag.name }))
  }));
  return (
    <div>
      <PageHeader
        title="Contacts"
        description="Dense relationship table for finance recruiting, alumni, bankers, investors, and recruiters."
        actions={
          <>
            <Button variant="outline" size="sm" disabled><Upload className="h-4 w-4" /> Import CSV</Button>
            <Button variant="outline" size="sm" disabled><Download className="h-4 w-4" /> Export CSV</Button>
            <ButtonLink href="/contacts/new" size="sm"><Plus className="h-4 w-4" /> Add contact</ButtonLink>
          </>
        }
      />
      <form className="mb-3 grid gap-2 rounded-lg border bg-card p-3 md:grid-cols-6">
        <Input name="search" placeholder="Search contacts..." defaultValue={typeof params.search === "string" ? params.search : ""} />
        <Select name="firm"><option value="">Firm</option>{refs.firms.map((firm) => <option key={firm.id} value={firm.id}>{firm.name}</option>)}</Select>
        <Select name="priority"><option value="">Priority</option>{priorityOptions.map((o) => <option key={o} value={o}>{o}</option>)}</Select>
        <Select name="warmth"><option value="">Warmth</option>{warmthOptions.map((o) => <option key={o} value={o}>{o}</option>)}</Select>
        <Select name="stage"><option value="">Stage</option>{relationshipStageOptions.map((o) => <option key={o} value={o}>{o}</option>)}</Select>
        <Button variant="secondary" type="submit">Filter</Button>
      </form>
      <ContactsTable rows={rows} />
    </div>
  );
}
