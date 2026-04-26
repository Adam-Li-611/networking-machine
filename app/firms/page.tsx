import Link from "next/link";
import { Plus } from "lucide-react";
import { getFirms } from "@/lib/data";
import { label } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form";
import { Table, Td, Th } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { coverageOptions, firmTypeOptions, priorityOptions, relevanceOptions } from "@/components/forms/options";

export default async function FirmsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const firms = await getFirms(params);
  return (
    <div>
      <PageHeader
        title="Firms"
        description="Coverage map across banks, credit funds, recruiters, and UChicago relationships."
        actions={<ButtonLink href="/firms/new" size="sm"><Plus className="h-4 w-4" /> Add firm</ButtonLink>}
      />
      <form className="mb-3 grid gap-2 rounded-lg border bg-card p-3 md:grid-cols-6">
        <Input name="search" placeholder="Search firms..." defaultValue={typeof params.search === "string" ? params.search : ""} />
        <Select name="firmType"><option value="">Firm type</option>{firmTypeOptions.map((o) => <option key={o} value={o}>{label(o)}</option>)}</Select>
        <Select name="priority"><option value="">Priority</option>{priorityOptions.map((o) => <option key={o} value={o}>{label(o)}</option>)}</Select>
        <Select name="coverageStrength"><option value="">Coverage</option>{coverageOptions.map((o) => <option key={o} value={o}>{label(o)}</option>)}</Select>
        <Select name="recruitingRelevance"><option value="">Relevance</option>{relevanceOptions.map((o) => <option key={o} value={o}>{label(o)}</option>)}</Select>
        <Button type="submit" variant="secondary">Filter</Button>
      </form>
      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <thead><tr><Th>Firm</Th><Th>Type</Th><Th>Strategy</Th><Th>Priority</Th><Th>Contacts</Th><Th>Calls</Th><Th>Active campaigns</Th><Th>Overdue follow-ups</Th><Th>Coverage</Th></tr></thead>
          <tbody>
            {firms.map((firm) => (
              <tr key={firm.id} className="hover:bg-muted/60">
                <Td><Link href={`/firms/${firm.id}`} className="font-medium hover:underline">{firm.name}</Link></Td>
                <Td>{label(firm.firmType)}</Td>
                <Td>{firm.strategy ?? "—"}</Td>
                <Td><Badge value={firm.priority} /></Td>
                <Td>{firm.contacts.length}</Td>
                <Td>{firm.conversations.length}</Td>
                <Td>{firm.outreachCampaigns.length}</Td>
                <Td>{firm.tasks.length}</Td>
                <Td><Badge value={firm.coverageStrength} /></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
