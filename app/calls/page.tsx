import { CalendarClock, FileText, MessageSquareText, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

const briefSections = [
  "Person overview",
  "Firm/team overview",
  "Previous emails/replies",
  "Background overlap",
  "Suggested questions",
  "Specific ask",
  "Topics to avoid",
  "Useful prior notes"
];

export default function CallsPage() {
  return (
    <div>
      <PageHeader
        title="Calls"
        description="Call prep, notes, transcripts, and follow-up memory."
        actions={<ButtonLink href="/conversations" variant="outline" size="sm">Open conversations</ButtonLink>}
      />

      <div className="grid gap-3 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-start justify-between gap-3 p-4">
            <div>
              <div className="text-xs text-muted-foreground">Upcoming calls</div>
              <div className="mt-1 text-2xl font-semibold">0</div>
              <div className="mt-1 text-xs text-muted-foreground">Manual call records arrive in Segment 7</div>
            </div>
            <CalendarClock className="mt-1 h-5 w-5 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-start justify-between gap-3 p-4">
            <div>
              <div className="text-xs text-muted-foreground">Briefs needed</div>
              <div className="mt-1 text-2xl font-semibold">0</div>
              <div className="mt-1 text-xs text-muted-foreground">Prep generation is pending</div>
            </div>
            <FileText className="mt-1 h-5 w-5 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-start justify-between gap-3 p-4">
            <div>
              <div className="text-xs text-muted-foreground">Transcripts</div>
              <div className="mt-1 text-2xl font-semibold">0</div>
              <div className="mt-1 text-xs text-muted-foreground">Transcript memory arrives in Segment 8</div>
            </div>
            <MessageSquareText className="mt-1 h-5 w-5 text-primary" />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader><CardTitle>Call Brief Sections</CardTitle></CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {briefSections.map((section) => (
            <div key={section} className="flex items-center justify-between rounded-md border p-3 text-sm">
              <span>{section}</span>
              <Badge value="PENDING" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
          <PhoneCall className="h-4 w-4 text-primary" />
          Existing conversation records remain available while the dedicated calls workflow is built.
        </CardContent>
      </Card>
    </div>
  );
}
