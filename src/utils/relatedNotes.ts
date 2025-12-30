import type { CollectionEntry } from "astro:content";

interface RelatedNote {
	note: CollectionEntry<"notes">;
	score: number;
	reason: "tags" | "content" | "both";
}

function getNoteText(note: CollectionEntry<"notes">): string {
	return `${note.data.title} ${note.body || ""} ${note.data.tags?.join(" ") || ""}`;
}

function tokenize(text: string): Set<string> {
	return new Set(
		text
			.toLowerCase()
			.replace(/[^\w\s]/g, " ")
			.split(/\s+/)
			.filter((word) => word.length > 2),
	);
}

function jaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
	if (set1.size === 0 || set2.size === 0) return 0;

	const intersection = new Set([...set1].filter((x) => set2.has(x)));
	const union = new Set([...set1, ...set2]);

	return intersection.size / union.size;
}

function calculateTagScore(
	currentTags: string[] | undefined,
	otherTags: string[] | undefined,
): number {
	if (
		!currentTags ||
		!otherTags ||
		currentTags.length === 0 ||
		otherTags.length === 0
	) {
		return 0;
	}

	const commonTags = currentTags.filter((tag) => otherTags.includes(tag));
	const totalTags = new Set([...currentTags, ...otherTags]).size;

	return commonTags.length / totalTags;
}

export function findRelatedNotes(
	currentNote: CollectionEntry<"notes">,
	allNotes: CollectionEntry<"notes">[],
	limit: number = 3,
): CollectionEntry<"notes">[] {
	const currentTags = currentNote.data.tags || [];
	const currentTokens = tokenize(getNoteText(currentNote));

	const relatedNotes: RelatedNote[] = allNotes
		.filter((note) => note.id !== currentNote.id)
		.map((note) => {
			const tagScore = calculateTagScore(currentTags, note.data.tags || []);
			const otherTokens = tokenize(getNoteText(note));
			const contentSimilarity = jaccardSimilarity(currentTokens, otherTokens);

			const overallScore = tagScore * 0.6 + contentSimilarity * 0.4;

			let reason: "tags" | "content" | "both" = "content";
			if (tagScore > 0.3) {
				reason = tagScore > contentSimilarity ? "tags" : "both";
			}

			return { note, score: overallScore, reason };
		})
		.filter((item) => item.score > 0.05)
		.sort((a, b) => b.score - a.score)
		.slice(0, limit);

	return relatedNotes.map((item) => item.note);
}
