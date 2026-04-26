import { Prisma, TaskStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { daysAgo, daysFromNow } from "@/lib/utils";

const contactInclude = {
  currentFirm: true,
  tags: { include: { tag: true } },
  outreachCampaigns: { orderBy: { updatedAt: "desc" as const }, take: 1 },
  tasks: { where: { status: { in: ["OPEN", "SNOOZED"] as TaskStatus[] } } }
};

export async function getDashboardData() {
  const now = new Date();
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  const sevenDays = daysFromNow(7);
  const twoDaysAgo = daysAgo(2);
  const sixtyDaysAgo = daysAgo(60);
  const thirtyDaysAgo = daysAgo(30);

  const [
    overdueTasks,
    todayTasks,
    upcomingTasks,
    activeCampaigns,
    recentConversations,
    recentContacts,
    coldHighPriority,
    warmNoTouch,
    firmCoverageGaps,
    recentCalls
  ] = await Promise.all([
    prisma.task.findMany({
      where: { status: "OPEN", dueDate: { lt: now } },
      include: { contact: true, firm: true, campaign: true },
      orderBy: { dueDate: "asc" },
      take: 8
    }),
    prisma.task.findMany({
      where: { status: "OPEN", dueDate: { gte: now, lte: todayEnd } },
      include: { contact: true, firm: true },
      orderBy: { dueDate: "asc" },
      take: 8
    }),
    prisma.task.findMany({
      where: { status: "OPEN", dueDate: { gt: todayEnd, lte: sevenDays } },
      include: { contact: true, firm: true },
      orderBy: { dueDate: "asc" },
      take: 8
    }),
    prisma.outreachCampaign.findMany({
      where: { status: { notIn: ["CLOSED_NO_RESPONSE", "DO_NOT_CONTACT", "PAUSED", "CONVERTED_TO_RELATIONSHIP"] } },
      include: { contact: true, firm: true, touches: true },
      orderBy: [{ nextPlannedTouchAt: "asc" }, { updatedAt: "desc" }],
      take: 8
    }),
    prisma.conversation.findMany({
      include: { primaryContact: true, firm: true },
      orderBy: { happenedAt: "desc" },
      take: 8
    }),
    prisma.contact.findMany({
      include: { currentFirm: true },
      orderBy: { createdAt: "desc" },
      take: 8
    }),
    prisma.contact.findMany({
      where: {
        priority: "HIGH",
        OR: [{ lastTouchAt: null }, { lastTouchAt: { lt: thirtyDaysAgo } }],
        status: "ACTIVE"
      },
      include: { currentFirm: true },
      orderBy: { lastTouchAt: "asc" },
      take: 8
    }),
    prisma.contact.findMany({
      where: {
        warmth: { in: ["WARM", "STRONG"] },
        OR: [{ lastTouchAt: null }, { lastTouchAt: { lt: sixtyDaysAgo } }],
        status: "ACTIVE"
      },
      include: { currentFirm: true },
      orderBy: { lastTouchAt: "asc" },
      take: 8
    }),
    prisma.firm.findMany({
      where: { coverageStrength: { in: ["NONE", "WEAK"] }, priority: { in: ["HIGH", "MEDIUM"] } },
      include: { contacts: true, outreachCampaigns: true, tasks: true },
      orderBy: [{ priority: "desc" }, { name: "asc" }],
      take: 8
    }),
    prisma.conversation.findMany({
      where: { happenedAt: { gte: twoDaysAgo } },
      include: {
        primaryContact: true,
        firm: true,
        tasks: { where: { taskType: "SEND_THANK_YOU", status: "DONE" } }
      },
      orderBy: { happenedAt: "desc" }
    })
  ]);

  return {
    overdueTasks,
    todayTasks,
    upcomingTasks,
    activeCampaigns,
    recentConversations,
    recentContacts,
    coldHighPriority,
    warmNoTouch,
    firmCoverageGaps,
    callsMissingThanks: recentCalls.filter((conversation) => conversation.tasks.length === 0)
  };
}

export async function getContacts(params: Record<string, string | string[] | undefined> = {}) {
  const search = typeof params.search === "string" ? params.search : undefined;
  const where: Prisma.ContactWhereInput = {
    ...(search
      ? {
          OR: [
            { fullName: { contains: search, mode: "insensitive" } },
            { primaryEmail: { contains: search, mode: "insensitive" } },
            { currentTitle: { contains: search, mode: "insensitive" } },
            { currentFirm: { name: { contains: search, mode: "insensitive" } } }
          ]
        }
      : {}),
    ...(typeof params.priority === "string" ? { priority: params.priority as never } : {}),
    ...(typeof params.warmth === "string" ? { warmth: params.warmth as never } : {}),
    ...(typeof params.stage === "string" ? { relationshipStage: params.stage as never } : {}),
    ...(typeof params.firm === "string" ? { currentFirmId: params.firm } : {}),
    ...(typeof params.group === "string" ? { currentGroup: { contains: params.group, mode: "insensitive" } } : {}),
    ...(typeof params.firmType === "string" ? { currentFirm: { firmType: params.firmType as never } } : {}),
    ...(typeof params.tag === "string" ? { tags: { some: { tagId: params.tag } } } : {}),
    ...(params.overdue === "true" ? { nextTouchAt: { lt: new Date() } } : {}),
    ...(params.noRecent === "true" ? { OR: [{ lastTouchAt: null }, { lastTouchAt: { lt: daysAgo(60) } }] } : {})
  };

  return prisma.contact.findMany({
    where,
    include: contactInclude,
    orderBy: [{ nextTouchAt: "asc" }, { fullName: "asc" }]
  });
}

export async function getContactById(id: string) {
  return prisma.contact.findUnique({
    where: { id },
    include: {
      currentFirm: true,
      positions: { include: { firm: true }, orderBy: [{ isCurrent: "desc" }, { startDate: "desc" }] },
      conversationParticipants: {
        include: { conversation: { include: { firm: true, tasks: true } } },
        orderBy: { conversation: { happenedAt: "desc" } }
      },
      outreachCampaigns: { include: { firm: true, touches: true, tasks: true }, orderBy: { updatedAt: "desc" } },
      outreachTouches: { include: { campaign: true }, orderBy: { occurredAt: "desc" } },
      tasks: { include: { firm: true, campaign: true, conversation: true }, orderBy: [{ status: "asc" }, { dueDate: "asc" }] },
      tags: { include: { tag: true } }
    }
  });
}

export async function getFirms(params: Record<string, string | string[] | undefined> = {}) {
  const search = typeof params.search === "string" ? params.search : undefined;
  const where: Prisma.FirmWhereInput = {
    ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
    ...(typeof params.firmType === "string" ? { firmType: params.firmType as never } : {}),
    ...(typeof params.priority === "string" ? { priority: params.priority as never } : {}),
    ...(typeof params.coverageStrength === "string" ? { coverageStrength: params.coverageStrength as never } : {}),
    ...(typeof params.recruitingRelevance === "string" ? { recruitingRelevance: params.recruitingRelevance as never } : {})
  };
  return prisma.firm.findMany({
    where,
    include: {
      contacts: true,
      conversations: true,
      outreachCampaigns: true,
      tasks: { where: { status: "OPEN", dueDate: { lt: new Date() } } }
    },
    orderBy: [{ priority: "desc" }, { name: "asc" }]
  });
}

export async function getFirmById(id: string) {
  return prisma.firm.findUnique({
    where: { id },
    include: {
      contacts: { include: { tags: { include: { tag: true } }, outreachCampaigns: true } },
      positions: { include: { contact: true } },
      conversations: { include: { primaryContact: true }, orderBy: { happenedAt: "desc" } },
      outreachCampaigns: { include: { contact: true, touches: true }, orderBy: { updatedAt: "desc" } },
      tasks: { include: { contact: true, campaign: true, conversation: true }, orderBy: [{ status: "asc" }, { dueDate: "asc" }] }
    }
  });
}

export async function getConversations(params: Record<string, string | string[] | undefined> = {}) {
  const search = typeof params.search === "string" ? params.search : undefined;
  return prisma.conversation.findMany({
    where: {
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { summary: { contains: search, mode: "insensitive" } },
              { primaryContact: { fullName: { contains: search, mode: "insensitive" } } },
              { firm: { name: { contains: search, mode: "insensitive" } } }
            ]
          }
        : {}),
      ...(typeof params.contact === "string" ? { primaryContactId: params.contact } : {}),
      ...(typeof params.firm === "string" ? { firmId: params.firm } : {}),
      ...(typeof params.type === "string" ? { conversationType: params.type as never } : {}),
      ...(params.aiProcessed === "true" ? { aiProcessed: true } : {}),
      ...(params.aiProcessed === "false" ? { aiProcessed: false } : {})
    },
    include: { primaryContact: true, firm: true, tasks: true },
    orderBy: { happenedAt: "desc" }
  });
}

export async function getConversationById(id: string) {
  return prisma.conversation.findUnique({
    where: { id },
    include: {
      primaryContact: true,
      firm: true,
      participants: { include: { contact: true } },
      tasks: { include: { contact: true, firm: true, campaign: true }, orderBy: { dueDate: "asc" } }
    }
  });
}

export async function getCampaigns(params: Record<string, string | string[] | undefined> = {}) {
  const search = typeof params.search === "string" ? params.search : undefined;
  return prisma.outreachCampaign.findMany({
    where: {
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { contact: { fullName: { contains: search, mode: "insensitive" } } },
              { firm: { name: { contains: search, mode: "insensitive" } } }
            ]
          }
        : {}),
      ...(typeof params.firm === "string" ? { firmId: params.firm } : {}),
      ...(typeof params.campaignType === "string" ? { campaignType: params.campaignType as never } : {}),
      ...(typeof params.status === "string" ? { status: params.status as never } : {}),
      ...(typeof params.priority === "string" ? { priority: params.priority as never } : {}),
      ...(params.overdue === "true" ? { nextPlannedTouchAt: { lt: new Date() } } : {})
    },
    include: { contact: true, firm: true, touches: true, tasks: true },
    orderBy: [{ nextPlannedTouchAt: "asc" }, { updatedAt: "desc" }]
  });
}

export async function getCampaignById(id: string) {
  return prisma.outreachCampaign.findUnique({
    where: { id },
    include: {
      contact: true,
      firm: true,
      touches: { orderBy: { occurredAt: "desc" } },
      tasks: { include: { contact: true, firm: true, conversation: true }, orderBy: { dueDate: "asc" } }
    }
  });
}

export async function getTasks(params: Record<string, string | string[] | undefined> = {}) {
  const view = typeof params.view === "string" ? params.view : "today";
  const now = new Date();
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  const week = daysFromNow(7);
  const where: Prisma.TaskWhereInput =
    view === "overdue"
      ? { status: "OPEN", dueDate: { lt: now } }
      : view === "week"
        ? { status: "OPEN", dueDate: { lte: week } }
        : view === "high"
          ? { status: "OPEN", priority: "HIGH" }
          : view === "completed"
            ? { status: "DONE" }
            : { status: "OPEN", dueDate: { lte: todayEnd } };

  return prisma.task.findMany({
    where,
    include: { contact: true, firm: true, campaign: true, conversation: true },
    orderBy: [{ dueDate: "asc" }, { priority: "desc" }]
  });
}

export async function getReferenceData() {
  const [contacts, firms, tags, campaigns, conversations] = await Promise.all([
    prisma.contact.findMany({ orderBy: { fullName: "asc" } }),
    prisma.firm.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.outreachCampaign.findMany({ include: { contact: true }, orderBy: { updatedAt: "desc" } }),
    prisma.conversation.findMany({ orderBy: { happenedAt: "desc" } })
  ]);
  return { contacts, firms, tags, campaigns, conversations };
}

export async function calculateFirmCoverage(firmId: string) {
  const [contacts, conversations, activeCampaigns] = await Promise.all([
    prisma.contact.count({ where: { currentFirmId: firmId } }),
    prisma.conversation.count({ where: { firmId } }),
    prisma.outreachCampaign.count({
      where: { firmId, status: { notIn: ["CLOSED_NO_RESPONSE", "DO_NOT_CONTACT", "PAUSED"] } }
    })
  ]);

  if (contacts >= 4 && conversations >= 3) return "STRONG";
  if (contacts >= 2 || conversations >= 2 || activeCampaigns >= 2) return "MEDIUM";
  if (contacts >= 1 || activeCampaigns >= 1) return "WEAK";
  return "NONE";
}
