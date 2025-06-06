import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHeroSlideSchema, insertNewsArticleSchema, insertPlayerSchema, insertPlayerStatsSchema, insertGalleryItemSchema, insertSocialInteractionSchema, insertCommentSchema, insertPlayerRegistrationSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "tuskers_cricket_club_secret_2024";

// Middleware to verify admin token
function verifyAdmin(req: any, res: any, next: any) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Hero slides routes
  app.get("/api/hero-slides", async (req, res) => {
    try {
      const slides = await storage.getActiveHeroSlides();
      res.json(slides);
    } catch (error) {
      console.error('Fetch hero slides error:', error);
      res.status(500).json({ message: "Failed to fetch hero slides" });
    }
  });

  app.post("/api/hero-slides", verifyAdmin, async (req, res) => {
    try {
      const validatedData = insertHeroSlideSchema.parse(req.body);
      const slide = await storage.createHeroSlide(validatedData);
      res.status(201).json(slide);
    } catch (error) {
      console.error('Create hero slide error:', error);
      res.status(400).json({ message: "Invalid hero slide data" });
    }
  });

  app.put("/api/hero-slides/:id", verifyAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertHeroSlideSchema.parse(req.body);
      const slide = await storage.updateHeroSlide(id, validatedData);
      res.json(slide);
    } catch (error) {
      console.error('Update hero slide error:', error);
      res.status(400).json({ message: "Failed to update hero slide" });
    }
  });

  app.delete("/api/hero-slides/:id", verifyAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteHeroSlide(id);
      res.status(204).send();
    } catch (error) {
      console.error('Delete hero slide error:', error);
      res.status(400).json({ message: "Failed to delete hero slide" });
    }
  });

  // News routes
  app.get("/api/news", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const news = await storage.getPublishedNews(limit);
      res.json(news);
    } catch (error) {
      console.error('Fetch news error:', error);
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  app.get("/api/news/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await storage.getNewsArticle(id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error('Fetch article error:', error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.post("/api/news", verifyAdmin, async (req, res) => {
    try {
      const validatedData = insertNewsArticleSchema.parse(req.body);
      const article = await storage.createNewsArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      console.error('Create news error:', error);
      res.status(400).json({ message: "Invalid news article data" });
    }
  });

  app.put("/api/news/:id", verifyAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertNewsArticleSchema.parse(req.body);
      const article = await storage.updateNewsArticle(id, validatedData);
      res.json(article);
    } catch (error) {
      console.error('Update news error:', error);
      res.status(400).json({ message: "Failed to update news article" });
    }
  });

  app.delete("/api/news/:id", verifyAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteNewsArticle(id);
      res.status(204).send();
    } catch (error) {
      console.error('Delete news error:', error);
      res.status(400).json({ message: "Failed to delete news article" });
    }
  });

  // Players routes
  app.get("/api/players", async (req, res) => {
    try {
      const players = await storage.getActivePlayers();
      res.json(players);
    } catch (error) {
      console.error('Fetch players error:', error);
      res.status(500).json({ message: "Failed to fetch players" });
    }
  });

  app.get("/api/players/with-stats", async (req, res) => {
    try {
      const players = await storage.getPlayersWithStats();
      res.json(players);
    } catch (error) {
      console.error('Fetch players with stats error:', error);
      res.status(500).json({ message: "Failed to fetch players with stats" });
    }
  });

  app.post("/api/players", verifyAdmin, async (req, res) => {
    try {
      const validatedData = insertPlayerSchema.parse(req.body);
      const player = await storage.createPlayer(validatedData);
      res.status(201).json(player);
    } catch (error) {
      console.error('Create player error:', error);
      res.status(400).json({ message: "Invalid player data" });
    }
  });

  app.put("/api/players/:id", verifyAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPlayerSchema.parse(req.body);
      const player = await storage.updatePlayer(id, validatedData);
      res.json(player);
    } catch (error) {
      console.error('Update player error:', error);
      res.status(400).json({ message: "Failed to update player" });
    }
  });

  app.delete("/api/players/:id", verifyAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePlayer(id);
      res.status(204).send();
    } catch (error) {
      console.error('Delete player error:', error);
      res.status(400).json({ message: "Failed to delete player" });
    }
  });

  // Player stats routes
  app.put("/api/players/:id/stats", verifyAdmin, async (req, res) => {
    try {
      const playerId = parseInt(req.params.id);
      const validatedData = insertPlayerStatsSchema.parse({
        ...req.body,
        playerId
      });
      const stats = await storage.updatePlayerStats(playerId, validatedData);
      res.json(stats);
    } catch (error) {
      console.error('Update player stats error:', error);
      res.status(400).json({ message: "Failed to update player stats" });
    }
  });

  // Gallery routes
  app.get("/api/gallery", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const gallery = await storage.getVisibleGalleryItems(limit);
      res.json(gallery);
    } catch (error) {
      console.error('Fetch gallery error:', error);
      res.status(500).json({ message: "Failed to fetch gallery" });
    }
  });

  app.post("/api/gallery", verifyAdmin, async (req, res) => {
    try {
      const validatedData = insertGalleryItemSchema.parse(req.body);
      const item = await storage.createGalleryItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      console.error('Create gallery item error:', error);
      res.status(400).json({ message: "Invalid gallery item data" });
    }
  });

  app.delete("/api/gallery/:id", verifyAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteGalleryItem(id);
      res.status(204).send();
    } catch (error) {
      console.error('Delete gallery item error:', error);
      res.status(400).json({ message: "Failed to delete gallery item" });
    }
  });

  // Social interactions routes
  app.get("/api/social/:contentType/:contentId", async (req, res) => {
    try {
      const { contentType, contentId } = req.params;
      const interactions = await storage.getSocialInteractions(contentType, parseInt(contentId));
      res.json(interactions || { likes: 0, dislikes: 0, shares: 0 });
    } catch (error) {
      console.error('Fetch social interactions error:', error);
      res.status(500).json({ message: "Failed to fetch social interactions" });
    }
  });

  app.post("/api/social/:contentType/:contentId/like", async (req, res) => {
    try {
      const { contentType, contentId } = req.params;
      const interactions = await storage.incrementLikes(contentType, parseInt(contentId));
      res.json(interactions);
    } catch (error) {
      console.error('Update likes error:', error);
      res.status(500).json({ message: "Failed to update likes" });
    }
  });

  app.post("/api/social/:contentType/:contentId/dislike", async (req, res) => {
    try {
      const { contentType, contentId } = req.params;
      const interactions = await storage.incrementDislikes(contentType, parseInt(contentId));
      res.json(interactions);
    } catch (error) {
      console.error('Update dislikes error:', error);
      res.status(500).json({ message: "Failed to update dislikes" });
    }
  });

  app.post("/api/social/:contentType/:contentId/share", async (req, res) => {
    try {
      const { contentType, contentId } = req.params;
      const interactions = await storage.incrementShares(contentType, parseInt(contentId));
      res.json(interactions);
    } catch (error) {
      console.error('Update shares error:', error);
      res.status(500).json({ message: "Failed to update shares" });
    }
  });

  // Comments routes
  app.get("/api/comments/:contentType/:contentId", async (req, res) => {
    try {
      const { contentType, contentId } = req.params;
      const comments = await storage.getComments(contentType, parseInt(contentId));
      res.json(comments);
    } catch (error) {
      console.error('Fetch comments error:', error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/comments", async (req, res) => {
    try {
      const validatedData = insertCommentSchema.parse(req.body);
      const comment = await storage.createComment(validatedData);
      res.status(201).json(comment);
    } catch (error) {
      console.error('Create comment error:', error);
      res.status(400).json({ message: "Invalid comment data" });
    }
  });

  app.delete("/api/comments/:id", verifyAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteComment(id);
      res.status(204).send();
    } catch (error) {
      console.error('Delete comment error:', error);
      res.status(400).json({ message: "Failed to delete comment" });
    }
  });

  // Registration routes
  app.get("/api/registrations", verifyAdmin, async (req, res) => {
    try {
      const registrations = await storage.getPlayerRegistrations();
      res.json(registrations);
    } catch (error) {
      console.error('Fetch registrations error:', error);
      res.status(500).json({ message: "Failed to fetch registrations" });
    }
  });

  app.post("/api/registrations", async (req, res) => {
    try {
      const validatedData = insertPlayerRegistrationSchema.parse(req.body);
      const registration = await storage.createPlayerRegistration(validatedData);
      res.status(201).json(registration);
    } catch (error) {
      console.error('Create registration error:', error);
      res.status(400).json({ message: "Invalid registration data" });
    }
  });

  app.put("/api/registrations/:id/status", verifyAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      const registration = await storage.updateRegistrationStatus(id, status);
      res.json(registration);
    } catch (error) {
      console.error('Update registration status error:', error);
      res.status(400).json({ message: "Failed to update registration status" });
    }
  });

  // Statistics routes
  app.get("/api/stats/team", async (req, res) => {
    try {
      const stats = await storage.getTeamStatistics();
      res.json(stats);
    } catch (error) {
      console.error('Fetch team statistics error:', error);
      res.status(500).json({ message: "Failed to fetch team statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
