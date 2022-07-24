#!/bin/sh

# Utility for collecting comma-separated list of project directories.

# This script depends on jq: https://stedolan.github.io/jq/
# On Mac OS X, use Homebrew: `brew install jq`

set -eou pipefail

rush list --json | jq '.projects | map(.path)' | node --eval '
const fs = require("node:fs");
// STDIN_FILENO = 0
const projects = JSON.parse(fs.readFileSync(0));
console.log(projects.join(","));'
