#!/bin/bash

DISTFILES=dist/
DOCKER_COMPOSE_FILE=docker-compose.yml
DEFAULT_INSTALL_PATH=/usr/local/dig

TEMP_DIR=$(mktemp -d)
cp bootstrap.sh ${TEMP_DIR}

cat > ${TEMP_DIR}/run.sh <<EOF
#!/bin/bash
./docker-compose up
EOF
chmod +x ${TEMP_DIR}/bootstrap.sh
chmod +x ${TEMP_DIR}/run.sh
cp -r dist/ ${TEMP_DIR}
cp -r conf/ ${TEMP_DIR}
cp docker-compose.yml ${TEMP_DIR}

makeself --notemp ${TEMP_DIR} dig_deploy.sh "Deployment package for DIG" ./bootstrap.sh

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
