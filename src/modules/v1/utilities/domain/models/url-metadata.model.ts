export type UrlMetadataDomainModel = {
	// Información básicas
	title: string | null;
	description: string | null;
	url: string;
	canonicalUrl: string | null;

	// Imágenes
	// image: string | null;
	// favicon: string | null;

	// Open Graph
	// ogTitle: string | null;
	// ogDescription: string | null;
	// ogImage: string | null;
	// ogType: string | null;
	// ogSiteName: string | null;

	// Twitter
	// twitterTitle: string | null;
	// twitterDescription: string | null;
	// twitterImage: string | null;
	// twitterCard: string | null;

	// SEO
	keywords: string | null;
	author: string | null;

	// Información adicional
	// language: string | null;
	// publishedDate: string | null;
	// modifiedDate: string | null;
};
