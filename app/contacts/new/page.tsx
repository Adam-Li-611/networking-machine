import { getReferenceData } from "@/lib/data";
import { ContactForm } from "@/components/forms/contact-form";
import { PageHeader } from "@/components/page-header";

export default async function NewContactPage() {
  const { firms, tags } = await getReferenceData();
  return (
    <div>
      <PageHeader title="Add Contact" description="Create a relationship record with firm, role, warmth, stage, and tags." />
      <ContactForm firms={firms} tags={tags} />
    </div>
  );
}
