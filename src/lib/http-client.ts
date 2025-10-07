type HttpClientOptions = {
	options?: RequestInit;
	baseUrl?: string;
};

export class HttpClient {
	private readonly baseUrl: string | undefined;
	private readonly options: RequestInit | undefined;

	constructor(options: HttpClientOptions | undefined) {
		this.options = options?.options;
		this.baseUrl = options?.baseUrl;
	}

	async get(url: string) {
		const fullUrl = this.baseUrl ? `${this.baseUrl}/${url}` : url;
		return await fetch(fullUrl, this.options);
	}
}
