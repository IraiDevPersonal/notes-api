import { GoogleGenAI } from "@google/genai";
// import OpenAI from "openai";
import { ENVS } from "./config";
import { HttpError } from "./errors/http-error";

type AiOptions = {
	prompt: string;
	systemInstruction: string;
};

type AiResponse = Record<string, unknown>;

enum AiProvider {
	GEMINI = "gemini",
	OPENAI = "openai",
	// Agregar más proveedores aquí
}

type AiClientConfig = {
	provider: AiProvider;
	execute: (options: AiOptions) => Promise<AiResponse>;
	isEnabled: boolean;
};

export class AiClient {
	private static clients: AiClientConfig[] = [];

	/**
	 * Inicializa los clientes de IA disponibles
	 */
	static initialize() {
		this.clients = [
			{
				provider: AiProvider.GEMINI,
				execute: this.geminiClient,
				isEnabled: !!ENVS.GEMINI_API_KEY,
			},
			// {
			// 	provider: AiProvider.OPENAI,
			// 	execute: this.openaiClient,
			// 	// isEnabled: !!ENVS.OPENAI_API_KEY,
			// },
			// Agregar más clientes aquí
		].filter((client) => client.isEnabled);

		if (this.clients.length === 0) {
			throw new Error("No AI providers are configured");
		}
	}

	static async execute(options: AiOptions): Promise<AiResponse> {
		// Asegurar que los clientes estén inicializados
		if (this.clients.length === 0) {
			this.initialize();
		}

		const errors: Array<{ provider: AiProvider; error: unknown }> = [];

		// Intentar con cada proveedor en orden
		for (const client of this.clients) {
			try {
				console.log(`Attempting with provider: ${client.provider}`);
				const response = await client.execute(options);
				console.log(`Success with provider: ${client.provider}`);
				return response;
			} catch (error) {
				console.error(`Failed with provider ${client.provider}:`, error);
				errors.push({ provider: client.provider, error });
				// Continuar con el siguiente proveedor
			}
		}

		// Si todos fallaron, lanzar error con detalles
		throw this.createFallbackError(errors);
	}

	private static geminiClient = async ({
		prompt,
		systemInstruction,
	}: AiOptions): Promise<AiResponse> => {
		const googleClient = new GoogleGenAI({
			apiKey: ENVS.GEMINI_API_KEY,
		});

		const response = await googleClient.models.generateContent({
			model: "gemini-2.0-flash-exp",
			contents: prompt,
			config: {
				systemInstruction,
				responseMimeType: "application/json",
			},
		});

		if (!response.text) {
			throw new Error("No response text from Gemini");
		}

		return JSON.parse(response.text);
	};

	// private static openaiClient = async (_options: AiOptions): Promise<AiResponse> => {
	// const openai = new OpenAI({
	// 	apiKey: ENVS.OPENAI_API_KEY,
	// });

	// const response = await openai.chat.completions.create({
	// 	model: "gpt-4o-mini",
	// 	messages: [
	// 		{ role: "system", content: systemInstruction },
	// 		{ role: "user", content: prompt },
	// 	],
	// 	response_format: { type: "json_object" },
	// });

	// const content = response.choices[0]?.message?.content;
	// if (!content) {
	// 	throw new Error("No response content from OpenAI");
	// }

	// return JSON.parse(content);
	// };

	/**
	 * Crea un error descriptivo cuando todos los proveedores fallan
	 */
	private static createFallbackError(
		errors: Array<{ provider: AiProvider; error: unknown }>
	): HttpError {
		const errorMessages = errors
			.map(({ provider, error }) => {
				const message = error instanceof Error ? error.message : String(error);
				return `${provider}: ${message}`;
			})
			.join(" | ");

		return HttpError.internalServerError(`All AI providers failed: ${errorMessages}`);
	}

	/**
	 * Obtiene el proveedor actualmente activo (el primero disponible)
	 */
	static getActiveProvider(): AiProvider | null {
		return this.clients[0]?.provider ?? null;
	}

	/**
	 * Obtiene todos los proveedores disponibles
	 */
	static getAvailableProviders(): AiProvider[] {
		return this.clients.map((c) => c.provider);
	}
}
