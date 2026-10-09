/**
 * 把指向笔记文件的链接改写成站内规范路径 `/<ulid>/`。
 *
 * 源仓（zhaochunqi/til）里的约定是「从仓根数」的 `notes/<ULID>.md`，见那边的
 * scripts/check_note_links.py。之所以要在构建时改写：「相对」在不同渲染面基准不同——
 * GitHub 按文件所在目录解析（所以那种写法在 GitHub 上是 404，属已知取舍），浏览器按
 * 当前页面 URL 解析（搜索页把整篇正文渲染在 /search/ 下，相对链接必坏），Obsidian 按
 * 文件名解析。改成绝对路径后，从笔记页、tag 页、archive 页到搜索页点都对。
 *
 * 手写递归而不是用 unist-util-visit：省一个直接依赖（那个包只是 astro 的传递依赖）。
 */

const NOTE_FILE = /(?:^|\/)([0-9A-HJKMNP-TV-Z]{26})\.md$/i;

export default function remarkNoteLinks() {
	return (tree) => walk(tree);
}

function walk(node) {
	if (node.type === "link" && typeof node.url === "string") {
		const matched = NOTE_FILE.exec(node.url);
		if (matched) node.url = `/${matched[1].toLowerCase()}/`;
	}
	for (const child of node.children ?? []) walk(child);
}
