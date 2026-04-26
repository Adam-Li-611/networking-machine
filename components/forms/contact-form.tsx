import { Contact, Firm, Tag } from "@prisma/client";
import { createContactAction, updateContactAction } from "@/lib/actions";
import { label } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { priorityOptions, relevanceOptions, relationshipStageOptions, warmthOptions } from "@/components/forms/options";

export function ContactForm({
  contact,
  firms,
  tags
}: {
  contact?: Contact & { tags?: { tagId: string }[] };
  firms: Firm[];
  tags: Tag[];
}) {
  const action = contact ? updateContactAction.bind(null, contact.id) : createContactAction;
  const selectedTags = new Set(contact?.tags?.map((tag) => tag.tagId));
  return (
    <form action={action} className="grid gap-4">
      <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-2">
          <Field label="First name"><Input name="firstName" defaultValue={contact?.firstName} required /></Field>
          <Field label="Last name"><Input name="lastName" defaultValue={contact?.lastName} required /></Field>
          <Field label="Email"><Input name="primaryEmail" type="email" defaultValue={contact?.primaryEmail ?? ""} /></Field>
          <Field label="Secondary email"><Input name="secondaryEmail" type="email" defaultValue={contact?.secondaryEmail ?? ""} /></Field>
          <Field label="Phone"><Input name="phone" defaultValue={contact?.phone ?? ""} /></Field>
          <Field label="LinkedIn URL"><Input name="linkedinUrl" defaultValue={contact?.linkedinUrl ?? ""} /></Field>
          <Field label="Firm">
            <Select name="currentFirmId" defaultValue={contact?.currentFirmId ?? ""}>
              <option value="">No firm</option>
              {firms.map((firm) => <option key={firm.id} value={firm.id}>{firm.name}</option>)}
            </Select>
          </Field>
          <Field label="Title"><Input name="currentTitle" defaultValue={contact?.currentTitle ?? ""} /></Field>
          <Field label="Group"><Input name="currentGroup" defaultValue={contact?.currentGroup ?? ""} /></Field>
          <Field label="Location"><Input name="location" defaultValue={contact?.location ?? ""} /></Field>
          <Field label="Timezone"><Input name="timezone" defaultValue={contact?.timezone ?? "America/New_York"} /></Field>
          <Field label="Source"><Input name="source" defaultValue={contact?.source ?? ""} /></Field>
          <Field label="School / affiliation"><Input name="schoolOrAffiliation" defaultValue={contact?.schoolOrAffiliation ?? ""} /></Field>
          <Field label="Priority">
            <Select name="priority" defaultValue={contact?.priority ?? "MEDIUM"}>{priorityOptions.map((option) => <option key={option} value={option}>{label(option)}</option>)}</Select>
          </Field>
          <Field label="Warmth">
            <Select name="warmth" defaultValue={contact?.warmth ?? "COLD"}>{warmthOptions.map((option) => <option key={option} value={option}>{label(option)}</option>)}</Select>
          </Field>
          <Field label="Recruiting relevance">
            <Select name="recruitingRelevance" defaultValue={contact?.recruitingRelevance ?? "MEDIUM"}>{relevanceOptions.map((option) => <option key={option} value={option}>{label(option)}</option>)}</Select>
          </Field>
          <Field label="Relationship stage">
            <Select name="relationshipStage" defaultValue={contact?.relationshipStage ?? "TARGET_IDENTIFIED"}>{relationshipStageOptions.map((option) => <option key={option} value={option}>{label(option)}</option>)}</Select>
          </Field>
          <div className="md:col-span-2">
            <Field label="Tags">
              <div className="flex flex-wrap gap-2 rounded-md border bg-background p-2">
                {tags.map((tag) => (
                  <label key={tag.id} className="flex items-center gap-1 text-xs">
                    <input type="checkbox" name="tagIds" value={tag.id} defaultChecked={selectedTags.has(tag.id)} />
                    {tag.name}
                  </label>
                ))}
              </div>
            </Field>
          </div>
          <div className="md:col-span-2"><Field label="Personal hooks"><Textarea name="personalHooks" defaultValue={contact?.personalHooks ?? ""} /></Field></div>
          <div className="md:col-span-2"><Field label="Notes"><Textarea name="generalNotes" defaultValue={contact?.generalNotes ?? ""} /></Field></div>
        </CardContent>
      </Card>
      <div className="flex justify-end"><Button type="submit">{contact ? "Save contact" : "Create contact"}</Button></div>
    </form>
  );
}
