export type MakeRequired<T, K extends keyof T> = Partial<Omit<T, K>> &
	Required<Pick<T, K>>;

export type UseCaseResult<T> = [
	errorMessage: string | null,
	statusCode: number,
	data: T | null,
];

export type ValidationResult<T> = [errorMessage: string | null, data: T | null];
