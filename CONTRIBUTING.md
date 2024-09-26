# Contributing

Notes specifically for repository maintainers

## TODOs

* new deployment target that's just a local network raspberry pi
* implement worlds api endpoint
* upload cypress screenshots, videos, and/or
rush *.log artifacts to github build artifacts for debugging
* auth fails on first couple renders, refresh resolves
* upgrade to eslint v9
  * upgrade eslint-plugin-ava to latest major
* docs: updating/upgrading node
* lint js/md on precommit?
* esm-ify more packages
* publish
* generate changelogs
* @trshcmpctr/eslint-config-jest:
  * <https://github.com/dangreenisrael/eslint-plugin-jest-formatting>
  * <https://github.com/istanbuljs/eslint-plugin-istanbul>
  * <https://www.npmjs.com/package/eslint-plugin-jest-dom>
* @trshcmpctr/eslint-config-typescript
  * <https://typescript-eslint.io/docs/linting/troubleshooting/#the-indent--typescript-eslintindent-rules>

## Scaffolding a New Project

Use a custom rush command (see [command-line.json]) that calls [plop] to
scaffold a new project. Answer the command line prompts to generate a
new project based on templates in [@trshcmpctr/scaffold].

```sh
rush scaffold
```

## Keeping Project Dependencies Up to Date

> WARN: Autoinstallers are managed separately, see [rush-commitlint].

Periodically bump project dependencies for new features and fixes,
e.g. before starting or after completing new feature development.
Break dependency upgrades into stages to make it easier to identify what
version changes are responsible for any problems.
Lint code, run tests, and validate affected project behavior at each
stage:

### 1. Patch Updates

Use the out of the box rush update feature to bump all packages to the
latest version available that satisfies current range specifiers.
Since this repo abides by the default rush convention that package
specifiers are prefixed by [tildes], this effectively implies only patch
updates.

```sh
rush update --full
git add common/rush/pnpm-lock.yaml common/rush/repo-state.json
git commit -m 'build(deps): rush update --full'
```

### 2. Minor Updates

Use a custom rush command[^1] (see [command-line.json]) that calls
[npm-check-updates] to bump all packages to the latest minor version.

```sh
rush update-minor
rush update
git add -A
git commit -m 'build(deps): rush update-minor'
```

### 3. Major Upgrades

Use a custom rush command[^1] (see [command-line.json]) that calls
[npm-check-updates] to bump all packages to the latest major version.

```sh
rush update-major
rush update
git add -A
git commit -m 'build(deps): rush update-major'
```

Packages excluded via the [--reject] option:

* `@types/node` is excluded because the major version of this package
corresponds with the expected major version of Node and this repository
will continue to use Node 18 until Node 20 becomes the active Long Term
Support (LTS) version
* `eslint` is excluded because some plugins are not compatible with v9
* `eslint-plugin-ava` is excluded until we can upgrade to eslint v9

Blockers for Eslint v9:

* `eslint-plugin-import` <https://github.com/import-js/eslint-plugin-import/issues/2948>
  * still no: <https://github.com/import-js/eslint-plugin-import/blob/18787d3e6966028983af81a878d1a505893932d4/package.json#L109>
  * interesting idea that this plugin should be replaced by a purpose-built tool;
  eslint is not really intended to support the api that this plugin uses
* `eslint-plugin-jest`
  * should be resolved by <https://github.com/jest-community/eslint-plugin-jest/pull/1547>
* `eslint-plugin-jsx-a11y`
  * should be resolved by <https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/pull/1009>
* `eslint-plugin-react-hooks`
  * should be resolved by <https://github.com/facebook/react/pull/28773>
* `eslint-plugin-testing-library`
  * no resolution yet, only some discussion in issues
* `@typescript-eslint/utils`
  * should be resolved by <https://github.com/typescript-eslint/typescript-eslint/pull/9002>

## Updating pnpm

Periodically update the version of [pnpm] used in this repo with the
`pnpmVersion` field in [rush.json].
See the [pnpm releases page] for details on new features and fixes.
Run `rush update` with the `--recheck` flag to pick up any subtle
differences in dependency calculation and commit the changes to
`rush.json` as well as any changes in [pnpm-lock.yaml].

```sh
rush update --recheck
git add rush.json common/config/rush/pnpm-lock.yaml
git commit -m 'build(deps): update pnpm from x to y'
```

## Updating Rush

Periodically update the version of Rush used in this repo with the
`rushVersion` field in [rush.json].
See the [Rush changelog] for details on new features and fixes.
Run `rush update` and commit changes to `rush.json` as well as any
scripts modified in [common/scripts].

```sh
rush update
git add rush.json common/scripts
git commit -m 'build(deps): update rush from x to y'
```

---

[^1]: `update-minor` and `update-major` depend on [jq](https://stedolan.github.io/jq/)
(with Homebrew: `brew install jq`)

[--reject]: https://www.npmjs.com/package/npm-check-updates#reject
[@trshcmpctr/scaffold]: ./scaffold
[command-line.json]: ./common/config/rush/command-line.json
[common/scripts]: ./common/scripts
[npm-check-updates]: https://www.npmjs.com/package/npm-check-updates
[plop]: https://www.npmjs.com/package/plop
[pnpm releases page]: https://github.com/pnpm/pnpm/releases
[pnpm-lock.yaml]: ./common/config/rush/pnpm-lock.yaml
[pnpm]: https://www.npmjs.com/package/pnpm
[Rush changelog]: https://github.com/microsoft/rushstack/blob/main/apps/rush/CHANGELOG.md
[rush-commitlint]: ./common/autoinstallers/rush-commitlint/README.md
[rush.json]: ./rush.json
[tildes]: https://github.com/npm/node-semver?tab=readme-ov-file#tilde-ranges-123-12-1
