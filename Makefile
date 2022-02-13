
all:
	@echo "not implemented"

init:
	@echo "copying .env files"
	@cp config/.env.docker .env && cp config/.env.frontend ./frontend/.env && cp config/.env.server ./server/.env
	@echo "pulling docker images for dev"
	@docker-compose pull
	@echo "building docker images for dev"
	@docker-compose build frontend server
	@echo "installing dependencies locally"
	@cd ./frontend && npm i && cd ../server && npm i && cd ../
	@npm i -g ts-node typeorm
	@echo "pulling docker images for prod"
	@docker-compose -f docker-compose.yml -f docker-compose.prod.yml pull

compose-prod = @docker-compose -f docker-compose.yml -f docker-compose.prod.yml
compose-live = @docker-compose -f docker-compose.yml -f docker-compose.prod.yml -f docker-compose.live.yml


migrate:
	@cd ./server && npm run build && npm run migrate:latest && cd ../

migration:
	@cd ./server && npm run build && npm run typeorm migration:generate -- -n $(name)

dev:
	@docker-compose up -d

dev-stop:
	@docker-compose stop

prod-build:
	${compose-prod} build

prod-up:
	${compose-prod} up -d

prod-stop:
	${compose-prod} stop

prod-migrate:
	${compose-prod} exec server sh -c "npm run migrate:latest"

live-deploy:
	${compose-live} pull frontend server
	${compose-live} up -d frontend server

live-migrate:
	${compose-live} exec server sh -c "npm run migrate:latest"

stop: prod-stop dev-stop
prod: prod-build prod-up prod-migrate
redeploy: live-deploy live-migrate

