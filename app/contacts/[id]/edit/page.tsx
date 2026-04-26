import { notFound } from "next/navigation";
import { getContactById, getReferenceData } from "@/lib/data";
import { ContactForm } from "@/components/forms/contact-form";
import { PageHeader } from "@/components/page-header";

export default async function EditContactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [contact, refs] = await Promise.all([getContactById(id), getReferenceData()]);
  if (!contact) notFound();
  return (
    <div>
      <PageHeader title={`Edit ${contact.fullName}`} />
      <ContactForm contact={contact} firms={refs.firms} tags={refs.tags} />
    </div>
  );
}
