"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  CampaignStatus,
  CampaignType,
  Channel,
  ConversationType,
  Direction,
  Medium,
  Priority,
  TaskStatus,
  TaskType,
  TouchStatus,
  TouchType,
  Warmth
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { contactSchema, firmSchema } from "@/lib/validators";
import { processTranscript } from "@/lib/ai/transcript";
import { readDate, readInt, readString } from "@/lib/utils";
import { reconnectDateForWarmth, relationshipStageForTouch, suggestedTaskForTouch } from "@/lib/followup";
import { calculateFirmCoverage } from "@/lib/data";

function enumValue<T extends Record<string, string>>(source: T, value: string | undefined, fallback: T[keyof T]) {
  return value && Object.prototype.hasOwnProperty.call(source, value) ? (value as T[keyof T]) : fallback;
}

export async function createContactAction(formData: FormData) {
  const parsed = contactSchema.parse({
    firstName: readString(formData, "firstName"),
    lastName: readString(formData, "lastName"),
    primaryEmail: readString(formData, "primaryEmail"),
    secondaryEmail: readString(formData, "secondaryEmail"),
    phone: readString(formData, "phone"),
    linkedinUrl: readString(formData, "linkedinUrl"),
    currentFirmId: readString(formData, "currentFirmId"),
    currentTitle: readString(formData, "currentTitle"),
    currentGroup: readString(formData, "currentGroup"),
    location: readString(formData, "location"),
    timezone: readString(formData, "timezone"),
    schoolOrAffiliation: readString(formData, "schoolOrAffiliation"),
    source: readString(formData, "source"),
    priority: readString(formData, "priority") ?? "MEDIUM",
    warmth: readString(formData, "warmth") ?? "COLD",
    recruitingRelevance: readString(formData, "recruitingRelevance") ?? "MEDIUM",
    relationshipStage: readString(formData, "relationshipStage") ?? "TARGET_IDENTIFIED",
    personalHooks: readString(formData, "personalHooks"),
    generalNotes: readString(formData, "generalNotes"),
    tagIds: formData.getAll("tagIds").filter((value): value is string => typeof value === "string")
  });

  const { tagIds, ...contactData } = parsed;
  const contact = await prisma.contact.create({
    data: {
      ...contactData,
      fullName: `${parsed.firstName} ${parsed.lastName}`,
      tags: { create: tagIds.map((tagId) => ({ tagId })) }
    }
  });

  if (parsed.currentFirmId && parsed.currentTitle) {
    await prisma.position.create({
      data: {
        contactId: contact.id,
        firmId: parsed.currentFirmId,
        title: parsed.currentTitle,
        groupName: parsed.currentGroup,
        location: parsed.location,
        isCurrent: true
      }
    });
  }

  revalidatePath("/contacts");
  redirect(`/contacts/${contact.id}`);
}

export async function updateContactAction(id: string, formData: FormData) {
  const parsed = contactSchema.parse({
    firstName: readString(formData, "firstName"),
    lastName: readString(formData, "lastName"),
    primaryEmail: readString(formData, "primaryEmail"),
    secondaryEmail: readString(formData, "secondaryEmail"),
    phone: readString(formData, "phone"),
    linkedinUrl: readString(formData, "linkedinUrl"),
    currentFirmId: readString(formData, "currentFirmId"),
    currentTitle: readString(formData, "currentTitle"),
    currentGroup: readString(formData, "currentGroup"),
    location: readString(formData, "location"),
    timezone: readString(formData, "timezone"),
    schoolOrAffiliation: readString(formData, "schoolOrAffiliation"),
    source: readString(formData, "source"),
    priority: readString(formData, "priority") ?? "MEDIUM",
    warmth: readString(formData, "warmth") ?? "COLD",
    recruitingRelevance: readString(formData, "recruitingRelevance") ?? "MEDIUM",
    relationshipStage: readString(formData, "relationshipStage") ?? "TARGET_IDENTIFIED",
    personalHooks: readString(formData, "personalHooks"),
    generalNotes: readString(formData, "generalNotes"),
    tagIds: formData.getAll("tagIds").filter((value): value is string => typeof value === "string")
  });

  const { tagIds, ...contactData } = parsed;
  await prisma.contact.update({
    where: { id },
    data: {
      ...contactData,
      fullName: `${parsed.firstName} ${parsed.lastName}`,
      tags: {
        deleteMany: {},
        create: tagIds.map((tagId) => ({ tagId }))
      }
    }
  });
  revalidatePath(`/contacts/${id}`);
  redirect(`/contacts/${id}`);
}

export async function markContactStatusAction(id: string, status: "DORMANT" | "DO_NOT_CONTACT") {
  await prisma.contact.update({
    where: { id },
    data: {
      status,
      relationshipStage: status === "DORMANT" ? "DORMANT" : "DO_NOT_CONTACT"
    }
  });
  revalidatePath(`/contacts/${id}`);
}

export async function createFirmAction(formData: FormData) {
  const parsed = firmSchema.parse({
    name: readString(formData, "name"),
    firmType: readString(formData, "firmType") ?? "OTHER",
    strategy: readString(formData, "strategy"),
    priority: readString(formData, "priority") ?? "MEDIUM",
    recruitingRelevance: readString(formData, "recruitingRelevance") ?? "MEDIUM",
    coverageStrength: readString(formData, "coverageStrength") ?? "NONE",
    targetStatus: readString(formData, "targetStatus") ?? "TARGET",
    website: readString(formData, "website"),
    notes: readString(formData, "notes")
  });
  const firm = await prisma.firm.create({ data: parsed });
  revalidatePath("/firms");
  redirect(`/firms/${firm.id}`);
}

export async function createPositionAction(contactId: string, formData: FormData) {
  const firmId = readString(formData, "firmId");
  const title = readString(formData, "title");
  if (!firmId || !title) throw new Error("Firm and title are required.");
  const isCurrent = formData.get("isCurrent") === "on";
  if (isCurrent) {
    await prisma.position.updateMany({ where: { contactId, isCurrent: true }, data: { isCurrent: false, endDate: new Date() } });
  }
  const position = await prisma.position.create({
    data: {
      contactId,
      firmId,
      title,
      groupName: readString(formData, "groupName"),
      location: readString(formData, "location"),
      startDate: readDate(formData, "startDate"),
      endDate: readDate(formData, "endDate"),
      isCurrent,
      notes: readString(formData, "notes")
    }
  });
  if (isCurrent) {
    await prisma.contact.update({
      where: { id: contactId },
      data: {
        currentFirmId: firmId,
        currentTitle: position.title,
        currentGroup: position.groupName,
        location: position.location
      }
    });
  }
  revalidatePath(`/contacts/${contactId}`);
}

export async function createConversationAction(formData: FormData) {
  const primaryContactId = readString(formData, "primaryContactId");
  const firmId = readString(formData, "firmId");
  const happenedAt = readDate(formData, "happenedAt") ?? new Date();
  const contact = primaryContactId ? await prisma.contact.findUnique({ where: { id: primaryContactId } }) : null;
  const warmthAfter = enumValue(Warmth, readString(formData, "relationshipWarmthAfter"), contact?.warmth ?? "LUKEWARM");

  const conversation = await prisma.conversation.create({
    data: {
      title: readString(formData, "title") ?? "Relationship conversation",
      conversationType: enumValue(ConversationType, readString(formData, "conversationType"), "COFFEE_CHAT"),
      medium: enumValue(Medium, readString(formData, "medium"), "PHONE"),
      happenedAt,
      durationMinutes: readInt(formData, "durationMinutes"),
      primaryContactId,
      firmId,
      summary: readString(formData, "summary"),
      keyTopics: readString(formData, "keyTopics"),
      adviceGiven: readString(formData, "adviceGiven"),
      personalHooks: readString(formData, "personalHooks"),
      firmInsights: readString(formData, "firmInsights"),
      recruitingInsights: readString(formData, "recruitingInsights"),
      followUpAngle: readString(formData, "followUpAngle"),
      nextAction: readString(formData, "nextAction"),
      suggestedFollowUpDate: readDate(formData, "suggestedFollowUpDate"),
      relationshipWarmthAfter: warmthAfter,
      rawNotes: readString(formData, "rawNotes"),
      cleanNotes: readString(formData, "cleanNotes"),
      rawTranscript: readString(formData, "rawTranscript"),
      participants: primaryContactId ? { create: { contactId: primaryContactId, role: "PRIMARY" } } : undefined
    }
  });

  if (primaryContactId) {
    await updateContactTouchDates(primaryContactId, happenedAt);
    await prisma.task.create({
      data: {
        title: "Send thank-you note",
        contactId: primaryContactId,
        firmId,
        conversationId: conversation.id,
        taskType: "SEND_THANK_YOU",
        dueDate: happenedAt,
        priority: "HIGH"
      }
    });
    const reconnectAt = reconnectDateForWarmth(warmthAfter, happenedAt);
    if (reconnectAt) {
      await prisma.task.create({
        data: {
          title: "Reconnect with relationship update",
          contactId: primaryContactId,
          firmId,
          conversationId: conversation.id,
          taskType: "RECONNECT_LATER",
          dueDate: reconnectAt,
          priority: contact?.priority ?? "MEDIUM"
        }
      });
    }
  }

  revalidatePath("/conversations");
  redirect(`/conversations/${conversation.id}`);
}

export async function saveConversationNotesAction(id: string, formData: FormData) {
  const suggestedFollowUpDate = readDate(formData, "suggestedFollowUpDate");
  await prisma.conversation.update({
    where: { id },
    data: {
      summary: readString(formData, "summary"),
      keyTopics: readString(formData, "keyTopics"),
      adviceGiven: readString(formData, "adviceGiven"),
      personalHooks: readString(formData, "personalHooks"),
      firmInsights: readString(formData, "firmInsights"),
      recruitingInsights: readString(formData, "recruitingInsights"),
      followUpAngle: readString(formData, "followUpAngle"),
      nextAction: readString(formData, "nextAction"),
      suggestedFollowUpDate,
      relationshipWarmthAfter: enumValue(Warmth, readString(formData, "relationshipWarmthAfter"), "LUKEWARM"),
      cleanNotes: readString(formData, "cleanNotes"),
      aiProcessingStatus: formData.get("reviewed") === "on" ? "REVIEWED" : undefined
    }
  });
  revalidatePath(`/conversations/${id}`);
}

export async function createTaskFromConversationAction(id: string) {
  const conversation = await prisma.conversation.findUnique({ where: { id } });
  if (!conversation?.nextAction) throw new Error("Conversation needs a next action before creating a task.");
  await prisma.task.create({
    data: {
      title: conversation.nextAction,
      contactId: conversation.primaryContactId,
      firmId: conversation.firmId,
      conversationId: conversation.id,
      taskType: "OTHER",
      dueDate: conversation.suggestedFollowUpDate,
      priority: "MEDIUM",
      createdByAi: conversation.aiProcessed
    }
  });
  revalidatePath(`/conversations/${id}`);
}

export async function processConversationTranscriptAction(id: string, formData: FormData) {
  const transcript = readString(formData, "rawTranscript");
  if (!transcript) throw new Error("Paste a transcript before processing.");
  const conversation = await prisma.conversation.findUnique({ where: { id }, include: { primaryContact: true, firm: true } });
  const result = await processTranscript({
    transcript,
    conversationId: id,
    contactId: conversation?.primaryContactId,
    contactContext: conversation?.primaryContact
      ? `${conversation.primaryContact.fullName}, ${conversation.primaryContact.currentTitle ?? ""} at ${conversation.firm?.name ?? ""}`
      : undefined
  });
  await prisma.conversation.update({
    where: { id },
    data: {
      rawTranscript: transcript,
      summary: result.summary,
      keyTopics: result.keyTopics,
      adviceGiven: result.adviceGiven,
      personalHooks: result.personalHooks,
      firmInsights: result.firmInsights,
      recruitingInsights: result.recruitingInsights,
      followUpAngle: result.followUpAngle,
      nextAction: result.nextAction,
      suggestedFollowUpDate: result.suggestedFollowUpDate ? new Date(result.suggestedFollowUpDate) : undefined,
      relationshipWarmthAfter: result.relationshipWarmthAfter,
      cleanNotes: result.cleanNotes,
      aiProcessed: true,
      aiProcessingStatus: result.mockUsed ? "MOCK_PROCESSED" : "PROCESSED",
      aiOutputJson: result
    }
  });
  revalidatePath(`/conversations/${id}`);
}

export async function deleteRawTranscriptAction(id: string) {
  await prisma.conversation.update({ where: { id }, data: { rawTranscript: null } });
  revalidatePath(`/conversations/${id}`);
}

export async function createCampaignAction(formData: FormData) {
  const contactId = readString(formData, "contactId");
  if (!contactId) throw new Error("Contact is required.");
  const campaign = await prisma.outreachCampaign.create({
    data: {
      name: readString(formData, "name") ?? "Relationship campaign",
      contactId,
      firmId: readString(formData, "firmId"),
      campaignType: enumValue(CampaignType, readString(formData, "campaignType"), "COLD_NETWORKING"),
      goal: readString(formData, "goal"),
      status: enumValue(CampaignStatus, readString(formData, "status"), "NOT_STARTED"),
      priority: enumValue(Priority, readString(formData, "priority"), "MEDIUM"),
      startedAt: readDate(formData, "startedAt") ?? new Date(),
      nextPlannedTouchAt: readDate(formData, "nextPlannedTouchAt"),
      outcome: readString(formData, "outcome"),
      notes: readString(formData, "notes")
    }
  });
  revalidatePath("/campaigns");
  redirect(`/campaigns/${campaign.id}`);
}

export async function addOutreachTouchAction(campaignId: string, formData: FormData) {
  const campaign = await prisma.outreachCampaign.findUnique({ where: { id: campaignId } });
  if (!campaign) throw new Error("Campaign not found.");
  const occurredAt = readDate(formData, "occurredAt") ?? new Date();
  const touchType = enumValue(TouchType, readString(formData, "touchType"), "INITIAL_OUTREACH");
  const suggested = suggestedTaskForTouch(touchType, occurredAt);
  const responseReceived = formData.get("responseReceived") === "on";

  await prisma.outreachTouch.create({
    data: {
      campaignId,
      contactId: campaign.contactId,
      touchType,
      channel: enumValue(Channel, readString(formData, "channel"), "EMAIL"),
      direction: enumValue(Direction, readString(formData, "direction"), "OUTBOUND"),
      occurredAt,
      subject: readString(formData, "subject"),
      messageBody: readString(formData, "messageBody"),
      status: enumValue(TouchStatus, readString(formData, "status"), responseReceived ? "RECEIVED" : "SENT"),
      responseReceived,
      notes: readString(formData, "notes")
    }
  });

  await prisma.outreachCampaign.update({
    where: { id: campaignId },
    data: {
      lastTouchAt: occurredAt,
      nextPlannedTouchAt: suggested?.dueDate ?? campaign.nextPlannedTouchAt,
      status: responseReceived ? "REPLIED" : suggested?.nextStatus ?? campaign.status
    }
  });

  await prisma.contact.update({
    where: { id: campaign.contactId },
    data: {
      lastTouchAt: occurredAt,
      nextTouchAt: suggested?.dueDate,
      relationshipStage: responseReceived ? "REPLIED" : relationshipStageForTouch(touchType)
    }
  });

  if (suggested) {
    await prisma.task.create({
      data: {
        title: suggested.title,
        contactId: campaign.contactId,
        firmId: campaign.firmId,
        campaignId,
        taskType: suggested.taskType,
        dueDate: suggested.dueDate,
        priority: campaign.priority
      }
    });
  }

  revalidatePath(`/campaigns/${campaignId}`);
}

export async function updateCampaignStatusAction(id: string, status: CampaignStatus) {
  await prisma.outreachCampaign.update({ where: { id }, data: { status } });
  revalidatePath(`/campaigns/${id}`);
}

export async function createTaskAction(formData: FormData) {
  const task = await prisma.task.create({
    data: {
      title: readString(formData, "title") ?? "Follow up",
      contactId: readString(formData, "contactId"),
      firmId: readString(formData, "firmId"),
      campaignId: readString(formData, "campaignId"),
      conversationId: readString(formData, "conversationId"),
      taskType: enumValue(TaskType, readString(formData, "taskType"), "OTHER"),
      dueDate: readDate(formData, "dueDate"),
      priority: enumValue(Priority, readString(formData, "priority"), "MEDIUM"),
      status: enumValue(TaskStatus, readString(formData, "status"), "OPEN"),
      notes: readString(formData, "notes")
    }
  });
  revalidatePath("/tasks");
  redirect(`/tasks?created=${task.id}`);
}

export async function updateTaskStatusAction(id: string, status: TaskStatus) {
  await prisma.task.update({
    where: { id },
    data: { status, completedAt: status === "DONE" ? new Date() : null }
  });
  revalidatePath("/tasks");
}

export async function snoozeTaskAction(id: string) {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 3);
  await prisma.task.update({ where: { id }, data: { status: "SNOOZED", dueDate } });
  revalidatePath("/tasks");
}

export async function updateContactTouchDates(contactId: string, touchedAt: Date) {
  await prisma.contact.update({
    where: { id: contactId },
    data: {
      lastTouchAt: touchedAt,
      nextTouchAt: undefined,
      relationshipStage: "CALL_COMPLETED"
    }
  });
}

export async function refreshFirmCoverageAction(firmId: string) {
  const coverageStrength = await calculateFirmCoverage(firmId);
  await prisma.firm.update({ where: { id: firmId }, data: { coverageStrength } });
  revalidatePath(`/firms/${firmId}`);
}
