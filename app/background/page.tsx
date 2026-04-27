import { GraduationCap, Landmark, ListChecks, PenLine, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

const sections = [
  { title: "Profile", icon: UserRound, fields: ["School", "Major", "Clubs/groups", "Personal background"] },
  { title: "Experience", icon: GraduationCap, fields: ["Internships", "Finance interests", "Target roles", "Recruiting goals"] },
  { title: "Markets", icon: Landmark, fields: ["Target sectors", "Target products", "Firms of interest", "Coverage notes"] },
  { title: "Writing", icon: PenLine, fields: ["Preferred style", "Reusable asks", "Topics to avoid", "Tone constraints"] }
];

export default function BackgroundPage() {
  return (
    <div>
      <PageHeader
        title="Background"
        description="Reusable context for outreach generation and call prep."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{section.title}</CardTitle>
                <Icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent className="grid gap-2">
                {section.fields.map((field) => (
                  <div key={field} className="flex items-center justify-between rounded-md border p-3 text-sm">
                    <span>{field}</span>
                    <Badge value="PENDING" />
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-4">
        <CardHeader><CardTitle>Segment 3 Scope</CardTitle></CardHeader>
        <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
          <ListChecks className="h-4 w-4 text-primary" />
          Editable background profile arrives with template-driven AI sequence generation.
        </CardContent>
      </Card>
    </div>
  );
}
