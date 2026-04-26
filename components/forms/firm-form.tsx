import { createFirmAction } from "@/lib/actions";
import { label } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { coverageOptions, firmTypeOptions, priorityOptions, relevanceOptions, targetStatusOptions } from "@/components/forms/options";

export function FirmForm() {
  return (
    <form action={createFirmAction} className="grid gap-4">
      <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-2">
          <Field label="Firm name"><Input name="name" required /></Field>
          <Field label="Firm type"><Select name="firmType" defaultValue="OTHER">{firmTypeOptions.map((o) => <option key={o} value={o}>{label(o)}</option>)}</Select></Field>
          <Field label="Strategy"><Input name="strategy" /></Field>
          <Field label="Website"><Input name="website" /></Field>
          <Field label="Priority"><Select name="priority" defaultValue="MEDIUM">{priorityOptions.map((o) => <option key={o} value={o}>{label(o)}</option>)}</Select></Field>
          <Field label="Recruiting relevance"><Select name="recruitingRelevance" defaultValue="MEDIUM">{relevanceOptions.map((o) => <option key={o} value={o}>{label(o)}</option>)}</Select></Field>
          <Field label="Coverage strength"><Select name="coverageStrength" defaultValue="NONE">{coverageOptions.map((o) => <option key={o} value={o}>{label(o)}</option>)}</Select></Field>
          <Field label="Target status"><Select name="targetStatus" defaultValue="TARGET">{targetStatusOptions.map((o) => <option key={o} value={o}>{label(o)}</option>)}</Select></Field>
          <div className="md:col-span-2"><Field label="Notes"><Textarea name="notes" /></Field></div>
        </CardContent>
      </Card>
      <div className="flex justify-end"><Button>Create firm</Button></div>
    </form>
  );
}
