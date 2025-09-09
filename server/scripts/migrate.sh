#!/usr/bin/env sh
set -e
echo "Waiting for DB to be healthy..."
until node -e "require('net').connect({host: process.env.PGHOST||'db', port: process.env.PGPORT||5432}).on('connect',()=>process.exit(0)).on('error',()=>process.exit(1))"; do
  sleep 1
done
echo "Running migrations..."
npx sequelize db:migrate
if [ "$SEED" = "true" ]; then
  echo "Seeding database..."
  npx sequelize db:seed:all
fi
echo "Starting API..."
node dist/server.js
