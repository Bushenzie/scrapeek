ALTER TABLE "result" DROP CONSTRAINT "result_blueprint_id_blueprint_id_fk";
--> statement-breakpoint
ALTER TABLE "result" ADD CONSTRAINT "result_blueprint_id_blueprint_id_fk" FOREIGN KEY ("blueprint_id") REFERENCES "public"."blueprint"("id") ON DELETE cascade ON UPDATE no action;