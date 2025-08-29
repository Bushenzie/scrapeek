CREATE TYPE "public"."type" AS ENUM('api', 'static', 'dynamic');--> statement-breakpoint
CREATE TABLE "blueprint" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" varchar(255) NOT NULL,
	"base_url" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" "type" NOT NULL,
	"config" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
