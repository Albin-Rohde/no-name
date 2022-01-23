#!/bin/bash

docker exec frontend ./deploy.sh & docker exec server ./deploy.sh && docker restart server
