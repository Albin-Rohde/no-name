compose-prod = @docker-compose -f docker-compose.prod.yml
host=https://api.localhost
server_ip=79.136.83.11

PURPLE=\033[;35m
GREEN=\033[;32m
RED=\033[;31m
BLUE=\033[0;34m
NC=\033[0m

all:
	@echo "not implemented"

init:
	@chmod +x init.sh && ./init.sh

migrate:
	cd ./server && npm run migration:run && cd ..

dev:
	@docker-compose up -d db server frontend redis nginx && make migrate

stop:
	@docker-compose stop

prod-build:
	@echo "building prod images with $(host) as host url"
	make prod-build-frontend
	make prod-build-server

prod-build-frontend:
	docker build --no-cache -t ghcr.io/albinr99salt/no-name_frontend:latest \
	--build-arg REACT_APP_API_BASE_URL=https://api.localhost \
	--build-arg REACT_APP_SOCKET_BASE_URL=https://api.localhost \
	--build-arg REACT_APP_CLIENT_URL=https://localhost \
	-f ./frontend/Dockerfile.prod ./frontend

prod-build-server:
	docker build --no-cache -t ghcr.io/albinr99salt/no-name_server:latest -f ./server/Dockerfile.prod ./server

prod-down:
	${compose-prod} down

prod-migrate:
	@echo "running migration in prod docker container"
	${compose-prod} exec server sh -c "npm run migration-prod:run"

prod:
	${compose-prod} up -d

prod-stop:
	${compose-prod} stop

live-build:
	docker build --no-cache -t ghcr.io/albinr99salt/no-name_frontend:latest \
	--build-arg REACT_APP_API_BASE_URL=https://api.fasoner.party \
	--build-arg REACT_APP_SOCKET_BASE_URL=https://api.fasoner.party \
	--build-arg REACT_APP_CLIENT_URL=https://fasoner.party \
	-f ./frontend/Dockerfile.prod ./frontend
	docker build --no-cache -t ghcr.io/albinr99salt/no-name_server:latest -f ./server/Dockerfile.prod ./server

cert:
	@chmod +x certbot.sh && ./certbot.sh

deploy:
	ssh ubuntu@${server_ip} "cd app/no-name && git pull && cd ./hooks && ./post-receive"
