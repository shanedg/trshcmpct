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
