import { CheckCircle2, FileText, MailPlus, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

const queues = [
  { label: "Awaiting approval", value: "0", detail: "Review queue opens in Segment 2" },
  { label: "Approved", value: "0", detail: "Approval gate is not active yet" },
  { label: "Gmail drafts", value: "0", detail: "Draft creation is locked until Gmail OAuth" }
];

export default function DraftReviewPage() {
  return (
    <div>
      <PageHeader
        title="Draft Review"
        description="Approval surface for generated outreach sequences."
        actions={<ButtonLink href="/campaigns" variant="outline" size="sm">Open campaigns</ButtonLink>}
      />
      <div className="grid gap-3 md:grid-cols-3">
        {queues.map((queue) => (
          <Card key={queue.label}>
            <CardContent className="flex items-start justify-between gap-3 p-4">
              <div>
                <div className="text-xs text-muted-foreground">{queue.label}</div>
                <div className="mt-1 text-2xl font-semibold">{queue.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{queue.detail}</div>
              </div>
              <FileText className="mt-1 h-5 w-5 text-primary" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Review Gate</CardTitle></CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> User approval required before Gmail drafts.</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> All four emails reviewed upfront.</div>
            <div className="flex items-center gap-2"><MailPlus className="h-4 w-4 text-primary" /> Gmail draft creation starts in Segment 2.</div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Foundation Status</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge value="LOCKED" />
            <Badge value="NEEDS APPROVAL" />
            <Badge value="NO AUTO SEND" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
