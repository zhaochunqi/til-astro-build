// 搜索相关的工具函数

export interface SearchFilters {
	query: string;
	compact: boolean;
}

export interface SearchResult {
	item: Element;
	matches: boolean;
	highlighted: boolean;
}

// 防抖函数
export function debounce(func: Function, wait: number) {
	let timeout: number;
	return function executedFunction(...args: any[]) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

// 移除高亮
export function removeHighlights(node: Element | null) {
	if (!node) return;
	
	const highlights = node.querySelectorAll('.search-highlight');
	highlights.forEach(span => {
		const parent = span.parentNode;
		if (parent) {
			parent.replaceChild(document.createTextNode(span.textContent || ''), span);
			parent.normalize(); 
		}
	});
}

// 高亮文本
export function highlightTextInNode(node: Element, query: string) {
	if (!query) return;
	
	// 使用 TreeWalker 查找文本节点
	const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
	const textNodes: Text[] = [];
	let currentNode;
	
	while(currentNode = walker.nextNode()) {
		// 检查节点是否可见/有效内容
		if (currentNode.textContent?.trim()) {
			textNodes.push(currentNode as Text);
		}
	}
	
	// regex escape
	const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const regex = new RegExp(`(${safeQuery})`, 'gi');
	
	textNodes.forEach(textNode => {
		// 避免双重高亮或在现有高亮内触发（如果脚本重新运行）
		// 同时避免高亮泄露的脚本/样式内容
		const parent = textNode.parentElement;
		if (parent?.tagName === 'SCRIPT' || 
			parent?.tagName === 'STYLE' || 
			parent?.classList.contains('search-highlight')) return;
			
		const text = textNode.nodeValue;
		if (text && regex.test(text)) {
			const fragment = document.createDocumentFragment();
			
			const parts = text.split(regex);
			// 带捕获组的 split 返回 [prev, match, next, match, ...]
			
			parts.forEach((part, i) => {
				if (part.toLowerCase() === query.toLowerCase()) {
					const span = document.createElement('span');
					span.className = 'search-highlight';
					span.textContent = part;
					fragment.appendChild(span);
				} else {
					fragment.appendChild(document.createTextNode(part));
				}
			});

			textNode.parentNode?.replaceChild(fragment, textNode);
		}
	});
}

// 更新 URL 参数
export function updateURL(query: string | undefined, compact: boolean | undefined) {
	const url = new URL(window.location.href);
	if (query) {
		url.searchParams.set('q', query);
	} else {
		url.searchParams.delete('q');
	}
	
	if (compact) {
		url.searchParams.set('compact', 'true');
	} else {
		url.searchParams.delete('compact');
	}
	
	window.history.pushState({}, '', url);
}

// 从 URL 读取搜索参数
export function getSearchParams(): { query: string; compact: boolean } {
	const params = new URLSearchParams(window.location.search);
	return {
		query: params.get('q') || '',
		compact: params.get('compact') === 'true'
	};
}

// 过滤搜索结果
export function filterResults(
	query: string, 
	searchItems: NodeListOf<Element>,
	resultsContainer: Element | null,
	noResults: Element | null
): number {
	if (!searchItems) return 0;
	
	const lowerQuery = query.toLowerCase();
	let count = 0;
	
	// 移除之前的高亮
	// 高效移除：选择所有 .search-highlight 并解包它们
	// 这比完全重新渲染或复杂替换更快更安全
	removeHighlights(resultsContainer);

	searchItems.forEach(item => {
		const title = (item as HTMLElement).dataset.title || '';
		const tags = (item as HTMLElement).dataset.tags || '';
		const content = item.textContent?.toLowerCase() || ''; 

		if (!query) {
			(item as HTMLElement).style.display = '';
			count++;
			return;
		}

		if (title.includes(lowerQuery) || tags.includes(lowerQuery) || content.includes(lowerQuery)) {
			(item as HTMLElement).style.display = '';
			count++;
			// 高亮
			if (query.length > 0) highlightTextInNode(item, query);
		} else {
			(item as HTMLElement).style.display = 'none';
		}
	});

	// 显示无结果提示
	if (count === 0 && query) {
		if (noResults) noResults.classList.remove('hidden');
	} else {
		if (noResults) noResults.classList.add('hidden');
	}
	
	return count;
}

// 切换紧凑模式
export function toggleCompactMode(compact: boolean, resultsContainer: Element | null) {
	if (resultsContainer) {
		if (compact) {
			resultsContainer.classList.add('mode-compact');
		} else {
			resultsContainer.classList.remove('mode-compact');
		}
	}
}