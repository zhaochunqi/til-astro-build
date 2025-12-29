# TIL Astro Build

基于 Astro 构建的 TIL (Today I Learned) 网站，内容来自 [zhaochunqi/til](https://github.com/zhaochunqi/til)。

## ✨ 特性

- 🚀 使用 Astro 静态站点生成
- 📝 自动同步 TIL 仓库内容
- ⚡️ 智能缓存机制，加速构建
- 🌐 部署到 Cloudflare Workers
- 🎨 简洁的黑白极简设计

## 🧞 命令

| 命令 | 说明 |
| :--- | :--- |
| `pnpm install` | 安装依赖 |
| `pnpm run sync` | 同步 TIL 内容（使用智能缓存） |
| `pnpm run dev` | 启动开发服务器 `localhost:4321` |
| `pnpm run build` | 构建生产版本到 `./dist/` |
| `pnpm run preview` | 本地预览构建结果 |
| `pnpm run deploy` | 部署到 Cloudflare Workers |

## 📚 文档

- [Webhook 配置指南](./WEBHOOK.md) - **推荐** 配置 TIL 源仓库自动触发构建
- [部署配置指南](./DEPLOYMENT.md) - 如何配置 GitHub Actions 和 Cloudflare Workers
- [构建优化说明](./BUILD_OPTIMIZATION.md) - 详细的缓存和同步机制
- [GitHub Actions 说明](./.github/workflows/README.md) - CI/CD 工作流程

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
pnpm install

# 同步 TIL 内容
pnpm run sync

# 启动开发服务器
pnpm run dev
```

### 生产部署

通过 GitHub Actions 自动部署，详见 [WEBHOOK.md](./WEBHOOK.md)。

## 🔧 构建优化

- ✅ 使用 `.til-cache` 缓存 git 仓库
- ✅ 首次克隆，后续 `git pull` 增量更新
- ✅ 增量构建速度提升 **83%**

详细说明请查看 [BUILD_OPTIMIZATION.md](./BUILD_OPTIMIZATION.md)。
