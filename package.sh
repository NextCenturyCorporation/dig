#!/bin/bash
## DEFAULTS
DEFAULT_INSTALL_PATH=/usr/local/dig
DEFAULT_CFGDIR=./conf

FILES_TO_COPY=(bootstrap.sh run.sh scripts/backupdb.sh docker-compose.yml)
EXECUTABLES=(bootstrap.sh run.sh backupdb.sh)

## FLAGS
RMDIR=1
INTERACTIVE=0

DISTFILES=dist/
DOCKER_COMPOSE_FILE=docker-compose.yml
TEMP_DIR=$(mktemp -d /tmp/tmp.XXXXXXXXXX)


cleanup() {
    [[ $RMDIR ]] && rm -rf ${TEMP_DIR}
    exit 0
}

help() {
cat <<EOF
Usage
-i Interactive mode, you will be prompted for configuration values
-c Set the config dir to use
-k Don't delete the temp directory after running
-h This message
EOF
exit 0
}

get_options() {
    while getopts ":kic:h" opt; do
	case $opt in
	    k)
		echo "Not removing temporary directory: ${TEMP_DIR}"
		unset RMDIR
		;;
	    i)
		echo "Runing in Interactive Mode..."
		INTERACTIVE=1
		;;
	    c)
		CFGDIR=$OPTARG
		;;
	    \?)
		echo "INVALID OPTION: -$OPTARG" >&2
		help
		;;
	    h)
		help
		;;
	esac
    done
    # Locate conf dir

}

copy_files() {
    cat > ${TEMP_DIR}/run.sh <<EOF
#!/bin/bash
./docker-compose up -d
EOF

    for file in ${FILES_TO_COPY[*]}
    do
	cp $file ${TEMP_DIR}
    done
    for file in ${EXECUTABLES[*]}
    do
	chmod +x ${TEMP_DIR}/${file}
    done

    cp -r dist ${TEMP_DIR}
    if [[ ! -d "${CFGDIR}" ]]; then
	echo "Could not find config dir!"
	exit 1
    else
	echo "Found config dir, copying"
    fi
    cp -r ${CFGDIR} ${TEMP_DIR}

}

configure_settings() {
    if [[ $INTERACTIVE -eq 1 ]]; then
	echo "Settings have been configured interactively"
	read -e -p "Location of config dir? [$DEFAULT_CFGDIR] " CFGDIR
	CFGDIR=${CFGDIR:-$DEFAULT_CFGDIR}    
    else
	CFGDIR=${CFGDIR:-$DEFAULT_CFGDIR}
	echo "Settings will be set using cmdline options"
    fi
}

create_package() {
    makeself --notemp ${TEMP_DIR} dig_deploy.sh "Deployment package for DIG" ./bootstrap.sh
}

welcome() {
    cat <<EOF
** WARNING **
Make sure that you have rebuilt the project with 'grunt build' before packaging!
If you have not, hit Ctrl-c and rebuild
(continuing in 5s)
EOF
sleep 5s
}

welcome
get_options $@
configure_settings
copy_files
create_package
cleanup
