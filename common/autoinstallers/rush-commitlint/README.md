# `rush-commitlint`

This [autoinstaller] supports linting commit messages in this repo with
[@commitlint/cli] extending the rules from
[@commitlint/config-conventional].
Using an autoinstaller ensures that commit messages can always be
linted, even if repo dependencies are not installed.

See the `@commitlintconfig-conventional` [readme#rules] for a list of
enforced rules.

## Keeping Autoinstaller Dependencies Up to Date

From this directory, run the following:

```sh
npx npm-check-updates@17.1.11 --upgrade --target minor
npx npm-check-updates@17.1.11 --upgrade --target latest --reject '@types/node'
```

> Keep the version of [npm-check-updates] used here in sync with
commands in [common/config/rush/command-line.json]

The first command upgrades all dependencies to the latest minor version.
The second then upgrades all dependencies except for `@types/node` to
the latest (major) version.

> `@types/node` is excluded because the major version of this package
corresponds with the expected major version of Node and this repository
will continue to use Node 18 until Node 20 becomes the active Long Term
Support (LTS) version.

Then, from anywhere in the repository, run:

```sh
rush update-autoinstaller --name rush-commitlint
```

Commit the changes:

```sh
git add package.json pnpm-lock.yaml
git commit -m 'build(deps): update rush-commitlint autoinstaller'
```

[@commitlint/cli]: https://www.npmjs.com/package/@commitlint/cli
[@commitlint/config-conventional]: https://www.npmjs.com/package/@commitlint/config-conventional
[autoinstaller]: https://rushjs.io/pages/maintainer/autoinstallers/
[common/config/rush/command-line.json]: ../../config/rush/command-line.json
[npm-check-updates]: https://www.npmjs.com/package/npm-check-updates
[readme#rules]: https://github.com/conventional-changelog/commitlint/blob/master/%40commitlint/config-conventional/README.md#rules
