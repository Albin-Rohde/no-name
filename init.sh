export PURPLE="\033[;35m"
export GREEN="\033[;32m"
export RED="\033[;31m"
export BLUE="\033[0;34m"
export NC="\033[0m"

echo $PURPLE
echo -e "$PURPLE==== Copying .env file ====$NC"
cp ./frontend/.env.copy ./frontend.env
cp ./server/.env.copy ./server/.env
echo -e "$GREEN==== Done ====$NC"
echo -e "$PURPLE==== pulling docker images for dev ====$NC"
docker-compose pull
echo -e "$GREEN==== Done ====$NC"
echo -e "$PURPLE==== Installing dependencies locally ====$NC"
cd ./frontend && npm i && cd ../server && npm i && cd ../
npm i -g ts-node typeorm
echo -e "$GREEN====== Done with setup ======$NC"
