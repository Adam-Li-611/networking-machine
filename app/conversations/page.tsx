import Link from "next/link";
import { Plus } from "lucide-react";
import { getConversations, getReferenceData } from "@/lib/data";
import { formatDate, label } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form";
import { Table, Td, Th } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { conversationTypeOptions } from "@/components/forms/options";

export default async function ConversationsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const [conversations, refs] = await Promise.all([getConversations(params), getReferenceData()]);
  return (
    <div>
      <PageHeader title="Conversations" description="Calls, coffee chats, event conversations, email-only interactions, and AI-processed notes." actions={<ButtonLink href="/conversations/new" size="sm"><Plus className="h-4 w-4" /> Add conversation</ButtonLink>} />
      <form className="mb-3 grid gap-2 rounded-lg border bg-card p-3 md:grid-cols-6">
        <Input name="search" placeholder="Search conversations..." defaultValue={typeof params.search === "string" ? params.search : ""} />
        <Select name="contact"><option value="">Contact</option>{refs.contacts.map((contact) => <option key={contact.id} value={contact.id}>{contact.fullName}</option>)}</Select>
        <Select name="firm"><option value="">Firm</option>{refs.firms.map((firm) => <option key={firm.id} value={firm.id}>{firm.name}</option>)}</Select>
        <Select name="type"><option value="">Type</option>{conversationTypeOptions.map((o) => <option key={o} value={o}>{label(o)}</option>)}</Select>
        <Select name="aiProcessed"><option value="">AI processed?</option><option value="true">Processed</option><option value="false">Not processed</option></Select>
        <Button variant="secondary">Filter</Button>
      </form>
      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <thead><tr><Th>Date</Th><Th>Contact</Th><Th>Firm</Th><Th>Type</Th><Th>Medium</Th><Th>Summary</Th><Th>Next action</Th><Th>Follow-up due</Th><Th>AI</Th></tr></thead>
          <tbody>
            {conversations.map((conversation) => (
              <tr key={conversation.id} className="hover:bg-muted/60">
                <Td><Link href={`/conversations/${conversation.id}`} className="font-medium hover:underline">{formatDate(conversation.happenedAt)}</Link></Td>
                <Td>{conversation.primaryContact ? <Link href={`/contacts/${conversation.primaryContact.id}`} className="hover:underline">{conversation.primaryContact.fullName}</Link> : "—"}</Td>
                <Td>{conversation.firm?.name ?? "—"}</Td>
                <Td>{label(conversation.conversationType)}</Td>
                <Td>{label(conversation.medium)}</Td>
                <Td className="max-w-md">{conversation.summary ?? conversation.title}</Td>
                <Td>{conversation.nextAction ?? "—"}</Td>
                <Td>{formatDate(conversation.suggestedFollowUpDate)}</Td>
                <Td><Badge value={conversation.aiProcessingStatus} /></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
