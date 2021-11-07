## Config for live deployment
- Alter these lines in `.env` located in the root (same directory as this readme).
  ```
  REACT_APP_API_BASE_URL=https://app.yobotics/api
  REACT_APP_SOCKET_BASE_URL=https://app.yobotics
  CLIENT_URL=https://app.yobotics.club
  NGINX_CONF_FILE=nginx.live.conf
  NGINX_STAGE=0
  dns_cloudflare_api_token=<secret cloudlfalre token>
  ```
- Then run `docker-compose up`
  Note. Deploying live like this is only possible from the public ip `81.170.195.205`.
  And the local router must be forwarding port `443` and `80` to the machines local address.
  The `dns_cloudflare_api_token` is needed to retrieve and renew tsl/ssl certificate.

- To set up the ssl certificate run the following command from root
  ```shell
  certbot certonly \
    --dns-cloudflare \
    --dns-cloudflare-credentials .env \
    -d yobotics.club \
    -d www.yobotics.club \
    -d app.yobotics.club
  ```
