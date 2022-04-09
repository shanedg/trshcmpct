#!/bin/bash

# This script creates a config.json file for Discord client configuration in CI.

set -eou pipefail

client_config_file='lib/config.json'

if [ -f "$client_config_file" ]; then
  echo "$client_config_file already exists."
  exit 0
fi

if [ -z "$DISCORD_CLIENT_ID" ]; then
  echo 'missing DISCORD_CLIENT_ID'
  exit 1
fi

if [ -z "$DISCORD_CLIENT_SECRET" ]; then
  echo 'missing DISCORD_CLIENT_SECRET'
  exit 1
fi

if [ -z "$DISCORD_GUILD_ID" ]; then
  echo 'missing DISCORD_GUILD_ID'
  exit 1
fi

if [ -z "$DISCORD_SESSION_SECRET" ]; then
  echo 'missing SESSION_SECRET'
  exit 1
fi

echo "{
  \"clientId\": \"$DISCORD_CLIENT_ID\",
  \"clientSecret\": \"$DISCORD_CLIENT_SECRET\",
  \"guildId\": \"$DISCORD_GUILD_ID\",
  \"port\": 53134,
  \"sessionSecret\": \"$DISCORD_SESSION_SECRET\"
}" > $client_config_file
