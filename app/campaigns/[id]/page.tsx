import { notFound } from "next/navigation";
import { updateCampaignStatusAction } from "@/lib/actions";
import { getCampaignById } from "@/lib/data";
import { formatDate, formatDateTime, label } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TouchForm } from "@/components/forms/touch-form";

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await getCampaignById(id);
  if (!campaign) notFound();
  const markReplied = updateCampaignStatusAction.bind(null, campaign.id, "REPLIED");
  const markScheduled = updateCampaignStatusAction.bind(null, campaign.id, "CALL_SCHEDULED");
  const markCompleted = updateCampaignStatusAction.bind(null, campaign.id, "CALL_COMPLETED");
  const pause = updateCampaignStatusAction.bind(null, campaign.id, "PAUSED");
  const close = updateCampaignStatusAction.bind(null, campaign.id, "CLOSED_NO_RESPONSE");

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2"><h1 className="text-xl font-semibold">{campaign.name}</h1><Badge value={campaign.status} /><Badge value={campaign.priority} /></div>
          <p className="mt-1 text-sm text-muted-foreground">{campaign.contact.fullName} · {campaign.firm?.name ?? "No firm"} · {label(campaign.campaignType)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <form action={markReplied}><Button variant="outline" size="sm">Mark replied</Button></form>
          <form action={markScheduled}><Button variant="outline" size="sm">Call scheduled</Button></form>
          <form action={markCompleted}><Button variant="outline" size="sm">Call completed</Button></form>
          <form action={pause}><Button variant="secondary" size="sm">Pause</Button></form>
          <form action={close}><Button variant="destructive" size="sm">Close no response</Button></form>
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-3">
        <Card><CardHeader><CardTitle>Campaign Summary</CardTitle></CardHeader><CardContent className="grid gap-2 text-sm">
          <div><span className="text-muted-foreground">Started:</span> {formatDate(campaign.startedAt)}</div>
          <div><span className="text-muted-foreground">Last touch:</span> {formatDate(campaign.lastTouchAt)}</div>
          <div><span className="text-muted-foreground">Next touch:</span> {formatDate(campaign.nextPlannedTouchAt)}</div>
          <div><span className="text-muted-foreground">Outcome:</span> {campaign.outcome ?? "—"}</div>
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Goal</CardTitle></CardHeader><CardContent className="whitespace-pre-wrap text-sm">{campaign.goal ?? "No goal captured."}</CardContent></Card>
        <Card><CardHeader><CardTitle>Outcome Notes</CardTitle></CardHeader><CardContent className="whitespace-pre-wrap text-sm">{campaign.notes ?? "No notes yet."}</CardContent></Card>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        <Card><CardHeader><CardTitle>Touch Timeline</CardTitle></CardHeader><CardContent className="grid gap-2">
          {campaign.touches.map((touch) => (
            <div key={touch.id} className="rounded-md border p-2">
              <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-sm font-medium">{touch.subject ?? label(touch.touchType)}</span><Badge value={touch.status} /></div>
              <div className="text-xs text-muted-foreground">{label(touch.touchType)} · {label(touch.channel)} · {label(touch.direction)} · {formatDateTime(touch.occurredAt)}</div>
              {touch.messageBody ? <p className="mt-2 whitespace-pre-wrap text-sm">{touch.messageBody}</p> : null}
            </div>
          ))}
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Add Touch</CardTitle></CardHeader><CardContent><TouchForm campaignId={campaign.id} /></CardContent></Card>
      </div>

      <Card><CardHeader><CardTitle>Linked Tasks</CardTitle></CardHeader><CardContent className="grid gap-2 md:grid-cols-2">
        {campaign.tasks.map((task) => <div key={task.id} className="rounded-md border p-2"><div className="flex justify-between gap-2"><span className="text-sm font-medium">{task.title}</span><Badge value={task.status} /></div><div className="text-xs text-muted-foreground">{formatDate(task.dueDate)} · {label(task.taskType)}</div></div>)}
      </CardContent></Card>
    </div>
  );
}
