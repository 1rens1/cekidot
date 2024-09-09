import { goto } from '$app/navigation';
import { isValidUrl } from '$lib/utils';
import type { EventHandler } from 'svelte/elements';

export const handleSubmit: EventHandler<SubmitEvent, HTMLFormElement> = (e) => {
	const data = new FormData(e.target as HTMLFormElement);

	let url = data.get('url') as string | null | undefined;
	console.log(url);

	if (!url) {
		return;
	}
	if (!/^https?:\/\//gi.test(url)) {
		url = 'https://' + url;
	}
	console.log(url);
	if (!isValidUrl(url)) {
		return;
	}

	goto('/' + url);
};
