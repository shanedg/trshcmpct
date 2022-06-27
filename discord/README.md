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

## Cypress Troubleshooting

### Actually starting the server in Drone

Discord server is failing to start and `test:cypress` step is then running until timeout.
This isn't what I thought at first glance: `ERR_IMPORT_ASSERTION_TYPE_FAILED`.
The config file somehow isn't JSON.
Maybe `inject_secrets` is broken?
Try printing `discord/lib/config.json` during Drone run.

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

### Linting

Initial eslint run after Cypress generated files:

```sh
✖ 1446 problems (707 errors, 739 warnings)
  0 errors and 735 warnings potentially fixable with the `--fix` option.
```

After `--fix`ing:

```sh
✖ 711 problems (707 errors, 4 warnings)
```

Afer installing and configuring `eslint-plugin-cypress`:

```sh
✖ 20 problems (16 errors, 4 warnings)
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
