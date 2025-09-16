// server/src/seeds/ensure-email.ts
import { DataTypes, QueryTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

export async function ensureEmailColumn() {
  // Is there already an "email" column?
  const exists = await sequelize.query<{ exists: number }>(
    `SELECT 1 AS exists
     FROM information_schema.columns
     WHERE table_schema='public' AND table_name='users' AND column_name='email'
     LIMIT 1;`,
    { type: QueryTypes.SELECT }
  );

  if (exists.length) {
    return; // already there — nothing to do
  }

  const qi = sequelize.getQueryInterface();
  // 1) add it nullable
  await qi.addColumn('users', 'email', { type: DataTypes.STRING, allowNull: true });

  // 2) backfill any rows (in case table already has data)
  await sequelize.query(
    `UPDATE "public"."users"
     SET "email" = CONCAT('user', id, '@local.seed')
     WHERE "email" IS NULL;`
  );

  // 3) enforce NOT NULL + UNIQUE going forward
  await qi.changeColumn('users', 'email', { type: DataTypes.STRING, allowNull: false });

  // add unique constraint if missing
  await sequelize.query(
    `DO $$
     BEGIN
       IF NOT EXISTS (
         SELECT 1
         FROM pg_constraint
         WHERE conname = 'users_email_key'
       ) THEN
         ALTER TABLE "public"."users" ADD CONSTRAINT users_email_key UNIQUE ("email");
       END IF;
     END $$;`
  );

  console.log('🧱 users.email created/backfilled/locked down');
}
