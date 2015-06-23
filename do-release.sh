#!/bin/bash
#set -x
##
## Build a (mostly) clean-room package of the dig project
##

# Macs don't have a proper readlink
realpath_Darwin() {
    [[ $1 = /* ]] && echo "$1" || echo "$PWD/${1#./}"
}

realpath_Linux() {
    readlink -f ${1}
}

#call the proper version based on your kernel type
CURRENT_DIR=$(realpath_$(uname) $(dirname ${BASH_SOURCE[0]}) )

BUILD_DIR=$(mktemp -d ${TMPDIR-/tmp}/dig_release.XXXXXXXX)
CLONE_URL="https://github.com/NextCenturyCorporation/dig.git"
BUMP_VER=dev
PUSH_REQUIRED=0
GIT_PUSH_OPTS=""
DRY_RUN=0

backup() {
    #backup some values so we can rollback if necessary
    GIT_CURRENT="$(git rev-parse @)"
}

rollback() {
    echo "** Rolling back because something failed **"
    cd ${CURRENT_DIR}
    echo "Deleting git tag: ${GIT_TAG}"
    git tag -d ${GIT_TAG}
    echo "Rolling back to commit: ${GIT_CURRENT}"
    git reset ${GIT_CURRENT}
    echo "Resetting changes made by npm version"
    git checkout package.json npm-shrinkwrap.json
    echo "Complete!"
}

cleanup() {
    exitval=$1
    if [[ $exitval -gt 0 ]]; then
	echo "Error occured: $exitval"
	rollback
    fi
    exit $exitval
}

ctrl_c() {
    echo "Caught SIGINT/SIGTERM. Cleaning up"
    cleanup 99
}

help() {
    cat <<EOF
Usage
These options push to docker hub and are for release builds.
You can select only one of the options at a time. If you select more than one, only the last one will be honored.
The versions are tagged in git
-M Bump the major version and build
-m Bump the minor version and build
-p Bump the patch version and build
-a Premajor
-i Preminor
-t Prepatch

Passing no parameters performs a development build in which the prerelease version is bumped.
All builds after a pre{major,minor,patch} build has been launched, until the release is finalized (major,minor,patch} should be pre-release builds.
do-release will tag the commit in git with the current version number.

-d will trigger a dry-run in which changes will not be persisted to git or docker-hub

-u force a development build to push the resulting image to docker hub
EOF
cleanup 0
}

get_options() {
    
    while getopts ":Mmpuc:aitd" opt; do
	case $opt in
	    M)
		BUMP_VER=maj
		;;
	    m)
		BUMP_VER=min
		;;
	    p)
		BUMP_VER=patch
		;;
	    a)
		BUMP_VER=pmajor
		;;
	    i)
		BUMP_VER=pminor
		;;
	    t)
		BUMP_VER=ppatch
		;;
	    u)
		echo "Forcing a push to docker-hub"
		FORCE_PUSH_TO_DOCKER=1
		;;
	    d)
		GIT_PUSH_OPTS="--dry-run"
		DRY_RUN=1	
		echo "*************************"
		echo "* PERFORMING A DRY-RUN! *"
		echo "*************************"
		sleep 1s
		;;
	    \?)
		echo "INVALID OPTION: -$OPTARG" >&2
		help
		;;
	    h)
		help
		;;
	    c)
		CONFDIR=$OPTARG
		echo "Using ${CONFDIR} as config dir"
		;;
	esac
    done
}

push_new_version() {
    git remote update origin
    if [[ $(git log HEAD..origin/master --oneline | wc -l) -gt 0 ]]; then
	echo "You need to fetch/merge before using do-release"
	cleanup 6
    fi
    git push ${GIT_PUSH_OPTS} origin master
    git push ${GIT_PUSH_OPTS} origin ${GIT_TAG}

}

sanity_check() {
    #Ensure we are on the master branch
    if [[ "$(git rev-parse --abbrev-ref HEAD)" != "master" ]]; then
	echo "You must be on the master branch to create a release"
	cleanup 3
    fi

    #Ehsure the working directory is clean
    if [[ ! -z "$(git status --porcelain --untracked-files=no)" ]]; then
	echo "Working directory is not clean!"
	echo "Please commit or stash your code before running do-release"
	cleanup 1
    fi
    
    #Ensure that we are using npm v2 or greater
    if [[ -z "$(npm -v | sed -n '/^2/p')" ]]; then
	echo "You have a version of npm that is too old!"
	cleanup 4
    fi

    #Ensure we have makeself available
    command -v makeself >/dev/null 2>&1 || {
	echo "You do not have makeself installed. Cannot continue."
	cleanup 10
    }
    
    if [[ -z "${CONFDIR}" ]]; then
	echo "You did not set the config directory with -c"
	cleanup 20
    fi

}

version() {
    GIT_TAG=""
    if [[ "$BUMP_VER" == "maj" ]]; then
	GIT_TAG=$(npm version major)
	PUSH_TO_DOCKER=1
    elif [[ "$BUMP_VER" == "min" ]]; then
	GIT_TAG=$(npm version minor)
	PUSH_TO_DOCKER=1
    elif [[ "$BUMP_VER" == "patch" ]]; then
	PUSH_TO_DOCKER=1
	GIT_TAG=$(npm version patch)
    elif [[ "$BUMP_VER" == "pmajor" ]]; then
	PUSH_TO_DOCKER=0
	GIT_TAG=$(npm version premajor)
    elif [[ "$BUMP_VER" == "pminor" ]]; then
	PUSH_TO_DOCKER=0
	GIT_TAG=$(npm version preminor)
    elif [[ "$BUMP_VER" == "ppatch" ]]; then
	PUSH_TO_DOCKER=0
	GIT_TAG=$(npm version prepatch)
    else
	PUSH_TO_DOCKER=0
	GIT_TAG=$(npm version prerelease)
    fi
    
    if [[ "$?" != 0 ]]; then
	echo "Stale tag exists that needs to be removed"
        cleanup 30
    fi
    
    if [[ "$FORCE_PUSH_TO_DOCKER" -eq 1 ]]; then
	PUSH_TO_DOCKER=1
    fi

    if [[ "$DRY_RUN" -eq 1 ]]; then
	PUSH_TO_DOCKER=0
    fi

    if [[ $? != 0 ]]; then
	echo "There was an error with npm version, cannot continue"
	rollback
	cleanup 2
    fi
}

build() {
    if [[ "$PUSH_TO_DOCKER" -eq 1 ]]; then
	package_opts="-d"
    fi
    cd ${BUILD_DIR}
    git clone ${CURRENT_DIR} dig
    cd dig
    cp -r ${CONFDIR} conf
    npm install
    grunt build
    ${BUILD_DIR}/dig/scripts/package.sh $package_opts
    cp dig_deploy.sh ${CURRENT_DIR}
    cd ${CURRENT_DIR}
    if [[ $UID != 0 ]]; then
	echo "Deleting temporary build directory"
	rm -rf ${BUILD_DIR}
    fi
}


trap ctrl_c SIGINT
trap ctrl_c SIGTERM


backup
get_options $@
sanity_check
version
build
if [[ "$DRY_RUN" -eq 1 ]]; then
    echo -e "DRY RUN COMPLETE\nNot pushing changes"
    rollback
else
    push_new_version
fi     
