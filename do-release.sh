#!/bin/bash
##
## Build a (mostly) clean-room package of the dig project
##
CURRENT_DIR=$(dirname ${BASH_SOURCE[0]})
BUILD_DIR=$(mktemp -d)
CLONE_URL="https://github.com/NextCenturyCorporation/dig.git"



cd ${BUILD_DIR}
git clone ${CLONE_URL}
cd dig
npm install
grunt build
./package.sh
cp dig_deploy.sh ${CURRENT_DIR}
cd ${CURRENT_DIR}
if [[ $UID != 0 ]]; then
    rm -rf ${BUILD_DIR}
fi
