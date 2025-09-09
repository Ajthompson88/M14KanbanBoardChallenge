# Docker commands for Kanban project
.PHONY: help build up down logs clean seed restart status

# Default target
help:
	@echo "Available commands:"
	@echo "  build        - Build all Docker images"
	@echo "  up           - Start all services in background"
	@echo "  up-tools     - Start all services including pgAdmin"
	@echo "  down         - Stop all services"
	@echo "  logs         - View logs from all services"
	@echo "  logs-api     - View logs from API service only"
	@echo "  logs-client  - View logs from client service only"
	@echo "  logs-db      - View logs from database service only"
	@echo "  clean        - Remove all containers, images, and volumes"
	@echo "  seed         - Run database seeds"
	@echo "  restart      - Restart all services"
	@echo "  status       - Show status of all services"
	@echo "  shell-api    - Open shell in API container"
	@echo "  shell-client - Open shell in client container"
	@echo "  shell-db     - Open shell in database container"

# Build all images
build:
	docker-compose build --no-cache

# Start services in background
up:
	docker-compose up -d

# Start services including tools (pgAdmin)
up-tools:
	docker-compose --profile tools up -d

# Stop all services
down:
	docker-compose down

# View logs
logs:
	docker-compose logs -f

logs-api:
	docker-compose logs -f api

logs-client:
	docker-compose logs -f client

logs-db:
	docker-compose logs -f postgres

# Clean up everything (use with caution!)
clean:
	docker-compose down -v --rmi all --remove-orphans
	docker system prune -f

# Run database seeds (make sure services are running first)
seed:
	docker-compose exec api npm run seed

# Restart services
restart:
	docker-compose restart

# Show service status
status:
	docker-compose ps

# Open shell in API container
shell-api:
	docker-compose exec api sh

# Open shell in client container
shell-client:
	docker-compose exec client sh

# Open shell in database container
shell-db:
	docker-compose exec postgres psql -U kanban_user -d kanban_db

# Development: rebuild and restart API only
dev-restart-api:
	docker-compose build api
	docker-compose up -d api

# Development: rebuild and restart client only
dev-restart-client:
	docker-compose build client
	docker-compose up -d client