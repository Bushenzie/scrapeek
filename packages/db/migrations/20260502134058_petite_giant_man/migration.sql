ALTER TABLE "blueprint" ALTER COLUMN "blueprint_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "blueprint_type";--> statement-breakpoint
CREATE TYPE "blueprint_type" AS ENUM('api', 'dynamic', 'static');--> statement-breakpoint
ALTER TABLE "blueprint" ALTER COLUMN "blueprint_type" SET DATA TYPE "blueprint_type" USING "blueprint_type"::"blueprint_type";