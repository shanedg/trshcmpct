# trshcmpctr

[![GitHub Actions CI (Branch)](https://github.com/shanedg/trshcmpctr/actions/workflows/branch.yml/badge.svg)](https://github.com/shanedg/trshcmpctr/actions/workflows/branch.yml)

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
  * @trshcmpctr/jest-stdout-reporter (meh, maybe deleting this)
  * @trshcmpctr/markdownlint-config (nah; this is a config, maybe a snapshot?)
  * @trshcmpctr/scaffold (ehh, this will be hard)
* build cache things
* frontend ui for discord service
* q: what is the interface/api for discord service authing a particular frontend?
* esm-ify more packages
* publish
* generate changelogs
