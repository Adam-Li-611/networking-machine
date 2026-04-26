import { notFound } from "next/navigation";
import { Bot, CheckCircle2, Trash2 } from "lucide-react";
import {
  createTaskFromConversationAction,
  deleteRawTranscriptAction,
  processConversationTranscriptAction,
  saveConversationNotesAction
} from "@/lib/actions";
import { getConversationById } from "@/lib/data";
import { formatDate, label } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { warmthOptions } from "@/components/forms/options";

export default async function ConversationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const conversation = await getConversationById(id);
  if (!conversation) notFound();

  const processTranscript = processConversationTranscriptAction.bind(null, conversation.id);
  const saveNotes = saveConversationNotesAction.bind(null, conversation.id);
  const createTask = createTaskFromConversationAction.bind(null, conversation.id);
  const deleteTranscript = deleteRawTranscriptAction.bind(null, conversation.id);
  const aiJson = conversation.aiOutputJson as { mockUsed?: boolean } | null;

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2"><h1 className="text-xl font-semibold">{conversation.title}</h1><Badge value={conversation.aiProcessingStatus} /></div>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatDate(conversation.happenedAt)} · {conversation.primaryContact?.fullName ?? "No contact"} · {conversation.firm?.name ?? "No firm"} · {label(conversation.medium)}
          </p>
        </div>
        {aiJson?.mockUsed ? <Badge value="Mock processing used because no AI key is configured." /> : null}
      </div>

      <div className="grid gap-3 xl:grid-cols-3">
        <Card><CardHeader><CardTitle>Metadata</CardTitle></CardHeader><CardContent className="grid gap-2 text-sm">
          <div><span className="text-muted-foreground">Type:</span> {label(conversation.conversationType)}</div>
          <div><span className="text-muted-foreground">Duration:</span> {conversation.durationMinutes ?? "—"} min</div>
          <div><span className="text-muted-foreground">Warmth after:</span> <Badge value={conversation.relationshipWarmthAfter} /></div>
          <div><span className="text-muted-foreground">Participants:</span> {conversation.participants.map((p) => p.contact.fullName).join(", ") || "—"}</div>
        </CardContent></Card>
        <Card className="xl:col-span-2"><CardHeader><CardTitle>Linked Tasks</CardTitle></CardHeader><CardContent className="grid gap-2">
          {conversation.tasks.map((task) => <div key={task.id} className="rounded-md border p-2"><div className="flex justify-between gap-2"><span className="text-sm font-medium">{task.title}</span><Badge value={task.status} /></div><div className="text-xs text-muted-foreground">{formatDate(task.dueDate)} · {label(task.taskType)}</div></div>)}
        </CardContent></Card>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Raw Transcript</CardTitle></CardHeader>
          <CardContent>
            <form action={processTranscript} className="grid gap-3">
              <Textarea name="rawTranscript" defaultValue={conversation.rawTranscript ?? ""} className="min-h-72" placeholder="Paste transcript here." />
              <div className="flex flex-wrap gap-2">
                <Button type="submit"><Bot className="h-4 w-4" /> Process Transcript</Button>
              </div>
            </form>
            {conversation.rawTranscript ? (
              <form action={deleteTranscript} className="mt-2">
                <Button variant="outline" size="sm"><Trash2 className="h-4 w-4" /> Delete raw transcript</Button>
              </form>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Editable Structured Notes</CardTitle></CardHeader>
          <CardContent>
            <form action={saveNotes} className="grid gap-3">
              <Field label="Summary"><Textarea name="summary" defaultValue={conversation.summary ?? ""} /></Field>
              <Field label="Key topics"><Textarea name="keyTopics" defaultValue={conversation.keyTopics ?? ""} /></Field>
              <Field label="Advice given"><Textarea name="adviceGiven" defaultValue={conversation.adviceGiven ?? ""} /></Field>
              <Field label="Personal hooks"><Textarea name="personalHooks" defaultValue={conversation.personalHooks ?? ""} /></Field>
              <Field label="Firm insights"><Textarea name="firmInsights" defaultValue={conversation.firmInsights ?? ""} /></Field>
              <Field label="Recruiting insights"><Textarea name="recruitingInsights" defaultValue={conversation.recruitingInsights ?? ""} /></Field>
              <Field label="Follow-up angle"><Textarea name="followUpAngle" defaultValue={conversation.followUpAngle ?? ""} /></Field>
              <Field label="Next action"><Input name="nextAction" defaultValue={conversation.nextAction ?? ""} /></Field>
              <Field label="Suggested follow-up date"><Input name="suggestedFollowUpDate" type="date" defaultValue={conversation.suggestedFollowUpDate ? conversation.suggestedFollowUpDate.toISOString().slice(0, 10) : ""} /></Field>
              <Field label="Warmth after"><Select name="relationshipWarmthAfter" defaultValue={conversation.relationshipWarmthAfter ?? "LUKEWARM"}>{warmthOptions.map((o) => <option key={o} value={o}>{label(o)}</option>)}</Select></Field>
              <Field label="Clean notes"><Textarea name="cleanNotes" defaultValue={conversation.cleanNotes ?? ""} /></Field>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="reviewed" /> Mark AI output as reviewed</label>
              <div className="flex flex-wrap gap-2">
                <Button type="submit"><CheckCircle2 className="h-4 w-4" /> Save notes</Button>
              </div>
            </form>
            {conversation.nextAction && conversation.suggestedFollowUpDate ? (
              <form action={createTask} className="mt-2">
                <Button variant="outline" size="sm">Create follow-up task</Button>
              </form>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
