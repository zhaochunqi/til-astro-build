#!/bin/bash
set -e

echo "📥 同步 TIL 内容到本地..."

# 清理旧内容
rm -rf .til-local src/content/notes src/content/assets

# 克隆 TIL 仓库（sparse checkout）
git clone --depth 1 --filter=blob:none --sparse https://github.com/zhaochunqi/til.git .til-local

cd .til-local
git sparse-checkout set notes assets
cd ..

# 复制到项目
cp -r .til-local/notes src/content/notes
cp -r .til-local/assets src/content/assets

echo "✅ 内容同步完成！"
echo "💡 现在可以运行: pnpm run dev"
