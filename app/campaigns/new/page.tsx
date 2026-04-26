import { getReferenceData } from "@/lib/data";
import { CampaignForm } from "@/components/forms/campaign-form";
import { PageHeader } from "@/components/page-header";

export default async function NewCampaignPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const refs = await getReferenceData();
  return (
    <div>
      <PageHeader title="Create Campaign" description="Start a relationship campaign, outreach sequence, speaker invitation, or reconnect loop." />
      <CampaignForm contacts={refs.contacts} firms={refs.firms} defaultContactId={typeof params.contactId === "string" ? params.contactId : undefined} />
    </div>
  );
}
