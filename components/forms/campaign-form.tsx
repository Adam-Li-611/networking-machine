import { Contact, Firm } from "@prisma/client";
import { createCampaignAction } from "@/lib/actions";
import { label } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { campaignStatusOptions, campaignTypeOptions, priorityOptions } from "@/components/forms/options";

export function CampaignForm({ contacts, firms, defaultContactId }: { contacts: Contact[]; firms: Firm[]; defaultContactId?: string }) {
  const contact = contacts.find((item) => item.id === defaultContactId);
  return (
    <form action={createCampaignAction} className="grid gap-4">
      <Card><CardContent className="grid gap-3 p-4 md:grid-cols-2">
        <Field label="Campaign name"><Input name="name" defaultValue={contact ? `Outreach to ${contact.fullName}` : ""} required /></Field>
        <Field label="Contact"><Select name="contactId" defaultValue={defaultContactId ?? ""} required><option value="">Contact</option>{contacts.map((c) => <option key={c.id} value={c.id}>{c.fullName}</option>)}</Select></Field>
        <Field label="Firm"><Select name="firmId" defaultValue={contact?.currentFirmId ?? ""}><option value="">No firm</option>{firms.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}</Select></Field>
        <Field label="Campaign type"><Select name="campaignType" defaultValue="COLD_NETWORKING">{campaignTypeOptions.map((o) => <option key={o} value={o}>{label(o)}</option>)}</Select></Field>
        <Field label="Status"><Select name="status" defaultValue="NOT_STARTED">{campaignStatusOptions.map((o) => <option key={o} value={o}>{label(o)}</option>)}</Select></Field>
        <Field label="Priority"><Select name="priority" defaultValue={contact?.priority ?? "MEDIUM"}>{priorityOptions.map((o) => <option key={o} value={o}>{label(o)}</option>)}</Select></Field>
        <Field label="Started at"><Input name="startedAt" type="date" /></Field>
        <Field label="Next planned touch"><Input name="nextPlannedTouchAt" type="date" /></Field>
        <div className="md:col-span-2"><Field label="Goal"><Textarea name="goal" /></Field></div>
        <div className="md:col-span-2"><Field label="Notes"><Textarea name="notes" /></Field></div>
      </CardContent></Card>
      <div className="flex justify-end"><Button>Create campaign</Button></div>
    </form>
  );
}
