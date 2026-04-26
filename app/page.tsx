import Link from "next/link";
import { ArrowRight, Clock, Flame, MailCheck } from "lucide-react";
import { getDashboardData } from "@/lib/data";
import { formatDate, label } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CoverageChart } from "@/components/dashboard/coverage-chart";
import { PageHeader } from "@/components/page-header";

function ListCard({
  title,
  href,
  children
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Link href={href} className="text-xs text-muted-foreground hover:text-foreground">
          Open
        </Link>
      </CardHeader>
      <CardContent className="grid gap-2">{children}</CardContent>
    </Card>
  );
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  const coverageChart = data.firmCoverageGaps.map((firm) => ({
    name: firm.name.split(" ")[0],
    contacts: firm.contacts.length,
    campaigns: firm.outreachCampaigns.length
  }));

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Today’s follow-ups, cold relationships, active outreach, and firm coverage gaps."
      />

      <div className="mb-4 grid gap-3 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <div className="text-xs text-muted-foreground">Overdue</div>
              <div className="text-2xl font-semibold">{data.overdueTasks.length}</div>
            </div>
            <Flame className="h-5 w-5 text-red-600" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <div className="text-xs text-muted-foreground">Due today</div>
              <div className="text-2xl font-semibold">{data.todayTasks.length}</div>
            </div>
            <Clock className="h-5 w-5 text-amber-600" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <div className="text-xs text-muted-foreground">Active campaigns</div>
              <div className="text-2xl font-semibold">{data.activeCampaigns.length}</div>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-600" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <div className="text-xs text-muted-foreground">Calls needing thanks</div>
              <div className="text-2xl font-semibold">{data.callsMissingThanks.length}</div>
            </div>
            <MailCheck className="h-5 w-5 text-teal-700" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 xl:grid-cols-3">
        <ListCard title="Overdue Tasks" href="/tasks?view=overdue">
          {data.overdueTasks.map((task) => (
            <Link key={task.id} href="/tasks?view=overdue" className="rounded-md border p-2 hover:bg-muted">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{task.title}</span>
                <Badge value={task.priority} />
              </div>
              <div className="text-xs text-muted-foreground">{task.contact?.fullName ?? task.firm?.name ?? "Unlinked"} · {formatDate(task.dueDate)}</div>
            </Link>
          ))}
        </ListCard>

        <ListCard title="Next 7 Days" href="/tasks?view=week">
          {data.upcomingTasks.concat(data.todayTasks).slice(0, 8).map((task) => (
            <Link key={task.id} href="/tasks?view=week" className="rounded-md border p-2 hover:bg-muted">
              <div className="text-sm font-medium">{task.title}</div>
              <div className="text-xs text-muted-foreground">{formatDate(task.dueDate)} · {task.contact?.fullName ?? task.firm?.name ?? "Unlinked"}</div>
            </Link>
          ))}
        </ListCard>

        <ListCard title="Active Outreach" href="/campaigns">
          {data.activeCampaigns.map((campaign) => (
            <Link key={campaign.id} href={`/campaigns/${campaign.id}`} className="rounded-md border p-2 hover:bg-muted">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{campaign.contact.fullName}</span>
                <Badge value={campaign.status} />
              </div>
              <div className="text-xs text-muted-foreground">{campaign.firm?.name ?? "No firm"} · next {formatDate(campaign.nextPlannedTouchAt)}</div>
            </Link>
          ))}
        </ListCard>

        <ListCard title="High Priority Cold Spots" href="/contacts?priority=HIGH">
          {data.coldHighPriority.map((contact) => (
            <Link key={contact.id} href={`/contacts/${contact.id}`} className="rounded-md border p-2 hover:bg-muted">
              <div className="text-sm font-medium">{contact.fullName}</div>
              <div className="text-xs text-muted-foreground">{contact.currentFirm?.name ?? "No firm"} · last touch {formatDate(contact.lastTouchAt)}</div>
            </Link>
          ))}
        </ListCard>

        <ListCard title="Warm Contacts Going Quiet" href="/contacts?warmth=WARM">
          {data.warmNoTouch.map((contact) => (
            <Link key={contact.id} href={`/contacts/${contact.id}`} className="rounded-md border p-2 hover:bg-muted">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{contact.fullName}</span>
                <Badge value={contact.warmth} />
              </div>
              <div className="text-xs text-muted-foreground">{contact.currentFirm?.name ?? "No firm"} · {formatDate(contact.lastTouchAt)}</div>
            </Link>
          ))}
        </ListCard>

        <ListCard title="Recent Conversations" href="/conversations">
          {data.recentConversations.map((conversation) => (
            <Link key={conversation.id} href={`/conversations/${conversation.id}`} className="rounded-md border p-2 hover:bg-muted">
              <div className="text-sm font-medium">{conversation.title}</div>
              <div className="text-xs text-muted-foreground">{conversation.primaryContact?.fullName ?? "No contact"} · {formatDate(conversation.happenedAt)}</div>
            </Link>
          ))}
        </ListCard>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Firm Coverage Gaps</CardTitle>
          </CardHeader>
          <CardContent>
            <CoverageChart data={coverageChart} />
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {data.firmCoverageGaps.map((firm) => (
                <Link key={firm.id} href={`/firms/${firm.id}`} className="rounded-md border p-2 hover:bg-muted">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{firm.name}</span>
                    <Badge value={firm.coverageStrength} />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {firm.contacts.length} contacts · {firm.outreachCampaigns.length} campaigns · {label(firm.firmType)}
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <ListCard title="Recently Added Contacts" href="/contacts">
          {data.recentContacts.map((contact) => (
            <Link key={contact.id} href={`/contacts/${contact.id}`} className="rounded-md border p-2 hover:bg-muted">
              <div className="text-sm font-medium">{contact.fullName}</div>
              <div className="text-xs text-muted-foreground">{contact.currentFirm?.name ?? "No firm"} · {contact.currentTitle ?? "No title"}</div>
            </Link>
          ))}
        </ListCard>
      </div>
    </div>
  );
}
