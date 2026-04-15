# AGENTS.md

## Repo

pnpm monorepo · 3 packages · TypeScript strict · ESM (`"type": "module"`) · Node 18+

## Packages

| Package | Path | Role |
|---------|------|------|
| `@opencode-setup/cli` | `packages/cli/` | CLI tool (Commander.js), entry `bin/opencode-setup.js` |
| `@opencode-setup/plugins` | `packages/plugins/` | opencode.ai plugins |
| `@opencode-setup/shared` | `packages/shared/` | Shared types/utilities, consumed by both cli and plugins |

Dependency order: `shared` → `cli`, `plugins`. Build `shared` first.

## Commands

```
pnpm install              # install all deps
pnpm -r build             # build all packages (build shared first!)
pnpm --filter <pkg> build # build one package
pnpm --filter @opencode-setup/cli dev   # watch mode (tsx watch)
pnpm --filter <pkg> add <dep>           # add dep to a package
pnpm add -w -D <dep>                    # add root devDep
```

CLI can also be run directly before build via tsx:
```
tsx packages/cli/src/index.ts hello
```

## Adding a CLI command

1. Create `packages/cli/src/commands/<name>.ts`
2. Import and register in `packages/cli/src/index.ts`

## Adding a plugin

1. Create `packages/plugins/src/<name>.ts`
2. Export from `packages/plugins/src/index.ts`
3. Implement the [opencode.ai Plugin API](https://opencode.ai/docs/plugins/#events)

## Notes

- No test framework, linter, or formatter configured yet
- No CI configured
- TypeScript: ES2022 target, Node16 module resolution, strict mode, declarations enabled
- Plugin dist files are copied into a target project's `.opencode/plugins/` or published to npm
