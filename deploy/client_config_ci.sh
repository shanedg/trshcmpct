#!/bin/bash

# This script creates a config.json file for AWS EC2 client configuration in CI

set -eou pipefail

client_config_file='lib/config.json'

if [ -f "$client_config_file" ]; then
  echo "$client_config_file already exists."
  exit 0
fi

if [ -z "$AWS_ACCESS_KEY_ID" ]; then
  echo 'missing AWS_ACCESS_KEY_ID'
  exit 1
fi

if [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
  echo 'missing AWS_SECRET_ACCESS_KEY'
  exit 1
fi

echo "{
  \"accessKeyId\": \"$AWS_ACCESS_KEY_ID\",
  \"secretAccessKey\": \"$AWS_SECRET_ACCESS_KEY\"
}" > $client_config_file
