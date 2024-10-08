export const themes = ['dark', 'light'];

export const isValidUrl = (url: string) => {
	try {
		return Boolean(new URL(url));
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (e) {
		return false;
	}
};

export const capFirst = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}