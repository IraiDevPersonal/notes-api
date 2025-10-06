export function removeUndefined<T extends object>(
	value: Partial<T>
): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(value).filter(([_, v]) => v !== undefined)
	) as Record<string, unknown>;
}
