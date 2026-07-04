CREATE TABLE "incubator_join_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"incubator_project_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"message" text,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"responded_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "incubator_suggestions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "incubator_team_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"incubator_project_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" varchar(20) DEFAULT 'dev' NOT NULL,
	"final_score" integer,
	"evaluated_at" timestamp,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mentorship_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mentorship_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "mentorship_category_links" (
	"mentorship_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	CONSTRAINT "mentorship_category_links_mentorship_id_category_id_pk" PRIMARY KEY("mentorship_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "mentorship_participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mentorship_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" varchar(20) DEFAULT 'mentee' NOT NULL,
	"attendance_confirmed" boolean DEFAULT false NOT NULL,
	"evaluation_score" integer,
	"evaluated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "forum_answers" ADD COLUMN "parent_reply_id" uuid;--> statement-breakpoint
ALTER TABLE "incubator_projects" ADD COLUMN "approval_status" varchar(20) DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "mentorship_requests" ADD COLUMN "kind" varchar(20) DEFAULT 'request' NOT NULL;--> statement-breakpoint
ALTER TABLE "mentorship_requests" ADD COLUMN "approval_status" varchar(20) DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "mentorship_requests" ADD COLUMN "syllabus_url" varchar(500);--> statement-breakpoint
ALTER TABLE "mentorship_requests" ADD COLUMN "rating" integer;--> statement-breakpoint
ALTER TABLE "mentorship_requests" ADD COLUMN "rating_comment" text;--> statement-breakpoint
ALTER TABLE "incubator_join_requests" ADD CONSTRAINT "incubator_join_requests_incubator_project_id_incubator_projects_id_fk" FOREIGN KEY ("incubator_project_id") REFERENCES "public"."incubator_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incubator_join_requests" ADD CONSTRAINT "incubator_join_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incubator_suggestions" ADD CONSTRAINT "incubator_suggestions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incubator_team_members" ADD CONSTRAINT "incubator_team_members_incubator_project_id_incubator_projects_id_fk" FOREIGN KEY ("incubator_project_id") REFERENCES "public"."incubator_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incubator_team_members" ADD CONSTRAINT "incubator_team_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentorship_category_links" ADD CONSTRAINT "mentorship_category_links_mentorship_id_mentorship_requests_id_fk" FOREIGN KEY ("mentorship_id") REFERENCES "public"."mentorship_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentorship_category_links" ADD CONSTRAINT "mentorship_category_links_category_id_mentorship_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."mentorship_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentorship_participants" ADD CONSTRAINT "mentorship_participants_mentorship_id_mentorship_requests_id_fk" FOREIGN KEY ("mentorship_id") REFERENCES "public"."mentorship_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentorship_participants" ADD CONSTRAINT "mentorship_participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "incubator_join_requests_unique" ON "incubator_join_requests" USING btree ("incubator_project_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "incubator_team_members_unique" ON "incubator_team_members" USING btree ("incubator_project_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "mentorship_participants_unique" ON "mentorship_participants" USING btree ("mentorship_id","user_id");--> statement-breakpoint
ALTER TABLE "forum_answers" ADD CONSTRAINT "forum_answers_parent_reply_id_forum_answers_id_fk" FOREIGN KEY ("parent_reply_id") REFERENCES "public"."forum_answers"("id") ON DELETE no action ON UPDATE no action;