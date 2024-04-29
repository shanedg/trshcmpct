#!/bin/sh

# Utility for collecting comma-separated list of project directories.

# This script depends on jq: https://stedolan.github.io/jq/
# On Mac OS X, use Homebrew: `brew install jq`

set -eou pipefail

rush list --json | jq --raw-output '.projects | map(.path) | join(",")'
