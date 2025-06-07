import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for admin authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Hero slides for the carousel
export const heroSlides = pgTable("hero_slides", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  image: text("image").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// News articles
export const newsArticles = pgTable("news_articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  date: text("date").notNull(),
  image: text("image").notNull(),
  isPublished: boolean("is_published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Players
export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  jerseyNumber: integer("jersey_number").notNull(),
  image: text("image").notNull(),
  isCaptain: boolean("is_captain").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Player statistics
export const playerStats = pgTable("player_stats", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").references(() => players.id).notNull(),
  matches: integer("matches").default(0).notNull(),
  runsScored: integer("runs_scored").default(0).notNull(),
  ballsFaced: integer("balls_faced").default(0).notNull(),
  fours: integer("fours").default(0).notNull(),
  sixes: integer("sixes").default(0).notNull(),
  wicketsTaken: integer("wickets_taken").default(0).notNull(),
  ballsBowled: integer("balls_bowled").default(0).notNull(),
  runsConceded: integer("runs_conceded").default(0).notNull(),
  catches: integer("catches").default(0).notNull(),
  runOuts: integer("run_outs").default(0).notNull(),
  stumpings: integer("stumpings").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Gallery items
export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  image: text("image").notNull(),
  category: text("category").notNull().default("Photos"),
  date: text("date").notNull(),
  isVisible: boolean("is_visible").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Social interactions (likes, dislikes, shares)
export const socialInteractions = pgTable("social_interactions", {
  id: serial("id").primaryKey(),
  contentType: text("content_type").notNull(), // "hero", "news", etc.
  contentId: integer("content_id").notNull(),
  likes: integer("likes").default(0).notNull(),
  dislikes: integer("dislikes").default(0).notNull(),
  shares: integer("shares").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Comments
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  contentType: text("content_type").notNull(),
  contentId: integer("content_id").notNull(),
  userName: text("user_name").notNull(),
  text: text("text").notNull(),
  likes: integer("likes").default(0).notNull(),
  dislikes: integer("dislikes").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Player registrations
export const playerRegistrations = pgTable("player_registrations", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  position: text("position").notNull(),
  battingStyle: text("batting_style"),
  bowlingStyle: text("bowling_style"),
  experience: text("experience"),
  previousTeams: text("previous_teams"),
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  motivation: text("motivation"),
  status: text("status").default("pending").notNull(), // pending, approved, rejected
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const playersRelations = relations(players, ({ one }) => ({
  stats: one(playerStats, {
    fields: [players.id],
    references: [playerStats.playerId],
  }),
}));

export const playerStatsRelations = relations(playerStats, ({ one }) => ({
  player: one(players, {
    fields: [playerStats.playerId],
    references: [players.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertHeroSlideSchema = createInsertSchema(heroSlides).omit({
  id: true,
  createdAt: true,
});

export const insertNewsArticleSchema = createInsertSchema(newsArticles).omit({
  id: true,
  createdAt: true,
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
  createdAt: true,
});

export const insertPlayerStatsSchema = createInsertSchema(playerStats).omit({
  id: true,
  updatedAt: true,
});

export const insertGalleryItemSchema = createInsertSchema(galleryItems).omit({
  id: true,
  createdAt: true,
});

export const insertSocialInteractionSchema = createInsertSchema(socialInteractions).omit({
  id: true,
  updatedAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

export const insertPlayerRegistrationSchema = createInsertSchema(playerRegistrations).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type HeroSlide = typeof heroSlides.$inferSelect;
export type InsertHeroSlide = z.infer<typeof insertHeroSlideSchema>;

export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;

export type Player = typeof players.$inferSelect;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;

export type PlayerStats = typeof playerStats.$inferSelect;
export type InsertPlayerStats = z.infer<typeof insertPlayerStatsSchema>;

export type GalleryItem = typeof galleryItems.$inferSelect;
export type InsertGalleryItem = z.infer<typeof insertGalleryItemSchema>;

export type SocialInteraction = typeof socialInteractions.$inferSelect;
export type InsertSocialInteraction = z.infer<typeof insertSocialInteractionSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type PlayerRegistration = typeof playerRegistrations.$inferSelect;
export type InsertPlayerRegistration = z.infer<typeof insertPlayerRegistrationSchema>;

// Extended types with relations
// Tournaments table (example of adding a new table)
export const tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  venue: text("venue").notNull(),
  status: text("status").default("upcoming").notNull(), // upcoming, ongoing, completed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTournamentSchema = createInsertSchema(tournaments).omit({
  id: true,
  createdAt: true,
});

export type Tournament = typeof tournaments.$inferSelect;
export type InsertTournament = z.infer<typeof insertTournamentSchema>;

export type PlayerWithStats = Player & { stats?: PlayerStats };
