sudo docker run -it --rm --name certbot \
  -v "/etc/letsencrypt:/etc/letsencrypt" \
  -v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
  -v `pwd`/.env:/.env \
  -p 443:443 \
  -p 80:80 \
  certbot/dns-cloudflare certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials "/.env" \
  -d www.fasoner.party \
  -d fasoner.party \
  -d api.fasoner.party \
  -d admin.fasoner.party \
  -d logs.fasoner.party \
  -d grafana.fasoner.party \
  -trustout

sudo chmod 0755 /etc/letsencrypt/{live,archive}