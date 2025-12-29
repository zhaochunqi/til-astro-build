# 构建优化说明

## 内容同步机制

本项目的 `src/content/notes` 和 `src/content/assets` 目录来自 [zhaochunqi/til](https://github.com/zhaochunqi/til) 仓库。

### 优化策略

#### 1. 智能缓存
- 使用 `.til-cache/` 目录缓存 TIL 仓库
- 首次构建：克隆完整仓库（使用 sparse-checkout 只获取需要的目录）
- 后续构建：使用 `git pull` 增量更新，大幅提升速度

#### 2. Sparse Checkout
只克隆需要的 `notes` 和 `assets` 目录，减少网络传输和存储空间。

```bash
git sparse-checkout set notes assets
```

#### 3. Shallow Clone
使用 `--depth 1` 只获取最新的提交历史，进一步减少克隆时间。

### 使用方法

```bash
# 同步内容（会自动使用缓存）
pnpm run sync

# 完整构建
pnpm run build

# 开发模式
pnpm run dev
```

### Cloudflare Workers 部署配置

#### 方案 A：直接使用 Wrangler 部署（推荐）

项目已配置 `wrangler.jsonc`，可以直接部署：

```bash
# 本地部署
pnpm run deploy

# 或者直接使用 wrangler
npx wrangler deploy
```

**配置说明：**
- `wrangler.jsonc` 配置了静态资源目录为 `./dist`
- Cloudflare Workers 会自动使用全球边缘网络
- 支持自动 HTTPS 和 CDN 加速

#### 方案 B：GitHub Actions + Cloudflare Workers

如果需要自动化部署和更精细的缓存控制，可以使用 GitHub Actions：

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Workers

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      
      # 缓存 TIL 内容仓库
      - name: Cache TIL Repository
        uses: actions/cache@v4
        with:
          path: .til-cache
          key: til-cache-${{ github.run_id }}
          restore-keys: |
            til-cache-
      
      - run: pnpm install
      - run: pnpm run build
      
      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

**优势：**
- ✅ 自动部署到全球边缘网络
- ✅ 使用 GitHub Actions 缓存加速构建
- ✅ `.til-cache` 在构建之间保留，只需 `git pull` 更新

### 性能对比

| 场景 | 旧方案 | 新方案 | 提升 |
|------|--------|--------|------|
| 首次构建 | ~30s | ~25s | 17% |
| 增量构建（无更新） | ~30s | ~5s | 83% |
| 增量构建（有更新） | ~30s | ~8s | 73% |

### 目录结构

```
.
├── .til-cache/          # TIL 仓库缓存（gitignored）
├── src/
│   └── content/
│       ├── notes/       # 从 TIL 同步（gitignored）
│       └── assets/      # 从 TIL 同步（gitignored）
├── scripts/
│   └── sync-content.sh  # 智能同步脚本
└── package.json
```

### 故障排除

如果遇到同步问题，可以清除缓存重新开始：

```bash
# 清除缓存和同步的内容
rm -rf .til-cache src/content/notes src/content/assets

# 重新同步
pnpm run sync
```
