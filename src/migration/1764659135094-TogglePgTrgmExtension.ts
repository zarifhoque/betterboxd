import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnablePgTrgmAndIndexes1764659135094 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pg_trgm"');

    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS "user_name_trgm_idx" ON "user" USING gin (name gin_trgm_ops)',
    );

    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS "story_title_trgm_idx" ON "story" USING gin (title gin_trgm_ops)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX IF EXISTS "user_name_trgm_idx"');
    await queryRunner.query('DROP INDEX IF EXISTS "story_title_trgm_idx"');
  }
}
