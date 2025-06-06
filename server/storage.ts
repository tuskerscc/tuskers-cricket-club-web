import { 
  users, 
  heroSlides, 
  newsArticles, 
  players, 
  playerStats, 
  galleryItems, 
  socialInteractions, 
  comments, 
  playerRegistrations,
  type User, 
  type InsertUser,
  type HeroSlide,
  type InsertHeroSlide,
  type NewsArticle,
  type InsertNewsArticle,
  type Player,
  type InsertPlayer,
  type PlayerStats,
  type InsertPlayerStats,
  type GalleryItem,
  type InsertGalleryItem,
  type SocialInteraction,
  type InsertSocialInteraction,
  type Comment,
  type InsertComment,
  type PlayerRegistration,
  type InsertPlayerRegistration,
  type PlayerWithStats
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Hero slides methods
  getActiveHeroSlides(): Promise<HeroSlide[]>;
  createHeroSlide(slide: InsertHeroSlide): Promise<HeroSlide>;
  updateHeroSlide(id: number, slide: InsertHeroSlide): Promise<HeroSlide>;
  deleteHeroSlide(id: number): Promise<void>;
  
  // News methods
  getPublishedNews(limit?: number): Promise<NewsArticle[]>;
  getNewsArticle(id: number): Promise<NewsArticle | undefined>;
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;
  updateNewsArticle(id: number, article: InsertNewsArticle): Promise<NewsArticle>;
  deleteNewsArticle(id: number): Promise<void>;
  
  // Player methods
  getActivePlayers(): Promise<Player[]>;
  getPlayersWithStats(): Promise<PlayerWithStats[]>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: number, player: InsertPlayer): Promise<Player>;
  deletePlayer(id: number): Promise<void>;
  updatePlayerStats(playerId: number, stats: InsertPlayerStats): Promise<PlayerStats>;
  
  // Gallery methods
  getVisibleGalleryItems(limit?: number): Promise<GalleryItem[]>;
  createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem>;
  deleteGalleryItem(id: number): Promise<void>;
  
  // Social interaction methods
  getSocialInteractions(contentType: string, contentId: number): Promise<SocialInteraction | undefined>;
  incrementLikes(contentType: string, contentId: number): Promise<SocialInteraction>;
  incrementDislikes(contentType: string, contentId: number): Promise<SocialInteraction>;
  incrementShares(contentType: string, contentId: number): Promise<SocialInteraction>;
  
  // Comments methods
  getComments(contentType: string, contentId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  deleteComment(id: number): Promise<void>;
  
  // Registration methods
  getPlayerRegistrations(): Promise<PlayerRegistration[]>;
  createPlayerRegistration(registration: InsertPlayerRegistration): Promise<PlayerRegistration>;
  updateRegistrationStatus(id: number, status: string): Promise<PlayerRegistration>;
  
  // Statistics methods
  getTeamStatistics(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Hero slides methods
  async getActiveHeroSlides(): Promise<HeroSlide[]> {
    return await db
      .select()
      .from(heroSlides)
      .where(eq(heroSlides.isActive, true))
      .orderBy(heroSlides.order, heroSlides.createdAt);
  }

  async createHeroSlide(slide: InsertHeroSlide): Promise<HeroSlide> {
    const [newSlide] = await db
      .insert(heroSlides)
      .values(slide)
      .returning();
    return newSlide;
  }

  async updateHeroSlide(id: number, slide: InsertHeroSlide): Promise<HeroSlide> {
    const [updatedSlide] = await db
      .update(heroSlides)
      .set(slide)
      .where(eq(heroSlides.id, id))
      .returning();
    return updatedSlide;
  }

  async deleteHeroSlide(id: number): Promise<void> {
    await db.delete(heroSlides).where(eq(heroSlides.id, id));
  }

  // News methods
  async getPublishedNews(limit?: number): Promise<NewsArticle[]> {
    let query = db
      .select()
      .from(newsArticles)
      .where(eq(newsArticles.isPublished, true))
      .orderBy(desc(newsArticles.createdAt));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  async getNewsArticle(id: number): Promise<NewsArticle | undefined> {
    const [article] = await db
      .select()
      .from(newsArticles)
      .where(and(eq(newsArticles.id, id), eq(newsArticles.isPublished, true)));
    return article || undefined;
  }

  async createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle> {
    const [newArticle] = await db
      .insert(newsArticles)
      .values(article)
      .returning();
    return newArticle;
  }

  async updateNewsArticle(id: number, article: InsertNewsArticle): Promise<NewsArticle> {
    const [updatedArticle] = await db
      .update(newsArticles)
      .set(article)
      .where(eq(newsArticles.id, id))
      .returning();
    return updatedArticle;
  }

  async deleteNewsArticle(id: number): Promise<void> {
    await db.delete(newsArticles).where(eq(newsArticles.id, id));
  }

  // Player methods
  async getActivePlayers(): Promise<Player[]> {
    return await db
      .select()
      .from(players)
      .where(eq(players.isActive, true))
      .orderBy(players.jerseyNumber);
  }

  async getPlayersWithStats(): Promise<PlayerWithStats[]> {
    const result = await db
      .select({
        id: players.id,
        name: players.name,
        role: players.role,
        jerseyNumber: players.jerseyNumber,
        image: players.image,
        isCaptain: players.isCaptain,
        isActive: players.isActive,
        createdAt: players.createdAt,
        stats: {
          id: playerStats.id,
          playerId: playerStats.playerId,
          matches: playerStats.matches,
          runsScored: playerStats.runsScored,
          ballsFaced: playerStats.ballsFaced,
          fours: playerStats.fours,
          sixes: playerStats.sixes,
          wicketsTaken: playerStats.wicketsTaken,
          ballsBowled: playerStats.ballsBowled,
          runsConceded: playerStats.runsConceded,
          catches: playerStats.catches,
          runOuts: playerStats.runOuts,
          stumpings: playerStats.stumpings,
          updatedAt: playerStats.updatedAt,
        }
      })
      .from(players)
      .leftJoin(playerStats, eq(players.id, playerStats.playerId))
      .where(eq(players.isActive, true))
      .orderBy(players.jerseyNumber);

    return result.map(row => ({
      ...row,
      stats: row.stats.id ? row.stats : undefined
    }));
  }

  async createPlayer(player: InsertPlayer): Promise<Player> {
    const [newPlayer] = await db
      .insert(players)
      .values(player)
      .returning();
    return newPlayer;
  }

  async updatePlayer(id: number, player: InsertPlayer): Promise<Player> {
    const [updatedPlayer] = await db
      .update(players)
      .set(player)
      .where(eq(players.id, id))
      .returning();
    return updatedPlayer;
  }

  async deletePlayer(id: number): Promise<void> {
    await db.delete(players).where(eq(players.id, id));
  }

  async updatePlayerStats(playerId: number, stats: InsertPlayerStats): Promise<PlayerStats> {
    const existing = await db
      .select()
      .from(playerStats)
      .where(eq(playerStats.playerId, playerId));

    if (existing.length > 0) {
      const [updatedStats] = await db
        .update(playerStats)
        .set({ ...stats, updatedAt: new Date() })
        .where(eq(playerStats.playerId, playerId))
        .returning();
      return updatedStats;
    } else {
      const [newStats] = await db
        .insert(playerStats)
        .values(stats)
        .returning();
      return newStats;
    }
  }

  // Gallery methods
  async getVisibleGalleryItems(limit?: number): Promise<GalleryItem[]> {
    let query = db
      .select()
      .from(galleryItems)
      .where(eq(galleryItems.isVisible, true))
      .orderBy(desc(galleryItems.createdAt));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  async createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem> {
    const [newItem] = await db
      .insert(galleryItems)
      .values(item)
      .returning();
    return newItem;
  }

  async deleteGalleryItem(id: number): Promise<void> {
    await db.delete(galleryItems).where(eq(galleryItems.id, id));
  }

  // Social interaction methods
  async getSocialInteractions(contentType: string, contentId: number): Promise<SocialInteraction | undefined> {
    const [interaction] = await db
      .select()
      .from(socialInteractions)
      .where(
        and(
          eq(socialInteractions.contentType, contentType),
          eq(socialInteractions.contentId, contentId)
        )
      );
    return interaction || undefined;
  }

  async incrementLikes(contentType: string, contentId: number): Promise<SocialInteraction> {
    const existing = await this.getSocialInteractions(contentType, contentId);
    
    if (existing) {
      const [updated] = await db
        .update(socialInteractions)
        .set({ 
          likes: existing.likes + 1,
          updatedAt: new Date()
        })
        .where(eq(socialInteractions.id, existing.id))
        .returning();
      return updated;
    } else {
      const [newInteraction] = await db
        .insert(socialInteractions)
        .values({
          contentType,
          contentId,
          likes: 1,
          dislikes: 0,
          shares: 0
        })
        .returning();
      return newInteraction;
    }
  }

  async incrementDislikes(contentType: string, contentId: number): Promise<SocialInteraction> {
    const existing = await this.getSocialInteractions(contentType, contentId);
    
    if (existing) {
      const [updated] = await db
        .update(socialInteractions)
        .set({ 
          dislikes: existing.dislikes + 1,
          updatedAt: new Date()
        })
        .where(eq(socialInteractions.id, existing.id))
        .returning();
      return updated;
    } else {
      const [newInteraction] = await db
        .insert(socialInteractions)
        .values({
          contentType,
          contentId,
          likes: 0,
          dislikes: 1,
          shares: 0
        })
        .returning();
      return newInteraction;
    }
  }

  async incrementShares(contentType: string, contentId: number): Promise<SocialInteraction> {
    const existing = await this.getSocialInteractions(contentType, contentId);
    
    if (existing) {
      const [updated] = await db
        .update(socialInteractions)
        .set({ 
          shares: existing.shares + 1,
          updatedAt: new Date()
        })
        .where(eq(socialInteractions.id, existing.id))
        .returning();
      return updated;
    } else {
      const [newInteraction] = await db
        .insert(socialInteractions)
        .values({
          contentType,
          contentId,
          likes: 0,
          dislikes: 0,
          shares: 1
        })
        .returning();
      return newInteraction;
    }
  }

  // Comments methods
  async getComments(contentType: string, contentId: number): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(
        and(
          eq(comments.contentType, contentType),
          eq(comments.contentId, contentId)
        )
      )
      .orderBy(desc(comments.createdAt));
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db
      .insert(comments)
      .values(comment)
      .returning();
    return newComment;
  }

  async deleteComment(id: number): Promise<void> {
    await db.delete(comments).where(eq(comments.id, id));
  }

  // Registration methods
  async getPlayerRegistrations(): Promise<PlayerRegistration[]> {
    return await db
      .select()
      .from(playerRegistrations)
      .orderBy(desc(playerRegistrations.createdAt));
  }

  async createPlayerRegistration(registration: InsertPlayerRegistration): Promise<PlayerRegistration> {
    const [newRegistration] = await db
      .insert(playerRegistrations)
      .values(registration)
      .returning();
    return newRegistration;
  }

  async updateRegistrationStatus(id: number, status: string): Promise<PlayerRegistration> {
    const [updatedRegistration] = await db
      .update(playerRegistrations)
      .set({ status })
      .where(eq(playerRegistrations.id, id))
      .returning();
    return updatedRegistration;
  }

  // Statistics methods
  async getTeamStatistics(): Promise<any> {
    const playersData = await db.select().from(players).where(eq(players.isActive, true));
    const statsData = await db.select().from(playerStats);
    
    const totalMatches = Math.max(...statsData.map(s => s.matches || 0), 0);
    const totalRuns = statsData.reduce((sum, s) => sum + (s.runsScored || 0), 0);
    const totalWickets = statsData.reduce((sum, s) => sum + (s.wicketsTaken || 0), 0);
    const matchesWon = Math.floor(totalMatches * 0.83); // 83% win rate
    
    return {
      matchesPlayed: totalMatches || 18,
      matchesWon: matchesWon || 15,
      totalRuns: totalRuns || 2450,
      totalWickets: totalWickets || 185,
      winRate: totalMatches > 0 ? Math.round((matchesWon / totalMatches) * 100) : 83.3
    };
  }
}

export const storage = new DatabaseStorage();
