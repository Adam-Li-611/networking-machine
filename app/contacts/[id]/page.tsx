import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarPlus, Edit, MessageSquarePlus, Moon, Plus, ShieldX } from "lucide-react";
import { createPositionAction, markContactStatusAction } from "@/lib/actions";
import { getContactById, getReferenceData } from "@/lib/data";
import { formatDate, formatDateTime, label } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Table, Td, Th } from "@/components/ui/table";

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [contact, refs] = await Promise.all([getContactById(id), getReferenceData()]);
  if (!contact) notFound();

  const markDormant = markContactStatusAction.bind(null, contact.id, "DORMANT");
  const markDnc = markContactStatusAction.bind(null, contact.id, "DO_NOT_CONTACT");
  const addPosition = createPositionAction.bind(null, contact.id);
  const timeline = [
    ...contact.conversationParticipants.map((item) => ({
      id: item.conversation.id,
      date: item.conversation.happenedAt,
      type: "Conversation",
      title: item.conversation.title,
      href: `/conversations/${item.conversation.id}`
    })),
    ...contact.outreachTouches.map((touch) => ({
      id: touch.id,
      date: touch.occurredAt,
      type: label(touch.touchType),
      title: touch.subject ?? touch.campaign.name,
      href: `/campaigns/${touch.campaignId}`
    })),
    ...contact.tasks.map((task) => ({
      id: task.id,
      date: task.dueDate ?? task.createdAt,
      type: `Task: ${label(task.status)}`,
      title: task.title,
      href: "/tasks"
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">{contact.fullName}</h1>
            <Badge value={contact.priority} />
            <Badge value={contact.warmth} />
            <Badge value={contact.relationshipStage} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {contact.currentTitle ?? "No title"} {contact.currentFirm ? `at ${contact.currentFirm.name}` : ""} · {contact.currentGroup ?? "No group"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href={`/contacts/${contact.id}/edit`} variant="outline" size="sm"><Edit className="h-4 w-4" /> Edit</ButtonLink>
          <ButtonLink href={`/conversations/new?contactId=${contact.id}`} variant="outline" size="sm"><MessageSquarePlus className="h-4 w-4" /> Add conversation</ButtonLink>
          <ButtonLink href={`/campaigns/new?contactId=${contact.id}`} variant="outline" size="sm"><CalendarPlus className="h-4 w-4" /> Create campaign</ButtonLink>
          <ButtonLink href={`/tasks/new?contactId=${contact.id}`} size="sm"><Plus className="h-4 w-4" /> Follow-up</ButtonLink>
          <form action={markDormant}><Button variant="secondary" size="sm"><Moon className="h-4 w-4" /> Dormant</Button></form>
          <form action={markDnc}><Button variant="destructive" size="sm"><ShieldX className="h-4 w-4" /> Do not contact</Button></form>
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div><span className="text-muted-foreground">Email:</span> {contact.primaryEmail ?? "—"}</div>
            <div><span className="text-muted-foreground">LinkedIn:</span> {contact.linkedinUrl ? <a href={contact.linkedinUrl} className="hover:underline">Open profile</a> : "—"}</div>
            <div><span className="text-muted-foreground">Location:</span> {contact.location ?? "—"}</div>
            <div><span className="text-muted-foreground">Timezone:</span> {contact.timezone ?? "—"}</div>
            <div><span className="text-muted-foreground">Source:</span> {contact.source ?? "—"}</div>
            <div><span className="text-muted-foreground">Last touch:</span> {formatDate(contact.lastTouchAt)}</div>
            <div className="flex flex-wrap gap-1 pt-1">{contact.tags.map(({ tag }) => <Badge key={tag.id} value={tag.name} />)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Personal Hooks</CardTitle></CardHeader>
          <CardContent className="whitespace-pre-wrap text-sm">{contact.personalHooks ?? "No hooks captured yet."}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>General Notes</CardTitle></CardHeader>
          <CardContent className="whitespace-pre-wrap text-sm">{contact.generalNotes ?? "No notes yet."}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Position History</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border">
            <Table>
              <thead><tr><Th>Firm</Th><Th>Title</Th><Th>Group</Th><Th>Location</Th><Th>Dates</Th><Th>Current</Th></tr></thead>
              <tbody>
                {contact.positions.map((position) => (
                  <tr key={position.id}>
                    <Td>{position.firm.name}</Td><Td>{position.title}</Td><Td>{position.groupName ?? "—"}</Td><Td>{position.location ?? "—"}</Td>
                    <Td>{formatDate(position.startDate)} - {formatDate(position.endDate)}</Td><Td>{position.isCurrent ? <Badge value="CURRENT" /> : "—"}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <form action={addPosition} className="mt-3 grid gap-2 md:grid-cols-7">
            <Select name="firmId" required><option value="">Firm</option>{refs.firms.map((firm) => <option key={firm.id} value={firm.id}>{firm.name}</option>)}</Select>
            <Input name="title" placeholder="Title" required />
            <Input name="groupName" placeholder="Group" />
            <Input name="location" placeholder="Location" />
            <Input name="startDate" type="date" />
            <label className="flex items-center gap-2 text-xs"><input name="isCurrent" type="checkbox" /> Current</label>
            <Button type="submit" variant="secondary">Add position</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-3 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Relationship Timeline</CardTitle></CardHeader>
          <CardContent className="grid gap-2">
            {timeline.map((item) => (
              <Link key={`${item.type}-${item.id}`} href={item.href} className="rounded-md border p-2 hover:bg-muted">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{item.title}</span>
                  <span className="text-xs text-muted-foreground">{formatDateTime(item.date)}</span>
                </div>
                <div className="text-xs text-muted-foreground">{item.type}</div>
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Future Gmail Threads</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Gmail thread matching will appear here after OAuth and sync are added. No email is read, drafted, or sent in this version.
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 xl:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Outreach Campaigns</CardTitle></CardHeader>
          <CardContent className="grid gap-2">
            {contact.outreachCampaigns.map((campaign) => (
              <Link key={campaign.id} href={`/campaigns/${campaign.id}`} className="rounded-md border p-2 hover:bg-muted">
                <div className="flex justify-between gap-2"><span className="text-sm font-medium">{campaign.name}</span><Badge value={campaign.status} /></div>
                <div className="text-xs text-muted-foreground">{campaign.touches.length} touches · next {formatDate(campaign.nextPlannedTouchAt)}</div>
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Tasks</CardTitle></CardHeader>
          <CardContent className="grid gap-2">
            {contact.tasks.slice(0, 8).map((task) => (
              <div key={task.id} className="rounded-md border p-2">
                <div className="flex justify-between gap-2"><span className="text-sm font-medium">{task.title}</span><Badge value={task.status} /></div>
                <div className="text-xs text-muted-foreground">{formatDate(task.dueDate)} · {label(task.taskType)}</div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Quick Note</CardTitle></CardHeader>
          <CardContent>
            <Field label="Scratchpad"><Textarea placeholder="Use edit contact for saved notes." disabled /></Field>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
