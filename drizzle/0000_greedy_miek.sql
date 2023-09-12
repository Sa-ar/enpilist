CREATE TABLE IF NOT EXISTS "todo" (
	"id" serial NOT NULL,
	"title" varchar(255),
	"user_id" varchar(255),
	"is_done" boolean
);
