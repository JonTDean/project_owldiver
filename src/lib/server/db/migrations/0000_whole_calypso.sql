CREATE TABLE IF NOT EXISTS "app"."build_votes" (
	"build_id" uuid,
	"user_id" uuid,
	"vote_type" boolean,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "build_votes_build_id_user_id_pk" PRIMARY KEY("build_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "app"."builds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"created_by" uuid,
	"primary_weapon" varchar(255),
	"secondary_weapon" varchar(255),
	"stratagems" text[],
	"upvotes" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "app"."combat_stats" (
	"profile_id" uuid PRIMARY KEY NOT NULL,
	"career_stats" jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "app"."mission_participants" (
	"mission_id" uuid,
	"user_id" uuid,
	"profile_id" uuid,
	"role" varchar(50) DEFAULT 'member',
	"joined_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "mission_participants_mission_id_user_id_pk" PRIMARY KEY("mission_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "app"."missions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"created_by" uuid,
	"status" varchar(50) DEFAULT 'active',
	"difficulty" varchar(50),
	"max_participants" integer,
	"current_participants" integer DEFAULT 0,
	"start_time" timestamp with time zone,
	"end_time" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "app"."profile_rp" (
	"profile_id" uuid PRIMARY KEY NOT NULL,
	"codename" varchar(255),
	"nationality" varchar(255),
	"specialization" varchar(255),
	"motivation" text,
	"service_history" text,
	"psych_profile" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "profile_rp_codename_unique" UNIQUE("codename")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "app"."profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"rank" varchar(50) DEFAULT 'RECRUIT',
	"security_clearance" integer DEFAULT 1,
	"status" varchar(50) DEFAULT 'ACTIVE',
	"thumbnail" varchar(50) DEFAULT '🎖️',
	"steam_id" varchar(255),
	"steam_username" varchar(255),
	"psn_id" varchar(255),
	"discord_id" varchar(255),
	"join_date" timestamp with time zone DEFAULT now(),
	"last_active" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth"."oauth_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_user_id" varchar(255) NOT NULL,
	"provider_username" varchar(255),
	"provider_avatar" text,
	"access_token" text,
	"refresh_token" text,
	"token_type" varchar(255),
	"scope" text,
	"id_token" text,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth"."refresh_tokens" (
	"token" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth"."sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(255) NOT NULL,
	"email" varchar(255),
	"password_hash" varchar(255),
	"avatar" text,
	"role" varchar(50) DEFAULT 'user' NOT NULL,
	"steam_id" varchar(255),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"email_verified" boolean DEFAULT false
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app"."build_votes" ADD CONSTRAINT "build_votes_build_id_builds_id_fk" FOREIGN KEY ("build_id") REFERENCES "app"."builds"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app"."build_votes" ADD CONSTRAINT "build_votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app"."builds" ADD CONSTRAINT "builds_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app"."combat_stats" ADD CONSTRAINT "combat_stats_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "app"."profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app"."mission_participants" ADD CONSTRAINT "mission_participants_mission_id_missions_id_fk" FOREIGN KEY ("mission_id") REFERENCES "app"."missions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app"."mission_participants" ADD CONSTRAINT "mission_participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app"."mission_participants" ADD CONSTRAINT "mission_participants_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "app"."profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app"."missions" ADD CONSTRAINT "missions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app"."profile_rp" ADD CONSTRAINT "profile_rp_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "app"."profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app"."profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth"."oauth_accounts" ADD CONSTRAINT "oauth_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth"."refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth"."sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "provider_user_unique_idx" ON "auth"."oauth_accounts" USING btree ("provider","provider_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_unique" ON "auth"."users" USING btree ("email");