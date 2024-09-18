import type { Handler } from '@netlify/functions';
import puppeteer from 'puppeteer-core';
import { config } from 'dotenv';
config();

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

		const browser = await puppeteer.connect({
			browserWSEndpoint: process.env.CHROME_WS_ENDPOINT,
			defaultViewport: { width: 800, height: 600 }
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
	} catch (e) {
		console.log(e);
		return {
			statusCode: 400,
			body: JSON.stringify({
				success: false,
				message: 'An unexpected error occured',
				error: e
			})
		};
	}
};
