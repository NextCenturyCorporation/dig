#!/bin/bash
TMPDIR=$(pwd)
echo "LOCATION OF TEMP DIR: ${TMPDIR}"
mkdir ../dig
cp -r * ../dig
cd ../dig
rm bootstrap.sh
curl -L https://github.com/docker/compose/releases/download/1.1.0/docker-compose-`uname -s`-`uname -m` > docker-compose
chmod +x docker-compose
if [[ $UID != 0 ]]; then
    rm -rf ${TMPDIR}
else
    echo "As you are root, I will not blindly remove the temp dir:\n${TMPDIR}"
fi
