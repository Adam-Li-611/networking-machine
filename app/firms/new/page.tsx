import { FirmForm } from "@/components/forms/firm-form";
import { PageHeader } from "@/components/page-header";

export default function NewFirmPage() {
  return (
    <div>
      <PageHeader title="Add Firm" description="Add a bank, fund, recruiter, university, or other relationship node." />
      <FirmForm />
    </div>
  );
}
