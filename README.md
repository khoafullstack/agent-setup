# opencode-setup

Monorepo sử dụng **pnpm workspaces** để quản lý CLI tool và các plugin cho opencode.ai.

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
│   │           └── hello.ts
│   └── plugins/                    # opencode.ai plugins
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts
│           └── hello.ts
```

## Bắt đầu

### Yêu cầu

- Node.js >= 18
- pnpm (`npm install -g pnpm`)

### Cài đặt

```bash
pnpm install
```

## CLI (`@opencode-setup/cli`)

CLI tool được build bằng TypeScript + Commander.

### Build

```bash
pnpm --filter @opencode-setup/cli build
```

### Chạy

```bash
# Hello command
node packages/cli/bin/opencode-setup.js hello
# Output: Hello World!
```

### Dev mode (watch)

```bash
pnpm --filter @opencode-setup/cli dev
```

### Thêm command mới

1. Tạo file `packages/cli/src/commands/<command>.ts`
2. Import và register trong `packages/cli/src/index.ts`

## Plugins (`@opencode-setup/plugins`)

Các plugin cho [opencode.ai](https://opencode.ai). Xem thêm tại [docs/plugins](https://opencode.ai/docs/plugins/).

### Build

```bash
pnpm --filter @opencode-setup/plugins build
```

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
