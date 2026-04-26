import Link from "next/link";
import { Plus } from "lucide-react";
import { snoozeTaskAction, updateTaskStatusAction } from "@/lib/actions";
import { getTasks } from "@/lib/data";
import { formatDate, label } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Table, Td, Th } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";

const views = [
  ["today", "Today"],
  ["overdue", "Overdue"],
  ["week", "This week"],
  ["high", "High priority"],
  ["firm", "By firm"],
  ["campaign", "By campaign"],
  ["completed", "Completed"]
];

export default async function TasksPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const activeView = typeof params.view === "string" ? params.view : "today";
  const tasks = await getTasks(params);
  return (
    <div>
      <PageHeader title="Tasks" description="Open, overdue, snoozed, and completed follow-ups." actions={<ButtonLink href="/tasks/new" size="sm"><Plus className="h-4 w-4" /> Create task</ButtonLink>} />
      <div className="mb-3 flex flex-wrap gap-2">
        {views.map(([view, text]) => <Link key={view} href={`/tasks?view=${view}`} className={`rounded-md border px-3 py-1.5 text-sm ${activeView === view ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}>{text}</Link>)}
      </div>
      <div className="overflow-hidden rounded-lg border bg-card">
        <Table><thead><tr><Th>Due date</Th><Th>Task title</Th><Th>Contact</Th><Th>Firm</Th><Th>Campaign</Th><Th>Conversation</Th><Th>Priority</Th><Th>Status</Th><Th>Type</Th><Th>Actions</Th></tr></thead><tbody>
          {tasks.map((task) => {
            const done = updateTaskStatusAction.bind(null, task.id, "DONE");
            const cancel = updateTaskStatusAction.bind(null, task.id, "CANCELLED");
            const snooze = snoozeTaskAction.bind(null, task.id);
            return (
              <tr key={task.id} className="hover:bg-muted/60">
                <Td>{formatDate(task.dueDate)}</Td>
                <Td className="font-medium">{task.title}<div className="text-xs text-muted-foreground">{task.notes}</div></Td>
                <Td>{task.contact ? <Link href={`/contacts/${task.contact.id}`} className="hover:underline">{task.contact.fullName}</Link> : "—"}</Td>
                <Td>{task.firm?.name ?? "—"}</Td>
                <Td>{task.campaign ? <Link href={`/campaigns/${task.campaign.id}`} className="hover:underline">{task.campaign.name}</Link> : "—"}</Td>
                <Td>{task.conversation ? <Link href={`/conversations/${task.conversation.id}`} className="hover:underline">{task.conversation.title}</Link> : "—"}</Td>
                <Td><Badge value={task.priority} /></Td>
                <Td><Badge value={task.status} /></Td>
                <Td>{label(task.taskType)}</Td>
                <Td><div className="flex gap-1"><form action={done}><Button size="sm" variant="outline">Done</Button></form><form action={snooze}><Button size="sm" variant="secondary">Snooze</Button></form><form action={cancel}><Button size="sm" variant="ghost">Cancel</Button></form></div></Td>
              </tr>
            );
          })}
        </tbody></Table>
      </div>
    </div>
  );
}
