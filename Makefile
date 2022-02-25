compose-prod = @docker-compose -f docker-compose.prod.yml
host=http://localhost
PURPLE=\033[;35m
GREEN=\033[;32m
RED=\033[;31m
BLUE=\033[0;34m
NC=\033[0m

all:
	@echo "not implemented"

init:
	@echo -e "$(PURPLE)==== Copying .env files ====$(NC)"
	@cp config/.env.prod .env && cp config/.env.dev ./frontend/.env && cp config/.env.dev ./server/.env
	@echo -e "$(GREEN)==== Done ====$(NC)"
	@echo -e "$(PURPLE)==== pulling docker images for dev ====$(NC)"
	@docker-compose pull
	@echo -e "$(GREEN)==== Done ====$(NC)"
	@echo -e "$(PURPLE)==== Building docker images for dev ====$(BLUE)"
	@docker-compose build frontend server
	@echo -e "$(GREEN)==== Done ====$(NC)"
	@echo -e "$(PURPLE)==== Installing dependencies locally ====$(NC)"
	@cd ./frontend && npm i && cd ../server && npm i && cd ../
	@npm i -g ts-node typeorm
	@echo -e "$(GREEN)====== Done with setup ======$(NC)"

migrate:
	@docker-compose exec server sh -c "npm run migration:run"

dev:
	@docker-compose up -d

stop:
	@docker-compose stop

prod-build:
	@echo "building prod images with $(host) as host url"
	docker build -t ghcr.io/albinr99salt/no-name_frontend:latest \
	--build-arg REACT_APP_API_BASE_URL=$(host)/api \
	--build-arg REACT_APP_SOCKET_BASE_URL=$(host) \
	--build-arg REACT_APP_CLIENT_URL=$(host) \
	-f ./frontend/Dockerfile.prod ./frontend
	docker build -t ghcr.io/albinr99salt/no-name_server:latest -f ./server/Dockerfile.prod ./server

prod-migrate:
	@echo "running migration in prod docker container"
	${compose-prod} exec server sh -c "npm run migration-prod:run"

prod:
	${compose-prod} up -d

prod-stop:
	${compose-prod} stop

