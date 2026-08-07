import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";

// ==========================================
// BETTER AUTH TABLES (Self-Hosted Auth)
// ==========================================

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  // Custom MAX fields
  displayName: text("display_name"),
  locale: text("locale").default("en").notNull(),
  institutionId: text("institution_id"),
  role: text("role").default("student").notNull(), // "student" | "admin"
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ==========================================
// STUDENT CARE & COMPANION TABLES
// ==========================================

export const consent = pgTable("consent", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  version: text("version").notNull(),
  grantedAt: timestamp("granted_at").defaultNow().notNull(),
  withdrawnAt: timestamp("withdrawn_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const companion = pgTable("companion", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").default("MAX").notNull(),
  tone: text("tone").default("warm").notNull(),
  avatarSeed: text("avatar_seed").default("default").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const conversation = pgTable("conversation", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").default("Conversation").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const message = pgTable("message", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id")
    .notNull()
    .references(() => conversation.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // "user" | "assistant" | "system"
  content: text("content").notNull(),
  riskLevel: text("risk_level").default("none").notNull(), // "none" | "distress" | "crisis"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const memorySummary = pgTable("memory_summary", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  summary: text("summary").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ==========================================
// WELLNESS & CLINICAL SCREENERS
// ==========================================

export const moodCheckIn = pgTable("mood_check_in", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  score: integer("score").notNull(), // 1 - 5
  note: text("note"),
  checkInDate: text("check_in_date").notNull(), // YYYY-MM-DD
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const screenerRun = pgTable("screener_run", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  instrument: text("instrument").notNull(), // "phq9" | "gad7" | "cbi"
  responses: jsonb("responses").notNull(),
  totalScore: integer("total_score").notNull(),
  band: text("band").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const journalEntry = pgTable("journal_entry", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  mood: text("mood").notNull(),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==========================================
// JOURNEYS & INTERVENTIONS
// ==========================================

export const journeyEnrolment = pgTable("journey_enrolment", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  journeyId: text("journey_id").notNull(),
  currentDay: integer("current_day").default(1).notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const journeyStep = pgTable("journey_step", {
  id: text("id").primaryKey(),
  enrolmentId: text("enrolment_id")
    .notNull()
    .references(() => journeyEnrolment.id, { onDelete: "cascade" }),
  day: integer("day").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

// ==========================================
// PRIVACY-ENFORCED SAFETY & INSTITUTION
// ==========================================

// Critical invariant: safetyEvent has NO userId and NO raw message content.
export const safetyEvent = pgTable("safety_event", {
  id: text("id").primaryKey(),
  riskLevel: text("risk_level").notNull(), // "distress" | "crisis"
  triggerLayer: text("trigger_layer").notNull(), // "deterministic" | "model"
  actionTaken: text("action_taken").notNull(), // "escalation_card" | "grounding_prompt"
  reasonCode: text("reason_code").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const institution = pgTable("institution", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // "university" | "college" | "institute"
  counsellorContact: text("counsellor_contact"),
  counsellorEmail: text("counsellor_email"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
