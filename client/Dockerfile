# ---------- Build stage ----------
    FROM node:20-alpine AS builder
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci
    COPY . .
    # Builds to /app/dist
    RUN npm run build
    
    # ---------- Runtime stage (nginx) ----------
    FROM nginx:alpine
    # Copy built static files into nginx's html dir
    COPY --from=builder /app/dist /usr/share/nginx/html
    
    # Generate nginx config: serve SPA, proxy /api to the server container
    RUN printf "server {\n\
      listen 3000;\n\
      server_name localhost;\n\
    \n\
      # Proxy API calls to the backend service defined in docker-compose (service name: server)\n\
      location /api/ {\n\
        proxy_pass http://server:3001/;\n\
        proxy_http_version 1.1;\n\
        proxy_set_header Upgrade \$http_upgrade;\n\
        proxy_set_header Connection 'upgrade';\n\
        proxy_set_header Host \$host;\n\
        proxy_cache_bypass \$http_upgrade;\n\
      }\n\
    \n\
      # Serve the SPA (React + Vite)\n\
      location / {\n\
        root /usr/share/nginx/html;\n\
        try_files \$uri /index.html;\n\
      }\n\
    }\n" > /etc/nginx/conf.d/default.conf
    
    EXPOSE 3000
    CMD ["nginx", "-g", "daemon off;"]
    