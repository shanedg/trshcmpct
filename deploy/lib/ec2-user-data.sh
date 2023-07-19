#!/usr/bin/env bash

# Bash "strict mode"
set -euo pipefail

echo "start user data"

yum update -y

mkdir /trshcmpctr
mkdir /trshcmpctr/node
curl https://nodejs.org/dist/v18.16.1/node-v18.16.1-linux-x64.tar.xz --output /trshcmpctr/node/node-v18.16.1-linux-x64.tar.xz
(cd /trshcmpctr/node && tar -xf node-v18.16.1-linux-x64.tar.xz)
sudo chown -R ec2-user:ec2-user /trshcmpctr/node/node-v18.16.1-linux-x64

# We want this to output $PATH without expansion
# shellcheck disable=SC2016
echo PATH="/trshcmpctr/node/node-v18.16.1-linux-x64/bin":'$PATH' >> /home/ec2-user/.bashrc
# shellcheck source=/dev/null
. /home/ec2-user/.bashrc

node -v

mkdir /trshcmpctr/build
# TODO: fetch and unzip build artifact
time aws s3 cp s3://trshcmpctr.com/build-artifacts/deploy.zip /trshcmpctr/build/deploy.zip
time unzip -o /trshcmpctr/build/deploy.zip -d /trshcmpctr/

echo "end user data"

# Debugging, connect and run:
# sudo tail -f /var/log/cloud-init-output.log
