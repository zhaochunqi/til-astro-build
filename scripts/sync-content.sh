#!/bin/bash
set -e

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 同步 TIL 内容...${NC}"

# TIL 仓库配置
TIL_REPO="https://github.com/zhaochunqi/til.git"
CACHE_DIR=".til-cache"
CONTENT_NOTES_DIR="src/content/notes"
CONTENT_ASSETS_DIR="src/content/assets"

# 如果缓存目录不存在,首次克隆
if [ ! -d "$CACHE_DIR/.git" ]; then
    echo -e "${BLUE}🔽 首次克隆仓库...${NC}"
    rm -rf "$CACHE_DIR"
    git clone --depth 1 --filter=blob:none --sparse "$TIL_REPO" "$CACHE_DIR"
    
    cd "$CACHE_DIR"
    git sparse-checkout set notes assets
    cd ..
else
    # 缓存存在,使用 git pull 更新
    echo -e "${BLUE}🔄 更新缓存内容...${NC}"
    cd "$CACHE_DIR"
    git pull --depth 1
    cd ..
fi

# 清理并复制内容到目标目录
echo -e "${BLUE}📋 复制内容到项目...${NC}"
rm -rf "$CONTENT_NOTES_DIR" "$CONTENT_ASSETS_DIR"
cp -r "$CACHE_DIR/notes" "$CONTENT_NOTES_DIR"
cp -r "$CACHE_DIR/assets" "$CONTENT_ASSETS_DIR"

echo -e "${GREEN}✅ 内容同步完成!${NC}"
