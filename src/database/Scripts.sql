CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX user_name_trgm_idx ON "user" USING gin (name gin_trgm_ops);
CREATE INDEX story_title_trgm_idx ON "story" USING gin (title gin_trgm_ops);
