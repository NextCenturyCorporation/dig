#!/bin/bash

DISTFILES=dist/
DOCKER_COMPOSE_FILE=docker-compose.yml
DEFAULT_INSTALL_PATH=/usr/local/dig
DEFAULT_CFGDIR=./conf
RMDIR=1
TEMP_DIR=$(mktemp -d)

cleanup() {
    [[ $RMDIR ]] && rm -rf ${TEMP_DIR}
    exit 0
}

get_options() {
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
    # Locate conf dir
    read -e -p "Location of config dir? [$DEFAULT_CFGDIR] " dirloc
    CFGDIR=${dirloc:-$DEFAULT_CFGDIR}    
}

copy_files() {
    cp bootstrap.sh ${TEMP_DIR}
    cat > ${TEMP_DIR}/run.sh <<EOF
#!/bin/bash
./docker-compose up
EOF
    chmod +x ${TEMP_DIR}/bootstrap.sh
    chmod +x ${TEMP_DIR}/run.sh
    cp -r dist/ ${TEMP_DIR}
    if [[ ! -d "${CFGDIR}" ]]; then
	echo "Could not find config dir!"
	exit 1
    else
	echo "Found config dir, copying"
    fi
    cp -r ${CFGDIR} ${TEMP_DIR}
    cp docker-compose.yml ${TEMP_DIR}
}

create_package() {
    makeself --notemp ${TEMP_DIR} dig_deploy.sh "Deployment package for DIG" ./bootstrap.sh
}




get_options
copy_files
create_package
cleanup
