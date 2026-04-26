import { getReferenceData } from "@/lib/data";
import { ConversationForm } from "@/components/forms/conversation-form";
import { PageHeader } from "@/components/page-header";

export default async function NewConversationPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const refs = await getReferenceData();
  return (
    <div>
      <PageHeader title="Add Conversation" description="Capture a call or meeting, then process a pasted transcript into structured notes." />
      <ConversationForm contacts={refs.contacts} firms={refs.firms} defaultContactId={typeof params.contactId === "string" ? params.contactId : undefined} />
    </div>
  );
}
