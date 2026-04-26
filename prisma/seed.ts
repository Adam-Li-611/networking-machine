import {
  CampaignStatus,
  CampaignType,
  Channel,
  ContactStatus,
  ConversationType,
  CoverageStrength,
  Direction,
  FirmTargetStatus,
  FirmType,
  Medium,
  ParticipantRole,
  Priority,
  RecruitingRelevance,
  RelationshipStage,
  TaskStatus,
  TaskType,
  TouchStatus,
  TouchType,
  Warmth,
  PrismaClient
} from "@prisma/client";

const prisma = new PrismaClient();

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function daysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

async function main() {
  await prisma.contactTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.task.deleteMany();
  await prisma.outreachTouch.deleteMany();
  await prisma.outreachCampaign.deleteMany();
  await prisma.conversationParticipant.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.position.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.integrationStub.deleteMany();
  await prisma.firm.deleteMany();

  const firms = await Promise.all(
    [
      ["Evercore", FirmType.RX_ADVISORY, "Restructuring advisory and strategic advisory", Priority.HIGH, CoverageStrength.MEDIUM],
      ["PJT Partners", FirmType.RX_ADVISORY, "RSSG, strategic advisory, special situations", Priority.HIGH, CoverageStrength.WEAK],
      ["Diameter Capital Partners", FirmType.HEDGE_FUND, "Credit hedge fund focused on event-driven and distressed", Priority.HIGH, CoverageStrength.WEAK],
      ["Silver Point Capital", FirmType.HEDGE_FUND, "Distressed credit and special situations", Priority.HIGH, CoverageStrength.WEAK],
      ["Bain Capital", FirmType.SPECIAL_SITUATIONS, "Private equity, credit, and special situations", Priority.HIGH, CoverageStrength.MEDIUM],
      ["Apollo", FirmType.PRIVATE_CREDIT, "Private credit, opportunistic credit, alternatives", Priority.MEDIUM, CoverageStrength.NONE],
      ["Blackstone", FirmType.ASSET_MANAGER, "Credit, real estate, private equity, tactical opportunities", Priority.MEDIUM, CoverageStrength.NONE],
      ["UChicago", FirmType.UCHICAGO, "Alumni, faculty, and student finance network", Priority.HIGH, CoverageStrength.STRONG]
    ].map(([name, firmType, strategy, priority, coverageStrength]) =>
      prisma.firm.create({
        data: {
          name: name as string,
          firmType: firmType as FirmType,
          strategy: strategy as string,
          priority: priority as Priority,
          recruitingRelevance: RecruitingRelevance.HIGH,
          coverageStrength: coverageStrength as CoverageStrength,
          targetStatus: FirmTargetStatus.ACTIVE
        }
      })
    )
  );

  const byName = Object.fromEntries(firms.map((firm) => [firm.name, firm]));

  const tags = await Promise.all(
    [
      ["RX", "red"],
      ["Private Credit", "blue"],
      ["UChicago Alum", "maroon"],
      ["Speaker Prospect", "amber"],
      ["Recruiter", "green"],
      ["Special Situations", "violet"]
    ].map(([name, color]) => prisma.tag.create({ data: { name, color } }))
  );
  const tagByName = Object.fromEntries(tags.map((tag) => [tag.name, tag]));

  async function contact(data: {
    firstName: string;
    lastName: string;
    firm: string;
    title: string;
    group?: string;
    email: string;
    location?: string;
    priority: Priority;
    warmth: Warmth;
    stage: RelationshipStage;
    hooks?: string;
    tags: string[];
    lastTouchDaysAgo?: number;
  }) {
    const firm = byName[data.firm];
    const created = await prisma.contact.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`,
        primaryEmail: data.email,
        linkedinUrl: `https://linkedin.com/in/${data.firstName.toLowerCase()}-${data.lastName.toLowerCase()}`,
        currentFirmId: firm.id,
        currentTitle: data.title,
        currentGroup: data.group,
        location: data.location ?? "New York, NY",
        timezone: "America/New_York",
        schoolOrAffiliation: data.tags.includes("UChicago Alum") ? "UChicago alum" : undefined,
        source: data.tags.includes("Speaker Prospect") ? "UCG speaker list" : "Manual seed",
        priority: data.priority,
        warmth: data.warmth,
        recruitingRelevance: RecruitingRelevance.HIGH,
        relationshipStage: data.stage,
        status: ContactStatus.ACTIVE,
        personalHooks: data.hooks,
        generalNotes: "Seed contact for finance networking workflow testing.",
        lastTouchAt: data.lastTouchDaysAgo ? daysAgo(data.lastTouchDaysAgo) : undefined,
        tags: { create: data.tags.map((name) => ({ tagId: tagByName[name].id })) },
        positions: {
          create: {
            firmId: firm.id,
            title: data.title,
            groupName: data.group,
            location: data.location ?? "New York, NY",
            startDate: daysAgo(720),
            isCurrent: true
          }
        }
      }
    });
    return created;
  }

  const evercore = await contact({
    firstName: "Maya",
    lastName: "Shah",
    firm: "Evercore",
    title: "Associate",
    group: "Restructuring",
    email: "maya.shah@example.com",
    priority: Priority.HIGH,
    warmth: Warmth.WARM,
    stage: RelationshipStage.CALL_COMPLETED,
    hooks: "Enjoys distressed debt case studies and UChicago basketball.",
    tags: ["RX"],
    lastTouchDaysAgo: 3
  });

  const pjt = await contact({
    firstName: "Daniel",
    lastName: "Kim",
    firm: "PJT Partners",
    title: "Analyst",
    group: "RSSG",
    email: "daniel.kim@example.com",
    priority: Priority.HIGH,
    warmth: Warmth.LUKEWARM,
    stage: RelationshipStage.FOLLOW_UP_NEEDED,
    tags: ["RX"],
    lastTouchDaysAgo: 12
  });

  const diameter = await contact({
    firstName: "Olivia",
    lastName: "Chen",
    firm: "Diameter Capital Partners",
    title: "Investor",
    group: "Credit",
    email: "olivia.chen@example.com",
    priority: Priority.HIGH,
    warmth: Warmth.COLD,
    stage: RelationshipStage.INITIAL_OUTREACH_SENT,
    tags: ["Private Credit", "Special Situations"],
    lastTouchDaysAgo: 9
  });

  const silverPoint = await contact({
    firstName: "Marcus",
    lastName: "Lee",
    firm: "Silver Point Capital",
    title: "Analyst",
    group: "Distressed Credit",
    email: "marcus.lee@example.com",
    priority: Priority.HIGH,
    warmth: Warmth.LUKEWARM,
    stage: RelationshipStage.REPLIED,
    tags: ["Private Credit", "Special Situations"],
    lastTouchDaysAgo: 55
  });

  const bain = await contact({
    firstName: "Priya",
    lastName: "Natarajan",
    firm: "Bain Capital",
    title: "Vice President",
    group: "Special Situations",
    email: "priya.natarajan@example.com",
    priority: Priority.HIGH,
    warmth: Warmth.WARM,
    stage: RelationshipStage.WARM_RELATIONSHIP,
    tags: ["Special Situations"],
    lastTouchDaysAgo: 68
  });

  const alum = await contact({
    firstName: "Ethan",
    lastName: "Rosen",
    firm: "Apollo",
    title: "Principal",
    group: "Private Credit",
    email: "ethan.rosen@example.com",
    priority: Priority.MEDIUM,
    warmth: Warmth.STRONG,
    stage: RelationshipStage.STRONG_ADVOCATE,
    tags: ["Private Credit", "UChicago Alum"],
    lastTouchDaysAgo: 46
  });

  const speaker = await contact({
    firstName: "Sarah",
    lastName: "Patel",
    firm: "Blackstone",
    title: "Senior Associate",
    group: "Credit",
    email: "sarah.patel@example.com",
    priority: Priority.MEDIUM,
    warmth: Warmth.LUKEWARM,
    stage: RelationshipStage.CALL_SCHEDULED,
    tags: ["Speaker Prospect"],
    lastTouchDaysAgo: 5
  });

  const recruiter = await contact({
    firstName: "Rebecca",
    lastName: "Miller",
    firm: "UChicago",
    title: "Finance Recruiter",
    group: "Career Advancement",
    email: "rebecca.miller@example.com",
    location: "Chicago, IL",
    priority: Priority.MEDIUM,
    warmth: Warmth.WARM,
    stage: RelationshipStage.WARM_RELATIONSHIP,
    tags: ["Recruiter", "UChicago Alum"],
    lastTouchDaysAgo: 21
  });

  const conversations = await Promise.all([
    prisma.conversation.create({
      data: {
        title: "Coffee chat about restructuring recruiting",
        conversationType: ConversationType.COFFEE_CHAT,
        medium: Medium.PHONE,
        happenedAt: daysAgo(3),
        durationMinutes: 32,
        primaryContactId: evercore.id,
        firmId: byName.Evercore.id,
        summary: "Maya walked through RX recruiting timelines and how to frame restructuring interest.",
        keyTopics: "RX technical prep, deal awareness, follow-up cadence",
        adviceGiven: "Know recent liability management transactions and ask precise group-level questions.",
        personalHooks: "UChicago basketball and distressed debt case studies.",
        firmInsights: "Evercore RX values crisp accounting fluency and deal curiosity.",
        recruitingInsights: "Start with analysts and associates, then ask for one additional introduction.",
        followUpAngle: "Send thank-you with one case study takeaway.",
        nextAction: "Send thank-you note",
        suggestedFollowUpDate: daysAgo(2),
        relationshipWarmthAfter: Warmth.WARM,
        cleanNotes: "Strong first call. Follow up with concise thank-you and later recruiting update.",
        participants: { create: { contactId: evercore.id, role: ParticipantRole.PRIMARY } }
      }
    }),
    prisma.conversation.create({
      data: {
        title: "Zoom call about special situations investing",
        conversationType: ConversationType.ZOOM_CALL,
        medium: Medium.ZOOM,
        happenedAt: daysAgo(14),
        durationMinutes: 45,
        primaryContactId: bain.id,
        firmId: byName["Bain Capital"].id,
        summary: "Discussed special situations mandate, sourcing, and how private credit differs from distressed hedge fund investing.",
        keyTopics: "Special situations, private credit underwriting, career path",
        nextAction: "Reconnect with update after credit memo is finished",
        suggestedFollowUpDate: daysFromNow(31),
        relationshipWarmthAfter: Warmth.WARM,
        participants: { create: { contactId: bain.id, role: ParticipantRole.PRIMARY } }
      }
    }),
    prisma.conversation.create({
      data: {
        title: "UCG speaker outreach call",
        conversationType: ConversationType.UCG_SPEAKER_CONVERSATION,
        medium: Medium.GOOGLE_MEET,
        happenedAt: daysAgo(5),
        durationMinutes: 25,
        primaryContactId: speaker.id,
        firmId: byName.Blackstone.id,
        summary: "Explored a UCG speaker session on private credit market structure.",
        keyTopics: "Speaker logistics, topic framing, student audience",
        nextAction: "Send proposed dates and topic bullets",
        suggestedFollowUpDate: daysFromNow(1),
        relationshipWarmthAfter: Warmth.LUKEWARM,
        participants: { create: { contactId: speaker.id, role: ParticipantRole.SPEAKER } }
      }
    }),
    prisma.conversation.create({
      data: {
        title: "Alumni networking call",
        conversationType: ConversationType.RECRUITING_CALL,
        medium: Medium.PHONE,
        happenedAt: daysAgo(46),
        durationMinutes: 30,
        primaryContactId: alum.id,
        firmId: byName.Apollo.id,
        summary: "Ethan shared advice on private credit interviews and long-term alumni networking.",
        keyTopics: "Apollo credit, UChicago network, interview preparation",
        nextAction: "Reconnect with recruiting update",
        suggestedFollowUpDate: daysFromNow(4),
        relationshipWarmthAfter: Warmth.STRONG,
        participants: { create: { contactId: alum.id, role: ParticipantRole.PRIMARY } }
      }
    })
  ]);

  const campaigns = await Promise.all([
    prisma.outreachCampaign.create({
      data: {
        name: "Cold networking outreach to Diameter investor",
        contactId: diameter.id,
        firmId: byName["Diameter Capital Partners"].id,
        campaignType: CampaignType.COLD_NETWORKING,
        goal: "Secure an intro call about credit hedge fund recruiting.",
        status: CampaignStatus.FOLLOW_UP_1_DUE,
        priority: Priority.HIGH,
        startedAt: daysAgo(9),
        lastTouchAt: daysAgo(9),
        nextPlannedTouchAt: daysAgo(2),
        notes: "Initial note referenced credit investing and UChicago Credit Group."
      }
    }),
    prisma.outreachCampaign.create({
      data: {
        name: "Speaker invitation for Blackstone credit session",
        contactId: speaker.id,
        firmId: byName.Blackstone.id,
        campaignType: CampaignType.SPEAKER_OUTREACH,
        goal: "Invite Sarah to speak at UCG.",
        status: CampaignStatus.CALL_SCHEDULED,
        priority: Priority.MEDIUM,
        startedAt: daysAgo(8),
        lastTouchAt: daysAgo(5),
        nextPlannedTouchAt: daysFromNow(1)
      }
    }),
    prisma.outreachCampaign.create({
      data: {
        name: "Recruiting follow-up with PJT RSSG analyst",
        contactId: pjt.id,
        firmId: byName["PJT Partners"].id,
        campaignType: CampaignType.RECRUITING_FOLLOW_UP,
        goal: "Follow up after reply and schedule call.",
        status: CampaignStatus.REPLIED,
        priority: Priority.HIGH,
        startedAt: daysAgo(15),
        lastTouchAt: daysAgo(12),
        nextPlannedTouchAt: daysFromNow(2)
      }
    }),
    prisma.outreachCampaign.create({
      data: {
        name: "Post-call thank-you to Evercore associate",
        contactId: evercore.id,
        firmId: byName.Evercore.id,
        campaignType: CampaignType.POST_CALL_THANK_YOU,
        goal: "Thank Maya and keep relationship warm.",
        status: CampaignStatus.CALL_COMPLETED,
        priority: Priority.HIGH,
        startedAt: daysAgo(3),
        lastTouchAt: daysAgo(3),
        nextPlannedTouchAt: daysAgo(2)
      }
    })
  ]);

  await Promise.all([
    prisma.outreachTouch.create({
      data: {
        campaignId: campaigns[0].id,
        contactId: diameter.id,
        touchType: TouchType.INITIAL_OUTREACH,
        channel: Channel.EMAIL,
        direction: Direction.OUTBOUND,
        occurredAt: daysAgo(9),
        subject: "UChicago student interested in credit investing",
        messageBody: "Short cold outreach asking for 20 minutes.",
        status: TouchStatus.SENT
      }
    }),
    prisma.outreachTouch.create({
      data: {
        campaignId: campaigns[1].id,
        contactId: speaker.id,
        touchType: TouchType.SPEAKER_INVITATION,
        channel: Channel.EMAIL,
        direction: Direction.OUTBOUND,
        occurredAt: daysAgo(8),
        subject: "UChicago Credit Group speaker invitation",
        status: TouchStatus.SENT
      }
    }),
    prisma.outreachTouch.create({
      data: {
        campaignId: campaigns[2].id,
        contactId: pjt.id,
        touchType: TouchType.SCHEDULING_REPLY,
        channel: Channel.EMAIL,
        direction: Direction.INBOUND,
        occurredAt: daysAgo(12),
        subject: "Re: RSSG recruiting questions",
        status: TouchStatus.RECEIVED,
        responseReceived: true
      }
    }),
    prisma.outreachTouch.create({
      data: {
        campaignId: campaigns[3].id,
        contactId: evercore.id,
        touchType: TouchType.THANK_YOU,
        channel: Channel.EMAIL,
        direction: Direction.OUTBOUND,
        occurredAt: daysAgo(3),
        subject: "Thank you",
        status: TouchStatus.SENT
      }
    })
  ]);

  await Promise.all([
    prisma.task.create({
      data: {
        title: "Send thank-you to Maya",
        contactId: evercore.id,
        firmId: byName.Evercore.id,
        campaignId: campaigns[3].id,
        conversationId: conversations[0].id,
        taskType: TaskType.SEND_THANK_YOU,
        dueDate: daysAgo(2),
        priority: Priority.HIGH,
        status: TaskStatus.OPEN
      }
    }),
    prisma.task.create({
      data: {
        title: "Follow up after no response from Diameter",
        contactId: diameter.id,
        firmId: byName["Diameter Capital Partners"].id,
        campaignId: campaigns[0].id,
        taskType: TaskType.SEND_FOLLOW_UP,
        dueDate: daysAgo(2),
        priority: Priority.HIGH,
        status: TaskStatus.OPEN
      }
    }),
    prisma.task.create({
      data: {
        title: "Reconnect with Ethan in 45 days",
        contactId: alum.id,
        firmId: byName.Apollo.id,
        conversationId: conversations[3].id,
        taskType: TaskType.RECONNECT_LATER,
        dueDate: daysFromNow(4),
        priority: Priority.MEDIUM,
        status: TaskStatus.OPEN
      }
    }),
    prisma.task.create({
      data: {
        title: "Prepare questions for PJT RSSG call",
        contactId: pjt.id,
        firmId: byName["PJT Partners"].id,
        campaignId: campaigns[2].id,
        taskType: TaskType.PREPARE_FOR_CALL,
        dueDate: daysFromNow(2),
        priority: Priority.HIGH,
        status: TaskStatus.OPEN
      }
    }),
    prisma.task.create({
      data: {
        title: "Send Sarah proposed UCG dates",
        contactId: speaker.id,
        firmId: byName.Blackstone.id,
        campaignId: campaigns[1].id,
        conversationId: conversations[2].id,
        taskType: TaskType.SEND_RESOURCE,
        dueDate: daysFromNow(1),
        priority: Priority.MEDIUM,
        status: TaskStatus.OPEN
      }
    })
  ]);

  await Promise.all(
    ["GMAIL", "GOOGLE_CALENDAR", "GOOGLE_CONTACTS", "AI_DRAFT_QUEUE", "LINKEDIN"].map((integrationType) =>
      prisma.integrationStub.create({
        data: {
          integrationType: integrationType as never,
          status: "COMING_LATER",
          notes: "Placeholder only. OAuth and sync are intentionally not implemented in v1."
        }
      })
    )
  );

  console.log("Seeded NetworkOS with finance networking sample data.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
