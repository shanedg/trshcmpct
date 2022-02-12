# @trshcmpctr/jest-stdout-reporter

Prevent Jest from logging normal output to stderr.

By default, Jest [writes all output to stderr](https://github.com/microsoft/just/issues/28#issue-412703134).
This custom reporter wraps the default Jest reporter and
redirects "normal" logging output from stderr to stdout.

This is useful for avoiding misleading "succeeded with warnings" messages in [Rush](https://rushjs.io/) output.

Original solution (not mine) found [here](https://github.com/microsoft/fluentui/blob/28ceaaa83cd92a0389c466f0b15b283e3d9b08e4/scripts/jest/jest-reporter.js).

## Installation

```sh
npm install @trshcmpctr/jest-stdout-reporter --save-dev

# Or in a Rush package:
# rush add -p @trshcmpctr/jest-stdout-reporter --dev
```

## Usage

```sh
jest --reporters=@trshcmpctr/jest-stdout-reporter
```
