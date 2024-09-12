export const themes = ['dark', 'light'];

export const isValidUrl = (url: string) => {
	try {
		return Boolean(new URL(url));
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (e) {
		return false;
	}
};
export const  bufferToImageUrl = (buffer: Buffer) => {
	// See https://gist.github.com/candycode/f18ae1767b2b0aba568e

	var arrayBufferView = new Uint8Array(buffer);
	var blob = new Blob([arrayBufferView], { type: 'image/jpeg' });
	var urlCreator = window.URL || window.webkitURL;
	var imageUrl = urlCreator.createObjectURL(blob);

	return imageUrl;
}