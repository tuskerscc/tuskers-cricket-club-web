import { db } from "./db";
import { users, heroSlides, newsArticles, players, playerStats, galleryItems } from "@shared/schema";
import bcrypt from "bcrypt";

async function seed() {
  console.log("Starting database seed...");

  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await db.insert(users).values({
      username: "admin",
      password: hashedPassword,
      role: "admin"
    }).onConflictDoNothing();

    // Create hero slides with cricket celebration theme
    await db.insert(heroSlides).values([
      {
        title: "Thank you, Paltan - for every moment, every heartbeat!",
        description: "And just like that, the curtain drops on what's been a rollercoaster ri...",
        date: "02 JUN, 2025",
        image: "/api/placeholder/1200/600",
        isActive: true,
        order: 1
      },
      {
        title: "Tuskers Cricket Club - Champions Rise",
        description: "Join the legacy of champions and make your mark in cricket history",
        date: "01 JUN, 2025",
        image: "/api/placeholder/1200/600", 
        isActive: true,
        order: 2
      },
      {
        title: "Where Legends Are Born",
        description: "Experience the thrill of cricket with Tuskers CC",
        date: "31 MAY, 2025",
        image: "/api/placeholder/1200/600",
        isActive: true,
        order: 3
      }
    ]).onConflictDoNothing();

    // Create news articles
    await db.insert(newsArticles).values([
      {
        title: "Tuskers CC Wins Championship Final",
        description: "Tuskers CC claims championship in thrilling finale",
        content: "In a thrilling finale, Tuskers Cricket Club defeated rivals by 6 wickets to claim the championship trophy. The match saw outstanding performances from our key players.",
        date: "01 JUN, 2025",
        image: "/api/placeholder/400/300",
        isPublished: true
      },
      {
        title: "New Season Player Registrations Open",
        description: "Season registrations now open for aspiring cricketers",
        content: "We are excited to announce that registrations for the upcoming season are now open. Join Tuskers CC and be part of our winning tradition.",
        date: "25 MAY, 2025",
        image: "/api/placeholder/400/300",
        isPublished: true
      },
      {
        title: "Youth Academy Launch Success",
        description: "Youth academy launches with 50+ enrollments",
        content: "Our youth academy has successfully launched with over 50 young cricketers enrolled. The academy focuses on developing fundamental skills and sportsmanship.",
        date: "20 MAY, 2025",
        image: "/api/placeholder/400/300",
        isPublished: true
      }
    ]).onConflictDoNothing();

    // Create players
    const playersData = [
      {
        name: "Rajesh Kumar",
        role: "Captain/Batsman",
        jerseyNumber: 1,
        image: "/api/placeholder/300/400",
        isCaptain: true,
        isActive: true
      },
      {
        name: "Amit Sharma",
        role: "All-rounder",
        jerseyNumber: 7,
        image: "/api/placeholder/300/400",
        isCaptain: false,
        isActive: true
      },
      {
        name: "Priya Patel",
        role: "Bowler",
        jerseyNumber: 11,
        image: "/api/placeholder/300/400",
        isCaptain: false,
        isActive: true
      },
      {
        name: "Vikram Singh",
        role: "Wicket-keeper",
        jerseyNumber: 3,
        image: "/api/placeholder/300/400",
        isCaptain: false,
        isActive: true
      },
      {
        name: "Deepika Rao",
        role: "Batsman",
        jerseyNumber: 4,
        image: "/api/placeholder/300/400",
        isCaptain: false,
        isActive: true
      }
    ];

    const insertedPlayers = await db.insert(players).values(playersData).returning();

    // Create player stats
    const statsData = insertedPlayers.map((player, index) => ({
      playerId: player.id,
      matches: 15 + index * 2,
      runsScored: 450 + index * 100,
      ballsFaced: 320 + index * 50,
      fours: 35 + index * 8,
      sixes: 12 + index * 3,
      wicketsTaken: player.role.includes("Bowler") || player.role.includes("All-rounder") ? 12 + index * 3 : 0,
      ballsBowled: player.role.includes("Bowler") || player.role.includes("All-rounder") ? 850 + index * 150 : 0,
      runsConceded: player.role.includes("Bowler") || player.role.includes("All-rounder") ? 280 + index * 50 : 0,
      catches: 8 + index * 2,
      runOuts: 2 + index,
      stumpings: player.role === "Wicket-keeper" ? 5 : 0
    }));

    await db.insert(playerStats).values(statsData).onConflictDoNothing();

    // Create gallery items
    await db.insert(galleryItems).values([
      {
        title: "Championship Victory Celebration",
        image: "/api/placeholder/600/400",
        category: "Achievements",
        date: "01 JUN, 2025",
        isVisible: true
      },
      {
        title: "Training Session Highlights",
        image: "/api/placeholder/600/400",
        category: "Training",
        date: "28 MAY, 2025",
        isVisible: true
      },
      {
        title: "Youth Academy Opening",
        image: "/api/placeholder/600/400",
        category: "Events",
        date: "20 MAY, 2025",
        isVisible: true
      },
      {
        title: "Team Spirit",
        image: "/api/placeholder/600/400",
        category: "Team",
        date: "15 MAY, 2025",
        isVisible: true
      },
      {
        title: "Match Action",
        image: "/api/placeholder/600/400",
        category: "Matches",
        date: "10 MAY, 2025",
        isVisible: true
      },
      {
        title: "Awards Ceremony",
        image: "/api/placeholder/600/400",
        category: "Achievements",
        date: "05 MAY, 2025",
        isVisible: true
      }
    ]).onConflictDoNothing();

    console.log("Database seeded successfully!");
    
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();