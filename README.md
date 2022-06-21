# trshcmpctr

[![Build Status](https://cloud.drone.io/api/badges/shanedg/trshcmpctr/status.svg)](https://cloud.drone.io/shanedg/trshcmpctr)

all build config, no substance

This repository is managed by [Rush](https://rushjs.io/pages/developer/new_developer/).

```sh
npm i -g @microsoft/rush
```

Install all project dependencies.

```sh
rush install
```

Build all projects.

```sh
rush build
```

Lint JS in all projects.

```sh
rush lint
```

Lint Markdown in all projects.

```sh
rush lint:md
```

Run all project tests.

```sh
rush test
```

Scaffold a new JS project.

```sh
rush scaffold
```

## TODO

* eslint plugins missing from scaffolded package.json dev deps
(never mind that they work anyway,
that's gotta just be a weird module resolution quirk of eslint)
* add tests for:
  * @trshcmpctr/jest-stdout-reporter
  * @trshcmpctr/markdownlint-config
  * @trshcmpctr/scaffold
* build cache things
* changelog generation

## FIXME:

Upgrading to pnpm@7 breaks rush-commitlint autoinstaller but apparently not rush-plop (used in `rush scaffold` command).

```sh
❯ rush commitlint


Rush Multi-Project Build Tool 5.63.1 - https://rushjs.io
Node.js version is 16.15.1 (LTS)


Starting "rush commitlint"

Trying to acquire lock for pnpm-7.3.0
Acquired lock for pnpm-7.3.0
Found pnpm version 7.3.0 in /Users/shanegarrity/.rush/node-v16.15.1/pnpm-7.3.0

Symlinking "/Users/shanegarrity/dev/trshcmpctr/common/temp/pnpm-local"
  --> "/Users/shanegarrity/.rush/node-v16.15.1/pnpm-7.3.0"
Acquiring lock for "common/autoinstallers/rush-commitlint" folder...
Deleting old files from /Users/shanegarrity/dev/trshcmpctr/common/autoinstallers/rush-commitlint/node_modules
Transforming /Users/shanegarrity/dev/trshcmpctr/common/config/rush/.npmrc
  --> "/Users/shanegarrity/dev/trshcmpctr/common/autoinstallers/rush-commitlint/.npmrc"
Installing dependencies under /Users/shanegarrity/dev/trshcmpctr/common/autoinstallers/rush-commitlint...

Lockfile is up-to-date, resolution step is skipped
Packages: +187
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Packages are hard linked from the content-addressable store to the virtual store.
  Content-addressable store is at: /Users/shanegarrity/Library/pnpm/store/v3
  Virtual store is at:             node_modules/.pnpm
Progress: resolved 187, reused 187, downloaded 0, added 187, done

dependencies:
+ @commitlint/cli 16.3.0
+ @commitlint/config-conventional 16.2.4
+ @types/node 16.11.35
Auto install completed successfully

Error: Cannot find module "@commitlint/config-conventional" from "/Users/shanegarrity/dev/trshcmpctr"
    at resolveId (/Users/shanegarrity/dev/trshcmpctr/common/autoinstallers/rush-commitlint/node_modules/.pnpm/@commitlint+resolve-extends@16.2.1/node_modules/@commitlint/resolve-extends/src/index.ts:131:14)
    at resolveConfig (/Users/shanegarrity/dev/trshcmpctr/common/autoinstallers/rush-commitlint/node_modules/.pnpm/@commitlint+resolve-extends@16.2.1/node_modules/@commitlint/resolve-extends/src/index.ts:105:20)
    at /Users/shanegarrity/dev/trshcmpctr/common/autoinstallers/rush-commitlint/node_modules/.pnpm/@commitlint+resolve-extends@16.2.1/node_modules/@commitlint/resolve-extends/src/index.ts:51:20
    at Array.reduce (<anonymous>)
    at loadExtends (/Users/shanegarrity/dev/trshcmpctr/common/autoinstallers/rush-commitlint/node_modules/.pnpm/@commitlint+resolve-extends@16.2.1/node_modules/@commitlint/resolve-extends/src/index.ts:49:13)
    at resolveExtends (/Users/shanegarrity/dev/trshcmpctr/common/autoinstallers/rush-commitlint/node_modules/.pnpm/@commitlint+resolve-extends@16.2.1/node_modules/@commitlint/resolve-extends/src/index.ts:25:19)
    at load (/Users/shanegarrity/dev/trshcmpctr/common/autoinstallers/rush-commitlint/node_modules/.pnpm/@commitlint+load@16.3.0/node_modules/@commitlint/load/src/load.ts:56:33)
    at async main (/Users/shanegarrity/dev/trshcmpctr/common/autoinstallers/rush-commitlint/node_modules/.pnpm/@commitlint+cli@16.3.0/node_modules/@commitlint/cli/src/cli.ts:199:17) {
  code: 'MODULE_NOT_FOUND'
}

The script failed with exit code 1
```
