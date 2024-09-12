import type { Handler } from '@netlify/functions';
import chromium from 'chrome-aws-lambda';

const isValidUrl = (url: string) => {
	try {
		return Boolean(new URL(url));
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (e) {
		return false;
	}
};

export const handler: Handler = async (event) => {
	if (event.httpMethod !== 'POST')
		return {
			statusCode: 405,
			body: JSON.stringify({
				success: false,
				message: 'Method not allowed'
			})
		};
	try {
		const targetUrl = JSON.parse(event.body!).url as string;

		if (!isValidUrl(targetUrl))
			return {
				statusCode: 400,
				body: JSON.stringify({ success: false, message: 'Invalid url' })
			};

		const browser = await chromium.puppeteer.launch({
			args: chromium.args,
			defaultViewport: { ...chromium.defaultViewport, width: 800, height: 600 },
			executablePath: await chromium.executablePath,
			headless: chromium.headless
		});

		const page = await browser.newPage();

		await page.goto(targetUrl, { waitUntil: 'networkidle2' });

		const screenshot = await page.screenshot({ encoding: 'binary' });

		await browser.close();

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: `Complete screenshot of ${targetUrl}`,
				buffer: screenshot
			})
		};
	} catch {
		return {
			statusCode: 400,
			body: JSON.stringify({
				success: false,
				message: 'An unexpected error occured'
			})
		};
	}
};
