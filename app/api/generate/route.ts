import {
	buildFallbackGeneration,
	buildPrompt,
	generationRequestSchema,
	generationResponseSchema,
	normalizeGenerationData,
	parseModelResponse,
} from "@/lib/wrangler";

export const runtime = "edge";

const DEFAULT_AI_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const DEFAULT_REQUEST_TIMEOUT_MS = 60_000;
const MAX_RETRIES = 1;

type AiPayload = {
	result?: unknown;
	response?: unknown;
	output?: unknown;
};

type CloudflareErrorPayload = {
	errors?: Array<{ message?: string; code?: number }>;
	message?: string;
};

function isRetryableStatus(status: number) {
	return [408, 409, 425, 429, 500, 502, 503, 504, 522, 524].includes(status);
}

function resolveTimeoutMs() {
	const raw = Number(process.env.CLOUDFLARE_AI_TIMEOUT_MS);

	if (!Number.isFinite(raw) || raw < 10_000) {
		return DEFAULT_REQUEST_TIMEOUT_MS;
	}

	return Math.min(raw, 120_000);
}

async function extractCloudflareErrorMessage(response: Response) {
	const fallbackMessage = `AI service temporarily unavailable (status ${response.status}).`;

	try {
		const payload = (await response.json()) as CloudflareErrorPayload;
		const firstError = payload.errors?.[0]?.message;
		const topLevelMessage = payload.message;

		if (firstError) {
			return `${fallbackMessage} ${firstError}`;
		}

		if (topLevelMessage) {
			return `${fallbackMessage} ${topLevelMessage}`;
		}
	} catch {
		// Ignore payload parsing issues and fall back to status-only message.
	}

	return fallbackMessage;
}

function extractTextFromObject(candidate: Record<string, unknown>) {
	const directTextKeys = ["response", "text", "output_text", "content"];

	for (const key of directTextKeys) {
		const value = candidate[key];

		if (typeof value === "string") {
			return value;
		}
	}

	if ("config" in candidate && "commands" in candidate) {
		return JSON.stringify(candidate);
	}

	if (Array.isArray(candidate.choices)) {
		for (const choice of candidate.choices) {
			if (!choice || typeof choice !== "object") {
				continue;
			}

			const message = (choice as { message?: unknown }).message;

			if (message && typeof message === "object") {
				const content = (message as { content?: unknown }).content;

				if (typeof content === "string") {
					return content;
				}
			}

			const text = (choice as { text?: unknown }).text;

			if (typeof text === "string") {
				return text;
			}
		}
	}

	return null;
}

function extractModelText(payload: AiPayload) {
	const candidates = [payload.result, payload.response, payload.output];

	for (const candidate of candidates) {
		if (typeof candidate === "string") {
			return candidate;
		}

		if (Array.isArray(candidate)) {
			const joined = candidate.filter((item) => typeof item === "string").join("\n").trim();

			if (joined) {
				return joined;
			}
		}

		if (candidate && typeof candidate === "object") {
			const objectText = extractTextFromObject(candidate as Record<string, unknown>);

			if (objectText) {
				return objectText;
			}
		}
	}

	return null;
}

export async function POST(request: Request) {
	const body = await request.json().catch(() => null);
	const parsedRequest = generationRequestSchema.safeParse(body);

	if (!parsedRequest.success) {
		return Response.json(
			{
				success: false,
				error: "Please enter at least 10 characters describing your Cloudflare project.",
			},
			{ status: 400 }
		);
	}

	const userPrompt = parsedRequest.data.prompt;
	const fallback = buildFallbackGeneration(userPrompt);
	const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
	const apiToken = process.env.CLOUDFLARE_API_TOKEN;
	const aiModel = process.env.CLOUDFLARE_AI_MODEL ?? DEFAULT_AI_MODEL;
	const requestTimeoutMs = resolveTimeoutMs();

	if (!accountId || !apiToken) {
		return Response.json({
			success: true,
			data: fallback,
			warning:
				"AI credentials are not configured yet, so a local fallback configuration was generated.",
		});
	}

	let lastWarning = "";

	for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), requestTimeoutMs);

			const response = await fetch(
				`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${aiModel}`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${apiToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						prompt: buildPrompt(userPrompt),
						response_format: {
							type: "json_object",
						},
					}),
					signal: controller.signal,
				}
			);

			clearTimeout(timeoutId);

			if (!response.ok) {
				lastWarning = `${await extractCloudflareErrorMessage(response)} Showing a fallback configuration.`;

				if (attempt < MAX_RETRIES && isRetryableStatus(response.status)) {
					continue;
				}

				break;
			}

			const payload = (await response.json()) as AiPayload;
			const modelText = extractModelText(payload);

			if (!modelText) {
				lastWarning = "";
				break;
			}

			const parsedOutput = parseModelResponse(modelText);

			if (!parsedOutput.success) {
				lastWarning = "";
				break;
			}

			const normalizedOutput = normalizeGenerationData(parsedOutput.data, userPrompt);
			const validatedOutput = generationResponseSchema.safeParse(normalizedOutput);

			if (!validatedOutput.success) {
				lastWarning = "";
				break;
			}

			return Response.json({
				success: true,
				data: normalizeGenerationData(validatedOutput.data, userPrompt),
			});
		} catch (error) {
			const isTimeout = error instanceof Error && error.name === "AbortError";
			lastWarning = isTimeout
				? `AI service timed out after ${Math.round(requestTimeoutMs / 1000)}s. Showing a fallback configuration.`
				: "AI service temporarily unavailable. Showing a fallback configuration.";

			if (attempt < MAX_RETRIES && isTimeout) {
				continue;
			}

			break;
		}
	}

	if (lastWarning) {
		return Response.json({
			success: true,
			data: fallback,
			warning: lastWarning,
		});
	}

	return Response.json({
		success: true,
		data: fallback,
	});
}
