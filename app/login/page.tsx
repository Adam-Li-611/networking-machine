import { LockKeyhole } from "lucide-react";
import { loginAction } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : "/";
  const hasError = params.error === "1";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-md border bg-muted">
            <LockKeyhole className="h-4 w-4" />
          </div>
          <CardTitle>Networking Machine</CardTitle>
          <p className="text-sm text-muted-foreground">Enter the app password to open your private CRM.</p>
        </CardHeader>
        <CardContent>
          <form action={loginAction} className="grid gap-3">
            <input type="hidden" name="next" value={next} />
            <Field label="Password">
              <Input name="password" type="password" autoComplete="current-password" required autoFocus />
            </Field>
            {hasError ? <p className="text-sm text-red-600">That password did not match.</p> : null}
            <Button type="submit">Unlock</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
