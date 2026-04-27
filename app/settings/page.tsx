import { CheckCircle2, CircleAlert, CircleDashed, Database, KeyRound, Mail, Server, ShieldCheck } from "lucide-react";
import packageJson from "@/package.json";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-dynamic";

type HealthState = "ONLINE" | "READY" | "MISSING" | "LOCKED" | "PENDING" | "ERROR";

async function getDatabaseHealth() {
  const startedAt = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      state: "ONLINE" as HealthState,
      detail: `Connected in ${Date.now() - startedAt}ms`
    };
  } catch (error) {
    return {
      state: "ERROR" as HealthState,
      detail: error instanceof Error ? error.message : "Database check failed"
    };
  }
}

function envState(name: string, required = true) {
  const configured = Boolean(process.env[name]);
  return {
    name,
    state: configured ? ("READY" as HealthState) : required ? ("MISSING" as HealthState) : ("PENDING" as HealthState),
    detail: configured ? "Configured" : required ? "Missing" : "Optional"
  };
}

function HealthIcon({ state }: { state: HealthState }) {
  if (state === "ONLINE" || state === "READY") return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
  if (state === "ERROR" || state === "MISSING") return <CircleAlert className="h-4 w-4 text-red-600" />;
  return <CircleDashed className="h-4 w-4 text-muted-foreground" />;
}

export default async function SettingsPage() {
  const database = await getDatabaseHealth();
  const environment = process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "local";
  const envChecks = [
    envState("DATABASE_URL"),
    envState("DIRECT_URL"),
    envState("APP_PASSWORD"),
    envState("OPENAI_API_KEY", false)
  ];
  const appPasswordReady = Boolean(process.env.APP_PASSWORD);
  const openAiReady = Boolean(process.env.OPENAI_API_KEY);

  const healthCards = [
    {
      title: "App",
      icon: Server,
      state: "READY" as HealthState,
      detail: `v${packageJson.version} on ${environment}`
    },
    {
      title: "Database",
      icon: Database,
      state: database.state,
      detail: database.detail
    },
    {
      title: "Password Gate",
      icon: ShieldCheck,
      state: appPasswordReady ? ("READY" as HealthState) : ("MISSING" as HealthState),
      detail: appPasswordReady ? "Signed auth cookie enabled" : "APP_PASSWORD is not set"
    },
    {
      title: "OpenAI",
      icon: KeyRound,
      state: openAiReady ? ("READY" as HealthState) : ("PENDING" as HealthState),
      detail: openAiReady ? "Server-side key configured" : "Mock transcript mode available"
    },
    {
      title: "Gmail",
      icon: Mail,
      state: "LOCKED" as HealthState,
      detail: "Segment 2 placeholder only"
    }
  ];

  return (
    <div>
      <PageHeader
        title="Settings"
        description="System health, deployment readiness, and integration status for the private command center."
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {healthCards.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title}>
              <CardContent className="grid gap-3 p-4">
                <div className="flex items-center justify-between gap-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <Badge value={item.state} />
                </div>
                <div>
                  <div className="text-sm font-medium">{item.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{item.detail}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Environment</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {envChecks.map((check) => (
              <div key={check.name} className="flex items-center justify-between gap-3 rounded-md border p-3 text-sm">
                <div className="flex min-w-0 items-center gap-2">
                  <HealthIcon state={check.state} />
                  <span className="font-medium">{check.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{check.detail}</span>
                  <Badge value={check.state} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Segment 1 Gate</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div className="flex items-center justify-between rounded-md border p-3">
              <span>Primary nav routes</span>
              <Badge value="READY" />
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <span>Gmail OAuth</span>
              <Badge value="LOCKED" />
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <span>Auto-send</span>
              <Badge value="LOCKED" />
            </div>
            <p className="pt-2 text-xs text-muted-foreground">
              Segment 1 stops at deployability, database readiness, password protection, route coverage, and health visibility.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
