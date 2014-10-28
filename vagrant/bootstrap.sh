#!/usr/bin/env bash

sudo apt-get update

# sudo apt-get install -y virtualbox-guest-dkms virtualbox-guest-utils virtualbox-guest-x11

curl -sL https://deb.nodesource.com/setup | sudo bash -

sudo apt-get install -y nodejs

sudo npm update -g npm

sudo npm install -g grunt-cli

sudo apt-get install -y mongodb

sudo apt-get install -y git
