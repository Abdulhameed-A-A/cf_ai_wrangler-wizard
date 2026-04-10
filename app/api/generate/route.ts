export async function GET() {
	const { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN } = process.env;

	const response = await fetch(
		`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.2-3b-instruct`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ prompt: 'Generate a Wrangler configuration example' }),
		}
	);

	const data = await response.json();
	return Response.json(data);
}
