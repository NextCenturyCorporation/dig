#!/bin/bash

DISTFILES=dist/
DOCKER_COMPOSE_FILE=docker-compose.yml
DEFAULT_INSTALL_PATH=/usr/local/dig

TEMP_DIR=$(mktemp -d)

cat > ${TEMP_DIR}/bootstrap.sh <<EOF
#!/bin/bash

read -p "Where should dig be installed? [${DEFAULT_INSTALL_PATH}]: " input
echo "Using '${input:=$DEFAULT_INSTALL_PATH}' as install path for dig"

mkdir -p ${input}
cp -r . ${input}
rm ${input}/bootstrap.sh

cd ${input}
curl -L https://github.com/docker/compose/releases/download/1.1.0/docker-compose-`uname -s`-`uname -m` > docker-compose
chmod +x docker-compose

EOF

cat > ${TEMP_DIR}/run.sh <<EOF
#!/bin/bash
cd dist/
../docker-compose -f ../docker-compose.yml up
EOF
chmod +x ${TEMP_DIR}/bootstrap.sh
chmod +x ${TEMP_DIR}/run.sh
cp -r dist/ ${TEMP_DIR}
cp docker-compose.yml ${TEMP_DIR}

makeself ${TEMP_DIR} dig_deploy.sh "Deployment package for DIG" ./bootstrap.sh

while getopts ":k" opt; do
    case $opt in
	k)
	    echo "Not removing temporary directory: ${TEMP_DIR}"
	    unset RMDIR
	    ;;
	\?)
	    echo "INVALID OPTION: -$OPTARG" >&2
	    ;;
    esac
done
[[ $RMDIR ]] && rm -rf ${TEMP_DIR}
exit 0
