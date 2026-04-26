import { getReferenceData } from "@/lib/data";
import { TaskForm } from "@/components/forms/task-form";
import { PageHeader } from "@/components/page-header";

export default async function NewTaskPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const refs = await getReferenceData();
  return (
    <div>
      <PageHeader title="Create Task" description="Add a follow-up, prep item, reconnect reminder, or recruiting action." />
      <TaskForm
        contacts={refs.contacts}
        firms={refs.firms}
        campaigns={refs.campaigns}
        conversations={refs.conversations}
        defaultContactId={typeof params.contactId === "string" ? params.contactId : undefined}
      />
    </div>
  );
}
