import type { CollectionEntry } from 'astro:content';

export function sortNotesByUlid(
	notes: CollectionEntry<'notes'>[]
): CollectionEntry<'notes'>[] {
	return notes.sort((a, b) => b.id.localeCompare(a.id));
}
