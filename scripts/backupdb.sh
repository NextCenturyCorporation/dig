#!/bin/bash

############################################################
## Backup the mongodata container data into a tarball
## that can be restored into another mongodata container
## on a new system
############################################################

MODE="backup"
CONTAINER_NAME="mongodata"

usage() {
cat <<EOF
Use this tool to backup or restore the data from the mongodata container.

Ensure that the current working directory has enough space to hold the data.
Options are:
-b backup (default)
-r restore
EOF
}

backup() {
    docker run --volumes-from $CONTAINER_NAME -v `pwd`:/backup ubuntu bash -c "(archive=\"/backup/mongodb_backup_$(date +"%F-%T").tar\";tar cvf \$archive /data/db && gzip \$archive)"
    
    [[ "$?" == 0 ]] && echo "BACKUP COMPLETE" || echo "ERROR!"
}

restore() {
    if [[ ! -f "$TARGET" ]]; then
	echo "Must supply a valid target to restore from"
	exit 98
    fi
    docker run --volumes-from $CONTAINER_NAME -v `pwd`:/backup busybox sh -c "gunzip /backup/${TARGET};tar xvf /backup/${TARGET%%.gz}"
    [[ "$?" == 0 ]] && echo "BACKUP COMPLETE" || echo "ERROR!"
}

parseopts() {
    while getopts ":br:n:" opt; do
	case $opt in
	    n)
		CONTAINER_NAME=$OPTARG
		;;
	    b)
		echo "Backing up the database"
		MODE="backup"
		;;
	    r)
		echo "Restoring the database"
		MODE="restore"
		TARGET=$OPTARG
		;;
	    \?)
		echo "Invalid option -$OPTARG" >&2
		exit 1
		;;
	esac
    done 
}

process() {
    if [[ "$MODE" == "backup" ]]; then
	backup
    elif [[ "$MODE" == "restore" ]]; then
	restore
    else
	echo "UNKNOWN ERROR! MODE=$MODE"
	exit 99
    fi
}

parseopts $@
process

