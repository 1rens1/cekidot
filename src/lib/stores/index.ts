import { uuidv4 } from '$lib';
import { persisted } from 'svelte-persisted-store';
import { writable } from 'svelte/store';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export interface Toast {
	id: string;
	type: 'success' | 'error' | 'info';
	title: string;
	message?: string;
}

export const toasts = writable<Toast[]>([]);

export const addToast = (toast: Optional<Toast, 'id'>) => {
	const id = uuidv4();

	toasts.update((t) => [{ id, ...toast }, ...t]);
};

export const dismissToast = (id: string) => {
	toasts.update((all) => all.filter((t) => t.id !== id));
};

export const OPENFIRSTLINK_KEY = 'cekidot.openfirstlink'
export const openFirstLink = persisted(OPENFIRSTLINK_KEY, true)

export const scanScore = writable<number>(100);