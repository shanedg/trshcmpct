# @trshcmpctr/discord

## Configure

Create a new file named `lib/config.json`.
You can use `lib/config.example.json` as a template.

```sh
cp lib/config.example.json lib/config.json
```

Populate `clientId` and `clientSecret` with the values from the Discord app's OAuth2 menu.

## Run

```sh
npm start
```

## FIX

```sh
==[ FAILURE: 1 operation ]=====================================================

--[ FAILURE: @trshcmpctr/discord ]---------------------------[ 0.24 seconds ]--

file:///drone/trshcmpctr/common/temp/node_modules/.pnpm/ava@4.2.0/node_modules/pkg-conf/index.js:2
import {findUp, findUpSync} from 'find-up';
        ^^^^^^
SyntaxError: Named export 'findUp' not found. The requested module 'find-up' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

Operations failed.

import pkg from 'find-up';
const {findUp, findUpSync} = pkg;

    at ModuleJob._instantiate (node:internal/modules/esm/module_job:127:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:193:5)
    at async Promise.all (index 0)
    at async ESMLoader.import (node:internal/modules/esm/loader:337:24)
    at async loadESM (node:internal/process/esm_loader:88:5)
    at async handleMainPromise (node:internal/modules/run_main:61:12)


rush test:ava (0.28 seconds)
```

```sh
$ fd -HI -t d find-up ~/dev/trshcmpctr/common/temp
./node_modules/.pnpm/find-up@3.0.0
./node_modules/.pnpm/find-up@5.0.0
./node_modules/.pnpm/find-up@6.0.0
./node_modules/.pnpm/find-up@6.0.0/node_modules/find-up
./node_modules/.pnpm/find-up@5.0.0/node_modules/find-up
./node_modules/.pnpm/find-up@3.0.0/node_modules/find-up
./node_modules/.pnpm/find-up@4.1.0
./node_modules/.pnpm/find-up@4.1.0/node_modules/find-up
./node_modules/.pnpm/find-up@2.1.0
./node_modules/.pnpm/find-up@2.1.0/node_modules/find-up
```

UPDATE:
Ok so turns out there was some kind of regression in Node 16.14.x impacting `--experimental-specifier-resolution=node`.
This is fixed in latest releases of Node 17/18.
We may see it resolved in the next release of the Node 16 line.
