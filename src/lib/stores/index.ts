import { uuidv4 } from '$lib';
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
