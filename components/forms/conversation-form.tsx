import { Contact, Firm, Warmth } from "@prisma/client";
import { createConversationAction } from "@/lib/actions";
import { label } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { conversationTypeOptions, mediumOptions, warmthOptions } from "@/components/forms/options";

export function ConversationForm({
  contacts,
  firms,
  defaultContactId
}: {
  contacts: Contact[];
  firms: Firm[];
  defaultContactId?: string;
}) {
  const defaultContact = contacts.find((contact) => contact.id === defaultContactId);
  return (
    <form action={createConversationAction} className="grid gap-4">
      <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-2">
          <Field label="Title"><Input name="title" defaultValue={defaultContact ? `Conversation with ${defaultContact.fullName}` : ""} required /></Field>
          <Field label="Contact"><Select name="primaryContactId" defaultValue={defaultContactId ?? ""}><option value="">No primary contact</option>{contacts.map((contact) => <option key={contact.id} value={contact.id}>{contact.fullName}</option>)}</Select></Field>
          <Field label="Firm"><Select name="firmId" defaultValue={defaultContact?.currentFirmId ?? ""}><option value="">No firm</option>{firms.map((firm) => <option key={firm.id} value={firm.id}>{firm.name}</option>)}</Select></Field>
          <Field label="Happened at"><Input name="happenedAt" type="datetime-local" /></Field>
          <Field label="Type"><Select name="conversationType" defaultValue="COFFEE_CHAT">{conversationTypeOptions.map((o) => <option key={o} value={o}>{label(o)}</option>)}</Select></Field>
          <Field label="Medium"><Select name="medium" defaultValue="PHONE">{mediumOptions.map((o) => <option key={o} value={o}>{label(o)}</option>)}</Select></Field>
          <Field label="Duration minutes"><Input name="durationMinutes" type="number" min="0" /></Field>
          <Field label="Warmth after"><Select name="relationshipWarmthAfter" defaultValue={defaultContact?.warmth ?? Warmth.LUKEWARM}>{warmthOptions.map((o) => <option key={o} value={o}>{label(o)}</option>)}</Select></Field>
          <div className="md:col-span-2"><Field label="Summary"><Textarea name="summary" /></Field></div>
          <div className="md:col-span-2"><Field label="Key topics"><Textarea name="keyTopics" /></Field></div>
          <div className="md:col-span-2"><Field label="Raw notes"><Textarea name="rawNotes" /></Field></div>
          <div className="md:col-span-2"><Field label="Raw transcript"><Textarea name="rawTranscript" placeholder="Paste transcript now, or add it on the detail page." /></Field></div>
        </CardContent>
      </Card>
      <div className="flex justify-end"><Button>Create conversation</Button></div>
    </form>
  );
}
