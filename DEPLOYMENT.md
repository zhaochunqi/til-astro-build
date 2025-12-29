# Cloudflare Workers 部署配置指南

## 📋 前置要求

- GitHub 账号
- Cloudflare 账号
- 已安装 pnpm

## 🔑 步骤 1：获取 Cloudflare API Token

1. 访问 [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. 点击 **"Create Token"**
3. 选择 **"Edit Cloudflare Workers"** 模板
4. 或者自定义权限：
   - Account - Cloudflare Workers Scripts: **Edit**
   - Account - Account Settings: **Read**
5. 点击 **"Continue to summary"** → **"Create Token"**
6. **复制并保存** Token（只显示一次！）

## 🆔 步骤 2：获取 Account ID

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 在右侧栏找到 **"Account ID"**
3. 点击复制

## 🔐 步骤 3：配置 GitHub Secrets

1. 打开你的 GitHub 仓库
2. 进入 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **"New repository secret"**
4. 添加两个 secrets：

   **Secret 1:**
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: 粘贴步骤 1 中的 API Token

   **Secret 2:**
   - Name: `CLOUDFLARE_ACCOUNT_ID`
   - Value: 粘贴步骤 2 中的 Account ID

## 🚀 步骤 4：推送代码触发部署

```bash
git add .github/workflows/
git commit -m "Add GitHub Actions deployment workflow"
git push
```

## ✅ 步骤 5：验证部署

1. 在 GitHub 仓库中，点击 **"Actions"** 标签
2. 查看 **"Deploy to Cloudflare Workers"** workflow 运行状态
3. 等待部署完成（通常 1-2 分钟）
4. 访问你的网站：`https://til-astro-build.workers.dev`

## 🎯 后续使用

### 自动部署
每次推送到 `main` 分支都会自动触发部署。

### 手动部署
1. GitHub 仓库 → **Actions**
2. 选择 **"Deploy to Cloudflare Workers"**
3. 点击 **"Run workflow"**

### 查看部署日志
- GitHub Actions 页面查看详细日志
- Cloudflare Dashboard → Workers & Pages 查看部署状态

## 🔧 故障排除

### 部署失败：API Token 无效
- 检查 `CLOUDFLARE_API_TOKEN` 是否正确
- 确认 Token 权限包含 "Edit Cloudflare Workers"

### 部署失败：Account ID 错误
- 检查 `CLOUDFLARE_ACCOUNT_ID` 是否正确
- 确认 Account ID 格式正确（32位十六进制字符）

### 缓存问题
- 首次部署会克隆完整仓库
- 后续部署会使用缓存，只需 `git pull`
- 如需清除缓存：GitHub Actions → Caches → 删除相关缓存

## 📊 性能监控

部署成功后，可以在 Cloudflare Dashboard 查看：
- 请求数量
- 响应时间
- 错误率
- 带宽使用

访问：https://dash.cloudflare.com/ → Workers & Pages → til-astro-build
