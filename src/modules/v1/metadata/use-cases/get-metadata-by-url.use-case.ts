import * as cheerio from "cheerio";
import { HttpError } from "@/lib/errors/http-error";
import type { HttpClient } from "@/lib/http-client";
import type { UrlMetadataDomainModel } from "../models/domain/url-metadata.domain.model";

export class GetMetadataByUrlUseCase {
	private readonly httpClient: HttpClient;

	constructor(httpClient: HttpClient) {
		this.httpClient = httpClient;
	}

	async execute(url: string): Promise<UrlMetadataDomainModel> {
		try {
			const response = await this.httpClient.get(url);

			if (!response.ok) {
				throw HttpError.badRequest(`Failed to fetch URL: ${response.statusText}`);
			}

			const html = await response.text();
			const $ = cheerio.load(html);

			const baseUrl = new URL(url);

			return {
				// Básico
				url,
				title: this.getTitle($),
				description: this.getDescription($),
				canonicalUrl: this.getCanonicalUrl($, baseUrl),

				// SEO
				author: this.getAuthor($),
				keywords: this.getMetaContent($, 'meta[name="keywords"]'),

				// Imágenes
				// image: this.getImage($, baseUrl),
				// favicon: this.getFavicon($, baseUrl),

				// Open Graph
				// ogTitle: this.getMetaContent($, 'meta[property="og:title"]'),
				// ogDescription: this.getMetaContent($, 'meta[property="og:description"]'),
				// ogImage: this.resolveUrl(
				// 	this.getMetaContent($, 'meta[property="og:image"]'),
				// 	baseUrl
				// ),
				// ogType: this.getMetaContent($, 'meta[property="og:type"]'),
				// ogSiteName: this.getMetaContent($, 'meta[property="og:site_name"]'),

				// Twitter
				// twitterTitle: this.getMetaContent($, 'meta[name="twitter:title"]'),
				// twitterDescription: this.getMetaContent($, 'meta[name="twitter:description"]'),
				// twitterImage: this.resolveUrl(
				// 	this.getMetaContent($, 'meta[name="twitter:image"]'),
				// 	baseUrl
				// ),
				// twitterCard: this.getMetaContent($, 'meta[name="twitter:card"]'),

				// Adicional
				// language: $("html").attr("lang") || null,
				// publishedDate: this.getMetaContent($, 'meta[property="article:published_time"]'),
				// modifiedDate: this.getMetaContent($, 'meta[property="article:modified_time"]'),
			};
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw HttpError.internalServerError("Error fetching URL metadata");
		}
	}

	private getTitle($: cheerio.CheerioAPI): string {
		return (
			this.getMetaContent($, 'meta[property="og:title"]') ||
			$("title").first().text().trim() ||
			"Sin título"
		);
	}

	private getDescription($: cheerio.CheerioAPI): string {
		return (
			this.getMetaContent($, 'meta[property="og:description"]') ||
			this.getMetaContent($, 'meta[name="description"]') ||
			"Sin descripción"
		);
	}

	private getAuthor($: cheerio.CheerioAPI): string | null {
		const metaAuthor = this.getMetaContent($, 'meta[name="author"]');
		if (metaAuthor) return metaAuthor;

		const ogAuthor = this.getMetaContent($, 'meta[property="article:author"]');
		if (ogAuthor) return ogAuthor;

		const jsonLdAuthor = this.extractAuthorFromJsonLd($);
		if (jsonLdAuthor) return jsonLdAuthor;

		const commonSelectors = [
			".author-name",
			".author",
			".byline",
			'[rel="author"]',
			".entry-author",
			'[itemprop="author"]',
			".post-author",
		];

		for (const selector of commonSelectors) {
			const author = $(selector).first().text().trim();
			if (author) return author;
		}

		return null;
	}

	private extractAuthorFromJsonLd($: cheerio.CheerioAPI): string | null {
		const scripts = $('script[type="application/ld+json"]');

		for (let i = 0; i < scripts.length; i++) {
			try {
				const json = JSON.parse($(scripts[i]).html() || "{}");

				// Formato: { "author": "Nombre" }
				if (json.author) {
					if (typeof json.author === "string") return json.author;
					if (json.author.name) return json.author.name;
				}
			} catch (_) {
				// Ignorar errores de parsing
			}
		}

		return null;
	}

	private getCanonicalUrl($: cheerio.CheerioAPI, baseUrl: URL): string | null {
		const canonical = $('link[rel="canonical"]').attr("href");
		return this.resolveUrl(canonical || null, baseUrl);
	}

	private getMetaContent($: cheerio.CheerioAPI, selector: string): string | null {
		const content = $(selector).attr("content");
		return content?.trim() || null;
	}

	private resolveUrl(url: string | null, baseUrl: URL): string | null {
		if (!url) return null;
		try {
			return new URL(url, baseUrl).href;
		} catch {
			return null;
		}
	}

	// private getImage($: cheerio.CheerioAPI, baseUrl: URL): string | null {
	// 	const ogImage = this.getMetaContent($, 'meta[property="og:image"]');
	// 	if (ogImage) return this.resolveUrl(ogImage, baseUrl);

	// 	const twitterImage = this.getMetaContent($, 'meta[name="twitter:image"]');
	// 	if (twitterImage) return this.resolveUrl(twitterImage, baseUrl);

	// 	return null;
	// }

	// private getFavicon($: cheerio.CheerioAPI, baseUrl: URL): string | null {
	// 	const favicon =
	// 		$('link[rel="icon"]').attr("href") ||
	// 		$('link[rel="shortcut icon"]').attr("href") ||
	// 		$('link[rel="apple-touch-icon"]').attr("href") ||
	// 		"/favicon.ico";

	// 	return this.resolveUrl(favicon || null, baseUrl);
	// }
}
