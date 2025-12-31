# Partytown 配置说明

## 🚀 已启用功能

### 1. Partytown 集成
- 已安装 `@astrojs/partytown` 
- 已配置 Partytown 集成到 Astro 项目

### 2. 生成文件
构建后会生成以下 Partytown 文件：
- `~partytown/partytown.js`
- `~partytown/partytown-sw.js` 
- `~partytown/partytown-atomics.js`
- `~partytown/partytown-media.js`

## 📝 使用方法

当添加第三方脚本时，只需将 `type="text/partytown"` 添加到 `<script>` 标签：

```html
<!-- 普通脚本 -->
<script src="https://www.google-analytics.com/analytics.js"></script>

<!-- Partytown 优化脚本 -->
<script type="text/partytown" src="https://www.google-analytics.com/analytics.js"></script>
```

## 🔧 配置选项

当前配置：
- `debug: false` - 关闭调试模式
- `expensive: true` - 启用高级优化
- `forward: ['dataLayer.push', 'gtag', 'fbq']` - 转发常见的分析函数

## ⚡ 性能提升

- **脚本隔离**：第三方脚本在 Web Worker 中运行，不阻塞主线程
- **更快的页面加载**：减少第三方脚本的渲染阻塞
- **更好的 Core Web Vitals**：改善 LCP、FID 等指标

## 📋 常见第三方脚本示例

```html
<!-- Google Analytics -->
<script type="text/partytown" async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>

<!-- Facebook Pixel -->
<script type="text/partytown" async src="https://connect.facebook.net/en_US/fbevents.js"></script>

<!-- Twitter Widget -->
<script type="text/partytown" async src="https://platform.twitter.com/widgets.js"></script>

<!-- Disqus Comments -->
<script type="text/partytown" async src="https://your-site.disqus.com/embed.js"></script>
```

配置完成！现在可以添加任何第三方脚本并通过 Partytown 优化性能。