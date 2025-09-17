// src/scripts/patch-ticket-table.ts
import sequelize from '../config/connection.js';      // ⬅ default import
import type { Transaction } from 'sequelize';

async function run() {
  await sequelize.transaction(async (t: Transaction) => {  // ⬅ typed param
    // TODO: your patch logic here, e.g.:
    // await sequelize.query('ALTER TABLE tickets ...', { transaction: t });
  });
  console.log('Patch complete.');
}

run().catch((err) => {
  console.error('Patch failed:', err);
  process.exit(1);
});
