CREATE TABLE "courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"email" text,
	CONSTRAINT "courses_title_unique" UNIQUE("title")
);
