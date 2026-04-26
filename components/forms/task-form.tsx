import { Contact, Conversation, Firm, OutreachCampaign } from "@prisma/client";
import { createTaskAction } from "@/lib/actions";
import { label } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { priorityOptions, taskStatusOptions, taskTypeOptions } from "@/components/forms/options";

export function TaskForm({
  contacts,
  firms,
  campaigns,
  conversations,
  defaultContactId
}: {
  contacts: Contact[];
  firms: Firm[];
  campaigns: (OutreachCampaign & { contact: Contact })[];
  conversations: Conversation[];
  defaultContactId?: string;
}) {
  const contact = contacts.find((item) => item.id === defaultContactId);
  return (
    <form action={createTaskAction} className="grid gap-4">
      <Card><CardContent className="grid gap-3 p-4 md:grid-cols-2">
        <Field label="Task title"><Input name="title" defaultValue={contact ? `Follow up with ${contact.fullName}` : ""} required /></Field>
        <Field label="Due date"><Input name="dueDate" type="datetime-local" /></Field>
        <Field label="Contact"><Select name="contactId" defaultValue={defaultContactId ?? ""}><option value="">No contact</option>{contacts.map((c) => <option key={c.id} value={c.id}>{c.fullName}</option>)}</Select></Field>
        <Field label="Firm"><Select name="firmId" defaultValue={contact?.currentFirmId ?? ""}><option value="">No firm</option>{firms.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}</Select></Field>
        <Field label="Campaign"><Select name="campaignId"><option value="">No campaign</option>{campaigns.map((c) => <option key={c.id} value={c.id}>{c.name} · {c.contact.fullName}</option>)}</Select></Field>
        <Field label="Conversation"><Select name="conversationId"><option value="">No conversation</option>{conversations.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}</Select></Field>
        <Field label="Type"><Select name="taskType" defaultValue="SEND_FOLLOW_UP">{taskTypeOptions.map((o) => <option key={o} value={o}>{label(o)}</option>)}</Select></Field>
        <Field label="Priority"><Select name="priority" defaultValue={contact?.priority ?? "MEDIUM"}>{priorityOptions.map((o) => <option key={o} value={o}>{label(o)}</option>)}</Select></Field>
        <Field label="Status"><Select name="status" defaultValue="OPEN">{taskStatusOptions.map((o) => <option key={o} value={o}>{label(o)}</option>)}</Select></Field>
        <div className="md:col-span-2"><Field label="Notes"><Textarea name="notes" /></Field></div>
      </CardContent></Card>
      <div className="flex justify-end"><Button>Create task</Button></div>
    </form>
  );
}
