#!/bin/bash
rm bootstrap.sh
curl -L https://github.com/docker/compose/releases/download/1.1.0/docker-compose-`uname -s`-`uname -m` > docker-compose
chmod +x docker-compose
docker-compose build
chmod a+r conf/nginx/.htpasswd
