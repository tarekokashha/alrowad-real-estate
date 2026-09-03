import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum_units_gallery_kind" AS ENUM('real', 'representative');
  CREATE TYPE "public"."enum_units_status" AS ENUM('draft', 'published', 'review', 'sold');
  CREATE TYPE "public"."enum_units_type" AS ENUM('شقة', 'دوبلكس', 'تاون هاوس', 'توين هاوس', 'بنتهاوس', 'فيلا');
  CREATE TYPE "public"."enum_units_sale_type" AS ENUM('أولى', 'إعادة بيع');
  CREATE TYPE "public"."enum_units_finishing" AS ENUM('تشطيب كامل', 'سوبر لوكس', 'نص تشطيب', 'على المحارة');
  CREATE TYPE "public"."enum_units_legal_status" AS ENUM('مسجل بالشهر العقاري', 'حكم صحة ونفاذ', 'عقد ابتدائي موثق', 'عقد ابتدائي عرفي');
  CREATE TYPE "public"."enum_testimonials_register" AS ENUM('colloquial', 'msa');
  CREATE TYPE "public"."enum_leads_state" AS ENUM('new', 'replied', 'viewing', 'contracted', 'closed');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TABLE "units_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"kind" "enum_units_gallery_kind" DEFAULT 'real' NOT NULL,
  	"caption" varchar
  );
  
  CREATE TABLE "units" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"status" "enum_units_status" DEFAULT 'draft' NOT NULL,
  	"featured" boolean,
  	"title" varchar NOT NULL,
  	"area" varchar NOT NULL,
  	"type" "enum_units_type" NOT NULL,
  	"price" numeric NOT NULL,
  	"price_checked_at" timestamp(3) with time zone NOT NULL,
  	"size" numeric NOT NULL,
  	"garden_size" numeric,
  	"floor" varchar,
  	"rooms" numeric NOT NULL,
  	"baths" numeric NOT NULL,
  	"sale_type" "enum_units_sale_type" NOT NULL,
  	"finishing" "enum_units_finishing" NOT NULL,
  	"handover" varchar NOT NULL,
  	"legal_status" "enum_units_legal_status" NOT NULL,
  	"legal_seen_by" varchar NOT NULL,
  	"visited_at" timestamp(3) with time zone NOT NULL,
  	"legal_note" varchar,
  	"max_years" numeric NOT NULL,
  	"min_down_pct" numeric DEFAULT 20,
  	"photos_taken_at" timestamp(3) with time zone,
  	"sold_price" numeric,
  	"contracted_at" timestamp(3) with time zone,
  	"days_listed" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_card_wide_url" varchar,
  	"sizes_card_wide_width" numeric,
  	"sizes_card_wide_height" numeric,
  	"sizes_card_wide_mime_type" varchar,
  	"sizes_card_wide_filesize" numeric,
  	"sizes_card_wide_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"city" varchar NOT NULL,
  	"unit_type" varchar NOT NULL,
  	"date_ar" varchar NOT NULL,
  	"register" "enum_testimonials_register" DEFAULT 'colloquial' NOT NULL,
  	"proof_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "price_index_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"area" varchar NOT NULL,
  	"avg" numeric NOT NULL,
  	"low" numeric NOT NULL,
  	"high" numeric NOT NULL,
  	"sample" numeric NOT NULL,
  	"qoq" varchar
  );
  
  CREATE TABLE "price_index" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"published_at" timestamp(3) with time zone NOT NULL,
  	"sample_listings" numeric NOT NULL,
  	"sample_sales" numeric NOT NULL,
  	"footnote" varchar DEFAULT 'الأرقام بالجنيه المصري للمتر المربع، ولا تشمل مصاريف التسجيل ولا العمولة. المدى يمثّل أدنى وأعلى عرض داخل العيّنة نفسها.',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"phone" varchar NOT NULL,
  	"unit_code" varchar,
  	"best_time" varchar,
  	"state" "enum_leads_state" DEFAULT 'new',
  	"note" varchar,
  	"source" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"units_id" integer,
  	"media_id" integer,
  	"testimonials_id" integer,
  	"price_index_id" integer,
  	"leads_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"phone_local" varchar DEFAULT '010 9809 8026' NOT NULL,
  	"phone_intl" varchar DEFAULT '+20 10 9809 8026' NOT NULL,
  	"address" varchar DEFAULT 'حدائق أكتوبر، الجيزة، مصر' NOT NULL,
  	"office_hours" varchar DEFAULT 'السبت – الخميس 10:00 – 20:00' NOT NULL,
  	"reply_time" varchar DEFAULT 'متوسط الرد ١٤ دقيقة',
  	"commercial_registry" varchar NOT NULL,
  	"registry_office" varchar,
  	"tax_card" varchar NOT NULL,
  	"brokerage_registration" varchar NOT NULL,
  	"brokerage_decree" varchar DEFAULT 'القرار الوزاري ٥٧٨/٢٠٢٥',
  	"registered_at" varchar,
  	"units_visited" numeric,
  	"units_declined" numeric,
  	"units_listed" numeric,
  	"contracts_this_year" numeric,
  	"total_sold" numeric,
  	"numbers_checked_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "units_gallery" ADD CONSTRAINT "units_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "units_gallery" ADD CONSTRAINT "units_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "price_index_rows" ADD CONSTRAINT "price_index_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."price_index"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_units_fk" FOREIGN KEY ("units_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_price_index_fk" FOREIGN KEY ("price_index_id") REFERENCES "public"."price_index"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "units_gallery_order_idx" ON "units_gallery" USING btree ("_order");
  CREATE INDEX "units_gallery_parent_id_idx" ON "units_gallery" USING btree ("_parent_id");
  CREATE INDEX "units_gallery_image_idx" ON "units_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "units_code_idx" ON "units" USING btree ("code");
  CREATE INDEX "units_updated_at_idx" ON "units" USING btree ("updated_at");
  CREATE INDEX "units_created_at_idx" ON "units" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_card_wide_sizes_card_wide_filename_idx" ON "media" USING btree ("sizes_card_wide_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "price_index_rows_order_idx" ON "price_index_rows" USING btree ("_order");
  CREATE INDEX "price_index_rows_parent_id_idx" ON "price_index_rows" USING btree ("_parent_id");
  CREATE INDEX "price_index_updated_at_idx" ON "price_index" USING btree ("updated_at");
  CREATE INDEX "price_index_created_at_idx" ON "price_index" USING btree ("created_at");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_units_id_idx" ON "payload_locked_documents_rels" USING btree ("units_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_price_index_id_idx" ON "payload_locked_documents_rels" USING btree ("price_index_id");
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "units_gallery" CASCADE;
  DROP TABLE "units" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "price_index_rows" CASCADE;
  DROP TABLE "price_index" CASCADE;
  DROP TABLE "leads" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "settings" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_units_gallery_kind";
  DROP TYPE "public"."enum_units_status";
  DROP TYPE "public"."enum_units_type";
  DROP TYPE "public"."enum_units_sale_type";
  DROP TYPE "public"."enum_units_finishing";
  DROP TYPE "public"."enum_units_legal_status";
  DROP TYPE "public"."enum_testimonials_register";
  DROP TYPE "public"."enum_leads_state";
  DROP TYPE "public"."enum_users_role";`)
}
