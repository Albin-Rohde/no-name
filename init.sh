export PURPLE="\033[;35m"
export GREEN="\033[;32m"
export RED="\033[;31m"
export BLUE="\033[0;34m"
export NC="\033[0m"

echo $PURPLE
echo -e "$PURPLE==== Copying .env files ====$NC"
cp ./config/.env.prod .env && cp ./config/.env.dev ./frontend/.env && cp ./config/.env.dev ./server/.env
echo -e "$GREEN==== Done ====$NC"
echo -e "$PURPLE==== Generating SSL key's ====$NC"
cd ./nginx
openssl req -config cert.conf -new -x509 -newkey rsa:2048 -nodes -keyout privkey.pem -days 365 -out fullchain.pem
cd ..
echo -e "$GREEN==== Done ====$NC"
echo -e "$PURPLE==== pulling docker images for dev ====$NC"
docker-compose pull
echo -e "$GREEN==== Done ====$NC"
echo -e "$PURPLE==== Building docker images for dev ====$BLUE"
docker-compose build frontend server
echo -e "$GREEN==== Done ====$NC"
echo -e "$PURPLE==== Installing dependencies locally ====$NC"
cd ./frontend && npm i && cd ../server && npm i && cd ../
npm i -g ts-node typeorm
echo -e "$PURPLE==== setting up grafana permissions ====$NC"
echo "Please enter your sudo password"
sudo chown -R $USER ./grafana && chmod -R 777 ./grafana
echo -e "$GREEN====== Done with setup ======$NC"