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

## Dependency Quirks

Dependency `extend` is an unspecified, transitive dependency of [tch-nedb-session](https://github.com/tomaschyly/NeDBSession/blob/9bab383f5c7caf6fb63e3cdd528fe92f6cbb223f/index.js#L2)

As an aside, not sure that this express session library was ever intended for production use

## Cypress Troubleshooting

> Reverse chronological order of appearance

### Running against node 16.14.2

```sh
❯ npm start

> @trshcmpctr/discord@1.0.0 start
> node --experimental-specifier-resolution=node lib/index.js

node:internal/errors:464
    ErrorCaptureStackTrace(err);
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'data-uri-to-buffer' imported from /Users/shanegarrity/dev/trshcmpctr/discord/node_modules/node-fetch/src/index.js
    at new NodeError (node:internal/errors:371:5)
    at packageResolve (node:internal/modules/esm/resolve:932:9)
    at moduleResolve (node:internal/modules/esm/resolve:978:18)
    at defaultResolve (node:internal/modules/esm/resolve:1080:11)
    at ESMLoader.resolve (node:internal/modules/esm/loader:530:30)
    at ESMLoader.getModuleJob (node:internal/modules/esm/loader:251:18)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:79:40)
    at link (node:internal/modules/esm/module_job:78:36) {
  code: 'ERR_MODULE_NOT_FOUND'
}
```

[nodejs/node#42116](https://github.com/nodejs/node/issues/42116) is similar.
Points to a [symlinking issue](https://github.com/nodejs/node/issues/42195) introduced in 17.6.0 and backported in 16.14.x (?).
Fix in [nodejs/node#xxx](https://github.com/nodejs/node/pull/42197) not backported to v16 until 16.15.0.

Realizing that this is exactly what I was working around when I pinned the Drone images to 16.13.2.
With `node:gallium`, everything broke on the next run of the pipeline after 16.14.0 was released as `latest`.

The most current published Cypress image runs node 16.14.2.
The next minor version available is only 16.5.0
(see <https://github.com/cypress-io/cypress-docker-images/tree/master/included#cypressincluded>).

There's probably no way to work around this unless I build my own image.

### Actually starting the server in Drone

Discord server is failing to start and `test:cypress` step is then running until timeout.
This isn't what I thought at first glance: `ERR_IMPORT_ASSERTION_TYPE_FAILED`.

Tried `npm start` with the same node version as the Cypress image, v16.14.2
(see <https://github.com/cypress-io/cypress-docker-images/tree/master/included>)
and got the same error locally.
This is a problem with type assertion support in that version.
Either need to downgrade to 16.14.2 generally or build my own Cypress image :upside-down-smile:.

```sh
==[ @trshcmpctr/discord ]=========================================[ 9 of 10 ]==

Invoking: node --experimental-specifier-resolution=node lib/index.js & wait-on http://localhost:53134 && npm run cy:run 
node:internal/errors:464
    ErrorCaptureStackTrace(err);
    ^

TypeError [ERR_IMPORT_ASSERTION_TYPE_FAILED]: Module "file:///drone/trshcmpctr/discord/lib/config.json" is not of type "json"
    at new NodeError (node:internal/errors:371:5)
    at handleInvalidType (node:internal/modules/esm/assert:103:9)
    at validateAssertions (node:internal/modules/esm/assert:71:14)
    at defaultLoad (node:internal/modules/esm/load:24:3)
    at ESMLoader.load (node:internal/modules/esm/loader:359:26)
    at ESMLoader.moduleProvider (node:internal/modules/esm/loader:280:58)
    at new ModuleJob (node:internal/modules/esm/module_job:66:26)
    at ESMLoader.#createModuleJob (node:internal/modules/esm/loader:297:17)
    at ESMLoader.getModuleJob (node:internal/modules/esm/loader:261:34)
    at async ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:81:21) {
  code: 'ERR_IMPORT_ASSERTION_TYPE_FAILED'
}
```

### Running in Drone

Below error message mentioned in [cypress-io/cypress-docker-images#686](https://github.com/cypress-io/cypress-docker-images/issues/686)
though not necessarily related to a read-only project directory.
Cypress runs do succeed but these warnings are scary.

```sh
libva error: vaGetDriverNameByIndex() failed with unknown libva error, driver_name = (null)
[290:0627/023407.514203:ERROR:sandbox_linux.cc(377)] InitializeSandbox() called with multiple threads in process gpu-process.
[290:0627/023407.517340:ERROR:gpu_memory_buffer_support_x11.cc(44)] dri3 extension not supported.
```

### ReferenceError: Your configFile is invalid

Cypress initially generated .ts versions of configFile and cypress/support files
but they didn't work until I renamed them to .js.

>ReferenceError
Your configFile is invalid: /Users/shanegarrity/dev/trshcmpctr/discord/cypress.config.ts
It threw an error when required, check the stack trace below:

```sh
ReferenceError: exports is not defined in ES module scope
    at file:///Users/shanegarrity/dev/trshcmpctr/discord/cypress.config.ts:2:23
    at ModuleJob.run (node:internal/modules/esm/module_job:198:25)
    at async Promise.all (index 0)
    at async ESMLoader.import (node:internal/modules/esm/loader:385:24)
    at async importModuleDynamicallyWrapper (node:internal/vm/module:437:15)
    at async loadFile (/Users/shanegarrity/Library/Caches/Cypress/10.2.0/Cypress.app/Contents/Resources/app/packages/server/lib/plugins/child/run_require_async_child.js:106:14)
    at async EventEmitter. (/Users/shanegarrity/Library/Caches/Cypress/10.2.0/Cypress.app/Contents/Resources/app/packages/server/lib/plugins/child/run_require_async_child.js:116:32)
```
