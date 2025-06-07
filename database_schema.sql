
-- Users table for admin authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Hero slides for the carousel
CREATE TABLE hero_slides (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    image TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- News articles
CREATE TABLE news_articles (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    date TEXT NOT NULL,
    image TEXT NOT NULL,
    is_published BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Players
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    jersey_number INTEGER NOT NULL,
    image TEXT NOT NULL,
    is_captain BOOLEAN DEFAULT false NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Player statistics
CREATE TABLE player_stats (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id) NOT NULL,
    matches INTEGER DEFAULT 0 NOT NULL,
    runs_scored INTEGER DEFAULT 0 NOT NULL,
    balls_faced INTEGER DEFAULT 0 NOT NULL,
    fours INTEGER DEFAULT 0 NOT NULL,
    sixes INTEGER DEFAULT 0 NOT NULL,
    wickets_taken INTEGER DEFAULT 0 NOT NULL,
    balls_bowled INTEGER DEFAULT 0 NOT NULL,
    runs_conceded INTEGER DEFAULT 0 NOT NULL,
    catches INTEGER DEFAULT 0 NOT NULL,
    run_outs INTEGER DEFAULT 0 NOT NULL,
    stumpings INTEGER DEFAULT 0 NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Gallery items
CREATE TABLE gallery_items (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Photos',
    date TEXT NOT NULL,
    is_visible BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Social interactions (likes, dislikes, shares)
CREATE TABLE social_interactions (
    id SERIAL PRIMARY KEY,
    content_type TEXT NOT NULL,
    content_id INTEGER NOT NULL,
    likes INTEGER DEFAULT 0 NOT NULL,
    dislikes INTEGER DEFAULT 0 NOT NULL,
    shares INTEGER DEFAULT 0 NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Comments
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content_type TEXT NOT NULL,
    content_id INTEGER NOT NULL,
    user_name TEXT NOT NULL,
    text TEXT NOT NULL,
    likes INTEGER DEFAULT 0 NOT NULL,
    dislikes INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Player registrations
CREATE TABLE player_registrations (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    position TEXT NOT NULL,
    batting_style TEXT,
    bowling_style TEXT,
    experience TEXT,
    previous_teams TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    motivation TEXT,
    status TEXT DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
