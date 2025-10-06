export type MakeRequired<T, K extends keyof T> = Partial<Omit<T, K>> &
	Required<Pick<T, K>>;

export type ParseError = { message: string; statusCode: number };
