# Database Workflow – Kanban Board

This document describes how to safely update the database schema and seed data for this project.  
Use this process in **development, staging, and production** to keep everything consistent.

---

## 🔑 Prerequisites
- `.env` file contains a valid `DATABASE_URL` with `?sslmode=require`
- `server/config/config.cjs` exists and contains:
  ```js
  require('dotenv').config();

  module.exports = {
    development: {
      use_env_variable: 'DATABASE_URL',
      dialect: 'postgres',
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false },
      },
    },
    test: { /* same as above */ },
    production: { /* same as above */ },
  };


    ```
        js
        const path = require('path');
        module.exports = {
        'config': path.resolve('config', 'config.cjs'),
        'migrations-path': path.resolve('migrations'),
        'seeders-path': path.resolve('seeders'),
        'models-path': path.resolve('models'),
        };
    
  
## 🛠 Making Schema Changes

1. Generate a migration:
``` bash
    npx sequelize-cli migration:generate --name <short-description>
```

- Example: add-name-to-tickets

2. Edit the migration file:

   - Use .cjs extension for CommonJS projects (works even with "type": "module").

   - Use addColumn, changeColumn, or renameColumn as needed.

   - Backfill data before setting allowNull: false to avoid runtime errors.

3. Run the migration:
```bash
    npx sequelize-cli db:migrate
```

- (With --config config/config.cjs if .sequelizerc not present.)

4. Verify the schema:

    - Use pgAdmin or SELECT * FROM ... to confirm the column(s) exist.


## 🌱 Seeding Data
Create / Edit Seeders

Seeder files live in server/seeders/.
Use .cjs and do not call sequelize.sync() in seeders.

Example seeder:
```js
'use strict';

module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('tickets', [
      { name: 'First Ticket', status: 'open', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Second Ticket', status: 'open', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },
  async down (queryInterface) {
    await queryInterface.bulkDelete('tickets', {
      name: ['First Ticket', 'Second Ticket'],
    });
  }
};
```

## Run Seeds

```bash
npm run seed


(or npx sequelize-cli db:seed:all if using CLI seeders)

Undo Seeds (Optional)

Undo last seeder:

npx sequelize-cli db:seed:undo


Undo all:

npx sequelize-cli db:seed:undo:all
```

## 🧪 Verification Checklist

 - Migration ran successfully (db:migrate reports "migrated").

 - Columns exist in pgAdmin.

 - Seed script ran successfully and shows ✅ output.

 - New rows visible in pgAdmin with correct data.

## 🚫 Things Not to Do

  - Don’t call sequelize.sync() in production code or seed files.

  - Don’t run sync({ force: true }) outside of local development — it drops tables!

  - Don’t hardcode passwords/emails in migrations (use .env for sensitive data).

## 🔄 Typical Full Reset (Development Only)

If you need a clean slate locally:
```bash
    npx sequelize-cli db:migrate:undo:all
    npx sequelize-cli db:migrate
    npm run seed
```

- This rebuilds schema + data from scratch.
```pqsql

This gives you a nice “recipe card” you (or teammates) can follow every time — no more digging through CLI docs or guessing flags.  

Want me to add a **section on how to connect with pgAdmin** (host, port, SSL settings) so you never have to remember that part either?
```