import { Building2, MailQuestion, Search, UserRoundSearch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

const lanes = [
  { title: "Identify person", icon: UserRoundSearch, detail: "Manual source queue" },
  { title: "Firm context", icon: Building2, detail: "Coverage and team notes" },
  { title: "Find email", icon: MailQuestion, detail: "No scraping or browser automation" },
  { title: "Ready for campaign", icon: Search, detail: "Move into Campaigns" }
];

export default function LeadResearchPage() {
  return (
    <div>
      <PageHeader
        title="Lead Research"
        description="Manual research queue for sourcing people, firms, and outreach context."
        actions={<ButtonLink href="/people" variant="outline" size="sm">Open people</ButtonLink>}
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {lanes.map((lane) => {
          const Icon = lane.icon;
          return (
            <Card key={lane.title}>
              <CardContent className="grid gap-3 p-4">
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5 text-primary" />
                  <Badge value="PENDING" />
                </div>
                <div>
                  <div className="text-sm font-medium">{lane.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{lane.detail}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-4">
        <CardHeader><CardTitle>Source Policy</CardTitle></CardHeader>
        <CardContent className="grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
          <div>No LinkedIn scraping.</div>
          <div>No logged-in browser automation.</div>
          <div>Manual and compliant sources first.</div>
        </CardContent>
      </Card>
    </div>
  );
}
