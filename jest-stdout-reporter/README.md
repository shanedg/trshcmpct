# @trshcmpctr/jest-stdout-reporter

Prevent Jest from logging normal output to stderr.

By default, Jest writes all output to stderr ([facebook/jest#5064](https://github.com/facebook/jest/issues/5064)).
This custom reporter wraps the default Jest reporter and
redirects "normal" logging output from stderr to stdout.

This is useful for avoiding non-zero exit codes from [custom commands](https://rushjs.io/pages/configs/command-line_json/) that succeed with warnings:

```sh
Operations succeeded with warnings.
# (exit code: 1)
```

Original solution (not mine) found [here](https://github.com/microsoft/fluentui/blob/28ceaaa83cd92a0389c466f0b15b283e3d9b08e4/scripts/jest/jest-reporter.js).
Another option available in [jest-standard-reporter](https://github.com/chrisgalvan/jest-standard-reporter).
Other interesting reporters: [jest-community/awesome-jest#reporters](https://github.com/jest-community/awesome-jest/blob/main/README.md#reporters)

## Installation

```sh
npm install @trshcmpctr/jest-stdout-reporter --save-dev

# Or in a Rush package:
# rush add -p @trshcmpctr/jest-stdout-reporter --dev
```

## Usage

```sh
jest --reporters=@trshcmpctr/jest-stdout-reporter

# Or via `jest.reporters` in package.json:
# "jest": {
#   "reporters": ["@trshcmpctr/jest-stdout-reporter"]
# }

# Or via the `reporters` property in jest.config.js:
# reporters: ['@trshcmpctr/jest-stdout-reporter']
```
