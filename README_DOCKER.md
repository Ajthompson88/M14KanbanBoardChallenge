# Kanban Docker Bundle (Dev + Prod + Render Guide)

## Quick start (dev)
```bash
docker compose -f docker-compose.yml up --build
# Stop
docker compose -f docker-compose.yml down
# Reset DB
docker compose -f docker-compose.yml down -v
# Migrate/seed inside API container
docker compose -f docker-compose.yml exec api npx sequelize db:migrate
docker compose -f docker-compose.yml exec api npx sequelize db:seed:all
```

Visit:
- API: http://localhost:3001
- Web: http://localhost:5173

## Production (local)
```bash
docker compose -f docker-compose.yml build
docker compose -f docker-compose.yml up -d
```

## Render Deployment

**Recommended:**
- **API**: Render *Web Service* (use `server/Dockerfile`), port `3001`.
- **DB**: Render *Managed Postgres*. Use the **Internal DB URL** as `DATABASE_URL`.
- **Client**: Render *Static Site*. Build: `npm ci && npm run build`. Publish directory: `dist`.

### API env on Render
- `NODE_ENV=production`
- `PORT=3001`
- `DATABASE_URL=postgresql://<user>:<pass>@<host>:<port>/<db>` (from Render dashboard; append `?ssl=true` if needed)

If SSL is required, add in Sequelize (runtime):
```js
dialectOptions: {
  ssl: { require: true, rejectUnauthorized: false }
}
```

### Run migrations on Render
Use the service **Shell**:
```
npx sequelize db:migrate
npx sequelize db:seed:all   # optional
```

### Frontend
- `VITE_API_URL=https://<your-api-service>.onrender.com` in Render's environment.
