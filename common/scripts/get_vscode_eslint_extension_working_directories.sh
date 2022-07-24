#!/bin/sh

# Utility for collecting package directories to drop into the VSCode
# ESLint extension "eslint.workingDirectories" setting.
# Providing these working directories ensures that ESLint problem highlighting
# in the editor respects .eslintrc.* and .eslintignore.

# This script depends on jq: https://stedolan.github.io/jq/
# On Mac OS X, use Homebrew: `brew install jq`

set -eou pipefail

rush list --json | jq '.projects | { "eslint.workingDirectories": map(.path) }'
