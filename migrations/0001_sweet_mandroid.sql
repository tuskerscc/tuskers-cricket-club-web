CREATE TABLE "tournaments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text NOT NULL,
	"venue" text NOT NULL,
	"status" text DEFAULT 'upcoming' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
