# opencode-setup

Monorepo sử dụng **pnpm workspaces** để quản lý CLI tool, shared utilities và các plugin cho opencode.ai.

## Cấu trúc thư mục

```
opencode-setup/
├── package.json                    # root - private workspace
├── pnpm-workspace.yaml             # khai báo workspace packages
├── packages/
│   ├── cli/                        # CLI tool (opencode-setup)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── bin/
│   │   │   └── opencode-setup.js   # entry point
│   │   └── src/
│   │       ├── index.ts
│   │       └── commands/
│   ├── plugins/                    # opencode.ai plugins
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts
│   │       ├── config-mcp.ts
│   │       ├── workflow-plugin.ts
│   │       ├── agents/
│   │       └── tools/
│   └── shared/                     # Shared types & utilities
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts
│           ├── types.ts
│           └── utils.ts
```

## Packages

| Package | Path | Role |
|---------|------|------|
| `@opencode-setup/cli` | `packages/cli/` | CLI tool (Commander.js), entry `bin/opencode-setup.js` |
| `@opencode-setup/plugins` | `packages/plugins/` | opencode.ai plugins |
| `@opencode-setup/shared` | `packages/shared/` | Shared types/utilities, consumed by cli và plugins |

Dependency order: `shared` → `cli`, `plugins`. Build `shared` trước.

## Bắt đầu

### Yêu cầu

- Node.js >= 18
- pnpm (`npm install -g pnpm`)

### Cài đặt

```bash
pnpm install
```

### Build

```bash
pnpm -r build             # build tất cả packages
pnpm --filter <pkg> build # build 1 package cụ thể
```

> Build `shared` trước khi build `cli` hoặc `plugins`.

### Dev mode (watch)

```bash
pnpm --filter @opencode-setup/cli dev   # watch mode cho CLI (tsx watch)
```

## CLI (`@opencode-setup/cli`)

CLI tool được build bằng TypeScript + Commander.

### Chạy

```bash
node packages/cli/bin/opencode-setup.js hello
```

Hoặc chạy trực tiếp qua tsx (không cần build):

```bash
tsx packages/cli/src/index.ts hello
```

### Thêm command mới

1. Tạo file `packages/cli/src/commands/<command>.ts`
2. Import và register trong `packages/cli/src/index.ts`

## Plugins (`@opencode-setup/plugins`)

Các plugin cho [opencode.ai](https://opencode.ai). Xem thêm tại [docs/plugins](https://opencode.ai/docs/plugins/).

### Sử dụng plugin

Copy file `.js` từ `packages/plugins/dist/` vào `.opencode/plugins/` của project cần dùng.

Hoặc publish lên npm và thêm vào `opencode.json`:

```json
{
  "plugin": ["@opencode-setup/plugins"]
}
```

### Tạo plugin mới

1. Tạo file `packages/plugins/src/<name>.ts`
2. Export trong `packages/plugins/src/index.ts`
3. Implement theo [Plugin API](https://opencode.ai/docs/plugins/#events)

## Shared (`@opencode-setup/shared`)

Chứa các types và utilities dùng chung cho `cli` và `plugins`.

### Cấu trúc

- `src/types.ts` — TypeScript interfaces/types
- `src/utils.ts` — Utility functions

### Build

```bash
pnpm --filter @opencode-setup/shared build
```

Output: `dist/index.js` + `dist/index.d.ts`

## Lệnh hay dùng

| Lệnh | Mô tả |
|------|--------|
| `pnpm install` | Cài tất cả dependencies |
| `pnpm -r build` | Build tất cả packages |
| `pnpm --filter <name> build` | Build 1 package cụ thể |
| `pnpm --filter <name> dev` | Dev mode cho 1 package |
| `pnpm --filter <name> add <pkg>` | Cài dependency cho 1 package |
| `pnpm --filter <name> add -D <pkg>` | Cài dev dependency |
| `pnpm add -w -D <pkg>` | Cài dev dependency ở root |
