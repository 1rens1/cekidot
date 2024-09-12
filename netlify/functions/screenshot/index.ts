import type { Handler } from '@netlify/functions';
import chromium from 'chrome-aws-lambda';

export const isValidUrl = (url: string) => {
	try {
		return Boolean(new URL(url));
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (e) {
		return false;
	}
};

export const handler: Handler = async (event) => {
	try {
		const targetUrl = JSON.parse(event.body!).url as string;

		if (!isValidUrl(targetUrl))
			return {
				statusCode: 400,
				body: JSON.stringify({
					success: false,
					message: 'Invalid url'
				})
			};

		const browser = await chromium.puppeteer.launch({
			args: chromium.args,
			defaultViewport: chromium.defaultViewport,
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
				success: true,
				message: `Complete screenshot of ${targetUrl}`,
				buffer: screenshot
			})
		};
	} catch (e) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				success: false,
				message: 'An unexpected error occurred'
			})
		};
	}
};
