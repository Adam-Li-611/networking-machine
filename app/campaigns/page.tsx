import Link from "next/link";
import { Plus } from "lucide-react";
import { getCampaigns, getReferenceData } from "@/lib/data";
import { formatDate, label } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form";
import { Table, Td, Th } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { campaignStatusOptions, campaignTypeOptions, priorityOptions } from "@/components/forms/options";

export default async function CampaignsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const [campaigns, refs] = await Promise.all([getCampaigns(params), getReferenceData()]);
  return (
    <div>
      <PageHeader title="Outreach Campaigns" description="Relationship-specific outreach sequences and long-term maintenance loops." actions={<ButtonLink href="/campaigns/new" size="sm"><Plus className="h-4 w-4" /> Create campaign</ButtonLink>} />
      <form className="mb-3 grid gap-2 rounded-lg border bg-card p-3 md:grid-cols-6">
        <Input name="search" placeholder="Search campaigns..." defaultValue={typeof params.search === "string" ? params.search : ""} />
        <Select name="firm"><option value="">Firm</option>{refs.firms.map((firm) => <option key={firm.id} value={firm.id}>{firm.name}</option>)}</Select>
        <Select name="campaignType"><option value="">Type</option>{campaignTypeOptions.map((o) => <option key={o} value={o}>{label(o)}</option>)}</Select>
        <Select name="status"><option value="">Status</option>{campaignStatusOptions.map((o) => <option key={o} value={o}>{label(o)}</option>)}</Select>
        <Select name="priority"><option value="">Priority</option>{priorityOptions.map((o) => <option key={o} value={o}>{label(o)}</option>)}</Select>
        <Button variant="secondary">Filter</Button>
      </form>
      <div className="overflow-hidden rounded-lg border bg-card">
        <Table><thead><tr><Th>Contact</Th><Th>Firm</Th><Th>Campaign type</Th><Th>Status</Th><Th>Priority</Th><Th>Last touch</Th><Th>Next touch</Th><Th>Touches</Th><Th>Outcome</Th></tr></thead><tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign.id} className="hover:bg-muted/60">
              <Td><Link href={`/campaigns/${campaign.id}`} className="font-medium hover:underline">{campaign.contact.fullName}</Link><div className="text-xs text-muted-foreground">{campaign.name}</div></Td>
              <Td>{campaign.firm?.name ?? "—"}</Td>
              <Td>{label(campaign.campaignType)}</Td>
              <Td><Badge value={campaign.status} /></Td>
              <Td><Badge value={campaign.priority} /></Td>
              <Td>{formatDate(campaign.lastTouchAt)}</Td>
              <Td>{formatDate(campaign.nextPlannedTouchAt)}</Td>
              <Td>{campaign.touches.length}</Td>
              <Td>{campaign.outcome ?? "—"}</Td>
            </tr>
          ))}
        </tbody></Table>
      </div>
    </div>
  );
}
