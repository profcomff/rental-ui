import { defineStore } from 'pinia';
import { ref } from 'vue';

export type Toast = {
	id: number;
	title: string;
	description?: string;
	state: 'success' | 'error' | 'warning';
	timeout?: number;
};

let id = 0;

export const useToastStore = defineStore('toast', () => {
	const queue = ref<Toast[]>([]);

	function success(toast: Omit<Toast, 'id' | 'state'>) {
		_add({ ...toast, state: 'success' });
	}

	function warning(toast: Omit<Toast, 'id' | 'state'>) {
		_add({ ...toast, state: 'warning' });
	}

	function error(toast: Omit<Toast, 'id' | 'state'>) {
		_add({ ...toast, state: 'error' });
	}

	function _add(toast: Omit<Toast, 'id'>) {
		queue.value.push({ id: ++id, timeout: 3000, ...toast });
	}

	function _remove(id: number) {
		queue.value = queue.value.filter(t => t.id !== id);
	}

	return {
		queue,
		_remove,
		success,
		warning,
		error,
	};
});
