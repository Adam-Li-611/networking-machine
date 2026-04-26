export type GmailMessageSummary = {
  id: string;
  from: string;
  to: string[];
  subject: string;
  snippet: string;
  sentAt: Date;
};

export type GmailThreadSummary = {
  id: string;
  subject: string;
  participants: string[];
  lastMessageAt: Date;
  messages: GmailMessageSummary[];
};

export type GmailDraftStub = {
  id: string;
  threadId?: string;
  to: string[];
  subject: string;
  body: string;
  status: "NOT_IMPLEMENTED";
};

function notImplemented(): never {
  throw new Error("Gmail integration is not implemented yet. OAuth, sync, drafts, and sending are intentionally stubbed.");
}

export async function connectGmail() {
  return notImplemented();
}

export async function syncGmailThreads(): Promise<GmailThreadSummary[]> {
  return notImplemented();
}

export async function matchThreadToContact(_thread: GmailThreadSummary) {
  return notImplemented();
}

export async function createGmailDraft(_draft: Omit<GmailDraftStub, "id" | "status">): Promise<GmailDraftStub> {
  return notImplemented();
}

export async function sendApprovedEmail(_draftId: string) {
  return notImplemented();
}
