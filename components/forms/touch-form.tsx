import { addOutreachTouchAction } from "@/lib/actions";
import { label } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { channelOptions, directionOptions, touchStatusOptions, touchTypeOptions } from "@/components/forms/options";

export function TouchForm({ campaignId }: { campaignId: string }) {
  const action = addOutreachTouchAction.bind(null, campaignId);
  return (
    <form action={action} className="grid gap-2 rounded-md border bg-background p-3 md:grid-cols-2">
      <Field label="Touch type"><Select name="touchType" defaultValue="INITIAL_OUTREACH">{touchTypeOptions.map((o) => <option key={o} value={o}>{label(o)}</option>)}</Select></Field>
      <Field label="Occurred at"><Input name="occurredAt" type="datetime-local" /></Field>
      <Field label="Channel"><Select name="channel" defaultValue="EMAIL">{channelOptions.map((o) => <option key={o} value={o}>{label(o)}</option>)}</Select></Field>
      <Field label="Direction"><Select name="direction" defaultValue="OUTBOUND">{directionOptions.map((o) => <option key={o} value={o}>{label(o)}</option>)}</Select></Field>
      <Field label="Status"><Select name="status" defaultValue="SENT">{touchStatusOptions.map((o) => <option key={o} value={o}>{label(o)}</option>)}</Select></Field>
      <Field label="Subject"><Input name="subject" /></Field>
      <div className="md:col-span-2"><Field label="Message body"><Textarea name="messageBody" /></Field></div>
      <div className="md:col-span-2"><Field label="Notes"><Textarea name="notes" /></Field></div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="responseReceived" /> Response received</label>
      <div className="flex justify-end"><Button variant="secondary">Add touch</Button></div>
    </form>
  );
}
