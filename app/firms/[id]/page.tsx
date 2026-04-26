import Link from "next/link";
import { notFound } from "next/navigation";
import { refreshFirmCoverageAction } from "@/lib/actions";
import { getFirmById } from "@/lib/data";
import { formatDate, label } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";

export default async function FirmDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const firm = await getFirmById(id);
  if (!firm) notFound();
  const refreshCoverage = refreshFirmCoverageAction.bind(null, firm.id);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2"><h1 className="text-xl font-semibold">{firm.name}</h1><Badge value={firm.priority} /><Badge value={firm.coverageStrength} /></div>
          <p className="mt-1 text-sm text-muted-foreground">{label(firm.firmType)} · {firm.strategy ?? "No strategy noted"}</p>
        </div>
        <form action={refreshCoverage}><Button variant="outline" size="sm">Recalculate coverage</Button></form>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <Card><CardHeader><CardTitle>Firm Profile</CardTitle></CardHeader><CardContent className="grid gap-2 text-sm">
          <div><span className="text-muted-foreground">Target status:</span> {label(firm.targetStatus)}</div>
          <div><span className="text-muted-foreground">Recruiting relevance:</span> {label(firm.recruitingRelevance)}</div>
          <div><span className="text-muted-foreground">Website:</span> {firm.website ? <a href={firm.website} className="hover:underline">{firm.website}</a> : "—"}</div>
        </CardContent></Card>
        <Card className="lg:col-span-2"><CardHeader><CardTitle>Notes</CardTitle></CardHeader><CardContent className="whitespace-pre-wrap text-sm">{firm.notes ?? "No notes yet."}</CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Contacts at Firm</CardTitle></CardHeader>
        <CardContent><Table><thead><tr><Th>Name</Th><Th>Title</Th><Th>Group</Th><Th>Warmth</Th><Th>Stage</Th><Th>Tags</Th></tr></thead><tbody>
          {firm.contacts.map((contact) => (
            <tr key={contact.id}><Td><Link href={`/contacts/${contact.id}`} className="font-medium hover:underline">{contact.fullName}</Link></Td><Td>{contact.currentTitle ?? "—"}</Td><Td>{contact.currentGroup ?? "—"}</Td><Td><Badge value={contact.warmth} /></Td><Td><Badge value={contact.relationshipStage} /></Td><Td><div className="flex flex-wrap gap-1">{contact.tags.map(({ tag }) => <Badge key={tag.id} value={tag.name} />)}</div></Td></tr>
          ))}
        </tbody></Table></CardContent>
      </Card>

      <div className="grid gap-3 xl:grid-cols-3">
        <Card><CardHeader><CardTitle>Conversations</CardTitle></CardHeader><CardContent className="grid gap-2">
          {firm.conversations.map((conversation) => <Link key={conversation.id} href={`/conversations/${conversation.id}`} className="rounded-md border p-2 hover:bg-muted"><div className="text-sm font-medium">{conversation.title}</div><div className="text-xs text-muted-foreground">{conversation.primaryContact?.fullName ?? "No contact"} · {formatDate(conversation.happenedAt)}</div></Link>)}
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Campaigns</CardTitle></CardHeader><CardContent className="grid gap-2">
          {firm.outreachCampaigns.map((campaign) => <Link key={campaign.id} href={`/campaigns/${campaign.id}`} className="rounded-md border p-2 hover:bg-muted"><div className="flex justify-between gap-2"><span className="text-sm font-medium">{campaign.name}</span><Badge value={campaign.status} /></div><div className="text-xs text-muted-foreground">{campaign.contact.fullName} · {campaign.touches.length} touches</div></Link>)}
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Tasks</CardTitle></CardHeader><CardContent className="grid gap-2">
          {firm.tasks.map((task) => <div key={task.id} className="rounded-md border p-2"><div className="flex justify-between gap-2"><span className="text-sm font-medium">{task.title}</span><Badge value={task.status} /></div><div className="text-xs text-muted-foreground">{task.contact?.fullName ?? "No contact"} · {formatDate(task.dueDate)}</div></div>)}
        </CardContent></Card>
      </div>
    </div>
  );
}
