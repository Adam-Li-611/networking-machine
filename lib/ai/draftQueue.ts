export type EmailDraftRequest = {
  contactId?: string;
  campaignId?: string;
  conversationId?: string;
  purpose: string;
};

export type EmailDraftStub = {
  id: string;
  subject: string;
  body: string;
  status: "COMING_LATER";
};

function notImplemented(): never {
  throw new Error("AI draft queue is not implemented yet. Draft generation will be added after the core CRM is stable.");
}

export async function generateEmailDraft(_request: EmailDraftRequest): Promise<EmailDraftStub> {
  return notImplemented();
}

export async function createDraftFromCampaign(_campaignId: string): Promise<EmailDraftStub> {
  return notImplemented();
}

export async function createDraftFromConversation(_conversationId: string): Promise<EmailDraftStub> {
  return notImplemented();
}

export async function scheduleApprovedDraft(_draftId: string, _sendAt: Date) {
  return notImplemented();
}
