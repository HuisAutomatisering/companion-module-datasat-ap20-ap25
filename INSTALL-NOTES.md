# How to apply this bundle

Unzip over the root of your local clone of
`companion-module-datasat-ap20-ap25`. Nothing here overwrites your module
code — only `package.json` and `README.md` replace existing files.

## One step you must do yourself

The Bitfocus checks **hard-fail without a committed `yarn.lock`**, and that
file can only be generated on your own machine:

```
corepack enable
yarn install
```

That creates `yarn.lock` (and pulls Yarn 4, as pinned in `package.json`).
Commit it along with everything else.

## Then push

```
git add -A
git commit -m "chore: add CI checks, security policy and repo metadata"
git push
```

Watch the **Actions** tab. The "Companion Module Checks" run validates
`companion/manifest.json`, builds the package and verifies the module loads.

## What the check will verify

- Repository name starts with `companion-module-` — OK
- `companion/manifest.json` `id` equals `datasat-ap20-ap25` — verify this
- `runtime.apiVersion` is `"0.0.0"` — verify this
- `runtime.type` is `node18`, `node22` or `node26` — verify this
- `products` is a non-empty array — verify this
- `companion/HELP.md` exists — OK
- `yarn.lock` present, `package-lock.json` absent — see above
- `@companion-module/tools` at least 2.8.0 — handled

If a run fails on one of the "verify this" items, the log names the exact
field. Delete this file once you are done.
