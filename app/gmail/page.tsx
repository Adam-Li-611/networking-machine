import { LockKeyhole, Mail, RadioTower, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

const futureChecks = [
  "OAuth connect",
  "Encrypted refresh token",
  "Gmail draft IDs",
  "Revoked token state",
  "API error audit log"
];

export default function GmailPage() {
  return (
    <div>
      <PageHeader
        title="Gmail"
        description="Connection status and Gmail safety controls."
      />

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader><CardTitle>Connection</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Mail className="h-4 w-4 text-primary" />
                Gmail account
              </div>
              <Badge value="NOT CONNECTED" />
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <LockKeyhole className="h-4 w-4 text-primary" />
                OAuth scopes
              </div>
              <Badge value="LOCKED" />
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <RadioTower className="h-4 w-4 text-primary" />
                Scanner
              </div>
              <Badge value="LOCKED" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Segment 2 Readiness</CardTitle></CardHeader>
          <CardContent className="grid gap-2">
            {futureChecks.map((check) => (
              <div key={check} className="flex items-center justify-between rounded-md border p-3 text-sm">
                <span>{check}</span>
                <Badge value="PENDING" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader><CardTitle>Safety Boundary</CardTitle></CardHeader>
        <CardContent className="grid gap-2 text-sm md:grid-cols-3">
          <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> No auto-replies.</div>
          <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> No unapproved sends.</div>
          <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Draft creation comes first.</div>
        </CardContent>
      </Card>
    </div>
  );
}
