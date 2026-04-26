import { prisma } from "@/lib/prisma";
import { label } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { relationshipStageOptions } from "@/components/forms/options";

export default async function SettingsPage() {
  const [tags, integrations] = await Promise.all([
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.integrationStub.findMany({ orderBy: { integrationType: "asc" } })
  ]);
  return (
    <div>
      <PageHeader title="Settings" description="Tags, relationship stages, follow-up defaults, import/export placeholders, and future integrations." />
      <div className="grid gap-3 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Tags</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {tags.map((tag) => <Badge key={tag.id} value={tag.name} />)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Relationship Stages</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {relationshipStageOptions.map((stage) => <Badge key={stage} value={stage} />)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Default Follow-up Rules</CardTitle></CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div>Initial outreach suggests follow-up in 5 business days.</div>
            <div>Follow-up 1 suggests follow-up 2 in 7 to 10 business days.</div>
            <div>Conversations suggest same-day thank-you tasks.</div>
            <div>Warm and strong conversations suggest reconnect reminders 45 to 60 days later.</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Data Import and Export</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button disabled variant="outline">Import CSV Coming later</Button>
            <Button disabled variant="outline">Export CSV Coming later</Button>
          </CardContent>
        </Card>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader><CardTitle>{label(integration.integrationType)}</CardTitle></CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <Badge value={integration.status} />
              <p className="text-muted-foreground">{integration.notes ?? "Coming later."}</p>
              <Button disabled variant="outline">Connect Coming later</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
