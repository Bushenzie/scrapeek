ALTER TABLE "group" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "group" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;