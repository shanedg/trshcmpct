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

## Troubleshooting

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
