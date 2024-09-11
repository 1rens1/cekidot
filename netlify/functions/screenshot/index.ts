import type { Handler } from '@netlify/functions';
import chromium from 'chrome-aws-lambda';

export const handler: Handler = async (event) => {
	try {
		const pageToScreenshot = JSON.parse(event.body).pageToScreenshot;

		if (!pageToScreenshot)
			return {
				statusCode: 400,
				body: JSON.stringify({ message: 'Page URL not defined' })
			};

		const browser = await chromium.puppeteer.launch({
			args: chromium.args,
			defaultViewport: chromium.defaultViewport,
			executablePath: await chromium.executablePath,
			headless: chromium.headless
		});

		const page = await browser.newPage();

		await page.goto(pageToScreenshot, { waitUntil: 'networkidle2' });

		const screenshot = await page.screenshot({ encoding: 'binary' });

		await browser.close();

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: `Complete screenshot of ${pageToScreenshot}`,
				buffer: screenshot
			})
		};
	} catch (e) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: ''
			})
		};
	}
};