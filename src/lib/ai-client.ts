import { GoogleGenAI } from "@google/genai";
import { ENVS } from "./config";
import { HttpError } from "./errors/http-error";

type Options = {
	prompt: string;
	systemInstruction: string;
};

const googleClient = new GoogleGenAI({
	apiKey: ENVS.GEMINI_API_KEY,
});

export class AiClient {
	static execute = async ({ prompt, systemInstruction }: Options) => {
		return this.geminiClient({ prompt, systemInstruction });
	};

	private static geminiClient = async ({ prompt, systemInstruction }: Options) => {
		try {
			const response = await googleClient.models.generateContent({
				model: "gemini-2.5-flash",
				contents: prompt,
				config: {
					systemInstruction,
					responseMimeType: "application/json",
				},
			});

			if (!response.text) {
				throw HttpError.badRequest("No response text from Gemini");
			}
			return JSON.parse(response.text);
		} catch (error) {
			throw HttpError.toHttpError(error, "Error with Gemini client");
		}
	};
}
