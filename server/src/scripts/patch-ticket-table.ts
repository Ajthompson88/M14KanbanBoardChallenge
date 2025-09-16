// server/src/scripts/patch-tickets-table.ts
import "dotenv/config";
import { sequelize } from "../config/connection.js";

async function run() {
  await sequelize.transaction(async (t) => {
    // 1) Ensure "name" exists, backfill from old "title" (if present), then set NOT NULL
    await sequelize.query(
      `ALTER TABLE "tickets" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);`,
      { transaction: t }
    );
    await sequelize.query(
      `UPDATE "tickets" SET "name" = COALESCE(CAST("title" AS VARCHAR(255)), 'Untitled')
       WHERE "name" IS NULL;`,
      { transaction: t }
    );
    await sequelize.query(
      `ALTER TABLE "tickets" ALTER COLUMN "name" SET NOT NULL;`,
      { transaction: t }
    );

    // 2) Ensure "description" exists (default empty)
    await sequelize.query(
      `ALTER TABLE "tickets"
       ADD COLUMN IF NOT EXISTS "description" TEXT;`,
      { transaction: t }
    );
    await sequelize.query(
      `UPDATE "tickets" SET "description" = COALESCE("description", '') WHERE "description" IS NULL;`,
      { transaction: t }
    );
    await sequelize.query(
      `ALTER TABLE "tickets" ALTER COLUMN "description" SET NOT NULL;`,
      { transaction: t }
    );

    // 3) Ensure "status" exists and normalize values to your enum
    await sequelize.query(
      `ALTER TABLE "tickets"
       ADD COLUMN IF NOT EXISTS "status" VARCHAR(20);`,
      { transaction: t }
    );
    await sequelize.query(
      `UPDATE "tickets"
       SET "status" = CASE
         WHEN lower(COALESCE("status", 'todo')) = 'todo'  THEN 'Todo'
         WHEN lower("status") = 'doing'                   THEN 'In Progress'
         WHEN lower("status") = 'in progress'             THEN 'In Progress'
         WHEN lower("status") = 'done'                    THEN 'Done'
         ELSE 'Todo'
       END
       WHERE "status" IS NULL
          OR lower("status") NOT IN ('todo','doing','in progress','done');`,
      { transaction: t }
    );
    await sequelize.query(
      `ALTER TABLE "tickets" ALTER COLUMN "status" SET NOT NULL;`,
      { transaction: t }
    );

    // 4) Ensure FK column exists (can be NULL)
    await sequelize.query(
      `ALTER TABLE "tickets"
       ADD COLUMN IF NOT EXISTS "assignedUserId" INTEGER NULL;`,
      { transaction: t }
    );

    // 5) Drop legacy columns if they exist
    await sequelize.query(
      `ALTER TABLE "tickets"
       DROP COLUMN IF EXISTS "title",
       DROP COLUMN IF EXISTS "userId";`,
      { transaction: t }
    );
  });

  console.log("✅ tickets table patched.");
}

run()
  .then(() => sequelize.close())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
