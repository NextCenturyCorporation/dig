#!/bin/bash
#set -x
## DEFAULTS

# move up a directory if this script is called from scripts directory
[[ $PWD =~ "scripts"$ ]] && cd ..


DEFAULT_INSTALL_PATH=/usr/local/dig
DEFAULT_CFGDIR=./conf
DOCKER_PREFIX="digmemex/digapp"
NOTIFY_PREFIX="digmemex/notifyapp"
FILES_TO_COPY=(scripts/bootstrap.sh scripts/run.sh scripts/backupdb.sh docker-compose.yml)
EXECUTABLES=(bootstrap.sh run.sh backupdb.sh)

ctrl_c() {
    echo "Caught SIGINT/SIGTERM. Cleaning up"
    exit 99
}
trap ctrl_c SIGINT
trap ctrl_c SIGTERM

# Macs don't have a proper readlink
realpath_Darwin() {
    [[ $1 = /* ]] && echo "$1" || echo "$PWD/${1#./}"
}

realpath_Linux() {
    readlink -f ${1}
}

## FLAGS
RMDIR=1
INTERACTIVE=0
PUSH_TO_DOCKER=0

DISTFILES=dist/
DOCKER_COMPOSE_FILE=docker-compose.yml


TEMP_DIR=$(mktemp -d ${TMPDIR-/tmp}/dig_package.XXXXXXXXXX)
DEST_DIR=${TEMP_DIR}/dig

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
-d Push the digapp image to docker hub
-h This message
EOF
exit 0
}

push_docker() {
    if [[ $PUSH_TO_DOCKER == 1 ]]; then
	echo "Pushing to docker Hub"
	TAG=${DOCKER_PREFIX}:$DIG_VERSION
	NOTIFYTAG=${NOTIFY_PREFIX}:$NOTIFY_VERSION
	pushd dist
	docker build -t $TAG ./
	docker push $TAG
	popd
	pushd distnotify
	docker build -t $NOTIFYTAG ./
	docker push $NOTIFYTAG
	popd
    fi
}

get_options() {
    while getopts ":kic:hd" opt; do
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
	    d)
		#Push to docker-hub
		echo "Pushing to docker-hub..."
		PUSH_TO_DOCKER=1
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
    mkdir -p ${DEST_DIR}

    for file in ${FILES_TO_COPY[*]}
    do
	cp $file ${DEST_DIR}
    done
    for file in ${EXECUTABLES[*]}
    do
	chmod +x ${DEST_DIR}/${file}
    done

#    cp -r dist ${DEST_DIR}
    if [[ ! -d "${CFGDIR}" ]]; then
	echo "Could not find config dir!"
	exit 1
    else
	echo "Found config dir, copying"
    fi
    cp -r ${CFGDIR} ${DEST_DIR}

}

configure_settings() {
    if [[ $INTERACTIVE -eq 1 ]]; then
	echo "Settings have been configured interactively"
	read -e -p "Location of config dir? [$DEFAULT_CFGDIR] " CFGDIR
	CFGDIR=$(realpath_$(uname) ${CFGDIR:-$DEFAULT_CFGDIR})
    else
	CFGDIR=$(realpath_$(uname) ${CFGDIR:-$DEFAULT_CFGDIR})
	echo "Settings will be set using cmdline options"
    fi
    DIG_VERSION=$(cd dist && npm ls 2>/dev/null| sed -n 's/dig@\([^ \t]\+\).*$/\1/p')
    NOTIFY_VERSION=$(cd distnotify && npm ls 2>/dev/null| sed -n 's/notifyapp@\([^ \t]\+\).*$/\1/p')
}

create_package() {
    makeself --notemp ${DEST_DIR} dig_deploy.sh "Deployment package for DIG:${DIG_VERSION}" ./bootstrap.sh
}



welcome() {
cat << EOF
*************
** WARNING **
*************

I am going to run \`grunt build\` to ensure the code is up to date.
If this is not what you want, press Ctrl-c now.

** I will resume in 5 seconds. **
EOF

for ((i=0;i<5;i=i+1))
do
    echo -n "."
    sleep 1s
done
}

build() {
    pushd dist
    grunt build
    popd
}

get_options $@
welcome
configure_settings
build
push_docker
copy_files
create_package
cleanup
