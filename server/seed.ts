import bcrypt from "bcrypt";
import { db } from "./db";
import { 
  users, 
  heroSlides, 
  newsArticles, 
  players, 
  playerStats, 
  galleryItems 
} from "@shared/schema";

async function seed() {
  console.log("Starting database seeding...");

  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash("tuskers2024", 10);
    await db.insert(users).values({
      username: "admin",
      password: hashedPassword,
      role: "admin"
    });
    console.log("✓ Admin user created");

    // Create hero slides
    await db.insert(heroSlides).values([
      {
        title: "Championship Victory!",
        description: "From dominating the league matches to securing the championship trophy - witness our incredible journey to glory...",
        date: "15 MAR, 2024",
        image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
        order: 1,
        isActive: true
      },
      {
        title: "Training Excellence",
        description: "Behind every victory lies countless hours of dedication and training. See how our champions prepare for greatness...",
        date: "22 MAR, 2024",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
        order: 2,
        isActive: true
      }
    ]);
    console.log("✓ Hero slides created");

    // Create news articles
    await db.insert(newsArticles).values([
      {
        title: "Thank you, #TeamOf2025!",
        description: "An incredible season comes to an end. Thank you to all our players, coaches, and fans for making this journey unforgettable.",
        content: "What a season it has been! From the very first match to lifting the championship trophy, every moment has been filled with passion, dedication, and team spirit. Our players have shown incredible skill and determination throughout the season. The coaching staff deserves special recognition for their strategic guidance and unwavering support. But most importantly, we want to thank our fans who have been with us through every victory and challenge. Your support means everything to us. As we celebrate this championship, we're already looking forward to next season with even greater ambitions. Thank you for being part of the Tuskers family!",
        date: "04 JUN, 2025",
        image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        isPublished: true
      },
      {
        title: "Tuskers की Bowling Unit - Bowled us over!",
        description: "Our bowling attack has been phenomenal this season, taking crucial wickets at important moments.",
        content: "The bowling unit has been the backbone of our championship victory. Led by our experienced bowlers, the team has consistently delivered under pressure. From swing bowling in the powerplay to death bowling expertise, our bowlers have mastered every aspect of the game. The statistics speak for themselves - 185 wickets taken throughout the season with an impressive economy rate. What makes this unit special is their ability to work as a team, setting up batsmen and executing plans perfectly. The dedication shown in training and the mental strength displayed in crucial matches has been exemplary.",
        date: "28 MAY, 2025",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        isPublished: true
      },
      {
        title: "Season Highlights Reel",
        description: "Relive the best moments from our championship-winning season with this exclusive highlights package.",
        content: "Our championship season has been filled with unforgettable moments that will be remembered for years to come. From spectacular catches to match-winning performances, every game brought something special. The team's resilience in close matches, the support from our incredible fans, and the individual brilliance of our players have all contributed to this remarkable journey. This highlights reel captures the essence of what made this season so special - the teamwork, the passion, and the never-give-up attitude that defines Tuskers Cricket Club.",
        date: "15 MAY, 2025",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        isPublished: true
      }
    ]);
    console.log("✓ News articles created");

    // Create players
    const playerData = [
      {
        name: "HARDIK PANDYA",
        role: "ALL-ROUNDER",
        jerseyNumber: 7,
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400",
        isCaptain: true,
        isActive: true
      },
      {
        name: "AM GHAZANFAR",
        role: "BOWLER",
        jerseyNumber: 23,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400",
        isCaptain: false,
        isActive: true
      },
      {
        name: "ARJUN TENDULKAR",
        role: "BOWLER",
        jerseyNumber: 18,
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400",
        isCaptain: false,
        isActive: true
      },
      {
        name: "ASHWANI KUMAR",
        role: "BOWLER",
        jerseyNumber: 11,
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400",
        isCaptain: false,
        isActive: true
      },
      {
        name: "BEYON JACC",
        role: "ALL-ROUNDER",
        jerseyNumber: 15,
        image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400",
        isCaptain: false,
        isActive: true
      }
    ];

    const createdPlayers = await db.insert(players).values(playerData).returning();
    console.log("✓ Players created");

    // Create player stats
    const statsData = [
      { playerId: createdPlayers[0].id, matches: 18, runsScored: 485, ballsFaced: 320, fours: 45, sixes: 12, wicketsTaken: 23, ballsBowled: 180, runsConceded: 145, catches: 8 },
      { playerId: createdPlayers[1].id, matches: 16, runsScored: 45, ballsFaced: 35, fours: 3, sixes: 0, wicketsTaken: 28, ballsBowled: 240, runsConceded: 180, catches: 3 },
      { playerId: createdPlayers[2].id, matches: 15, runsScored: 78, ballsFaced: 65, fours: 8, sixes: 1, wicketsTaken: 22, ballsBowled: 200, runsConceded: 165, catches: 5 },
      { playerId: createdPlayers[3].id, matches: 17, runsScored: 34, ballsFaced: 28, fours: 2, sixes: 0, wicketsTaken: 25, ballsBowled: 220, runsConceded: 175, catches: 4 },
      { playerId: createdPlayers[4].id, matches: 14, runsScored: 189, ballsFaced: 145, fours: 18, sixes: 6, wicketsTaken: 15, ballsBowled: 120, runsConceded: 95, catches: 6 }
    ];

    await db.insert(playerStats).values(statsData);
    console.log("✓ Player stats created");

    // Create gallery items
    await db.insert(galleryItems).values([
      {
        title: "Moments from Tuskers vs Eagles",
        image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Photos",
        date: "07 May, 2025",
        isVisible: true
      },
      {
        title: "Team Celebration",
        image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Photos",
        date: "15 Mar, 2024",
        isVisible: true
      },
      {
        title: "Training Session",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Photos",
        date: "22 Apr, 2024",
        isVisible: true
      },
      {
        title: "Award Ceremony",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Photos",
        date: "30 May, 2024",
        isVisible: true
      },
      {
        title: "Fan Engagement",
        image: "https://images.unsplash.com/photo-1565193516215-57b13b7e8977?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Photos",
        date: "12 Jun, 2024",
        isVisible: true
      },
      {
        title: "Match Action",
        image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Photos",
        date: "18 Apr, 2024",
        isVisible: true
      }
    ]);
    console.log("✓ Gallery items created");

    console.log("🎉 Database seeding completed successfully!");
    console.log("Admin credentials:");
    console.log("Username: admin");
    console.log("Password: tuskers2024");

  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (import.meta.url === new URL(process.argv[1], 'file://').href) {
  seed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { seed };
