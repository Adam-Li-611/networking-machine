import { Braces, FileText, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

const templates = [
  "Initial email",
  "Follow-up 1",
  "Follow-up 2",
  "Follow-up 3"
];

export default function TemplatesPage() {
  return (
    <div>
      <PageHeader
        title="Templates"
        description="Reusable sequence structure for AI-assisted outreach."
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {templates.map((template) => (
          <Card key={template}>
            <CardContent className="grid gap-3 p-4">
              <div className="flex items-center justify-between">
                <FileText className="h-5 w-5 text-primary" />
                <Badge value="PENDING" />
              </div>
              <div>
                <div className="text-sm font-medium">{template}</div>
                <div className="mt-1 text-xs text-muted-foreground">Editable in Segment 3</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Variable Syntax</CardTitle></CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div className="flex items-center gap-2"><Braces className="h-4 w-4 text-primary" /> {"{firstName}"} inserts a direct value.</div>
            <div className="flex items-center gap-2"><Braces className="h-4 w-4 text-primary" /> {"{firm}"} inserts a direct value.</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>AI Instructions</CardTitle></CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> [mention strongest overlap]</div>
            <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> [make the ask specific]</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
