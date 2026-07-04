CREATE TABLE "user_skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"skill_name" varchar(100) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "quests" ALTER COLUMN "dev_reward" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "quests" ALTER COLUMN "research_reward" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_badges" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_badges" ALTER COLUMN "badge_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "dev_score" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "research_score" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "quests" ADD COLUMN "points_reward" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
UPDATE "quests" SET "points_reward" = COALESCE("dev_reward",0) + COALESCE("research_reward",0);--> statement-breakpoint
ALTER TABLE "quests" ADD COLUMN "trigger_type" varchar(50);--> statement-breakpoint
ALTER TABLE "quests" ADD COLUMN "trigger_threshold" integer;--> statement-breakpoint
ALTER TABLE "user_badges" ADD COLUMN "count" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_skills_unique" ON "user_skills" USING btree ("user_id","skill_name");--> statement-breakpoint
CREATE UNIQUE INDEX "user_badges_unique" ON "user_badges" USING btree ("user_id","badge_id");