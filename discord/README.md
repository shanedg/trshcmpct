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
