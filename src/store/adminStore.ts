import apiClient from '@/api';
import { Event, RentalSession } from '@/models/index';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useToastStore } from './toastStore';

export const useAdminStore = defineStore('admin', () => {
	const toastStore = useToastStore();

	const reservedPageSessions = ref<RentalSession[]>([]);
	const activePageSessions = ref<RentalSession[]>([]);
	const finishedPageSessions = ref<RentalSession[]>([]);
	const cancelledPageSessions = ref<RentalSession[]>([]);

	const allEvents = ref<Event[]>([]);

	async function requestReservedPageSessions() {
		const { data, error } = await apiClient.GET('/rental/rental-sessions', {
			params: { query: { is_reserved: true } },
		});
		if (error) {
			toastStore.error({ title: 'error when getting requested sessions', description: error.detail });
			return;
		}
		reservedPageSessions.value = data;
	}

	async function startSession(session_id: number) {
		const { data, error } = await apiClient.PATCH('/rental/rental-sessions/{session_id}/start', {
			params: { path: { session_id } },
		});
		if (error) {
			toastStore.error({ title: 'error when getting requested sessions', description: error.detail });
			return;
		}
		toastStore.success({ title: `Сессия ${data.id} начата` });
	}

	async function dismissSession(session_id: number) {
		const { data, error } = await apiClient.PATCH('/rental/rental-sessions/{session_id}', {
			params: { path: { session_id } },
			body: {
				status: 'dismissed',
			},
		});
		if (error) {
			toastStore.error({ title: 'error when dismissing session, ', description: error.detail });
			return;
		}
		toastStore.warning({ title: `Сессия ${data.id} отменена` });
	}

	async function requestActivePageSessions(user_id?: number) {
		const { data, error } = await apiClient.GET('/rental/rental-sessions', {
			params: {
				query: {
					is_active: true,
					is_overdue: true,
					user_id,
				},
			},
		});
		if (error) {
			toastStore.error({
				title: 'error when requesting active page sessions',
				description: error.detail,
			});
			return;
		}
		activePageSessions.value = data;
	}

	async function returnSession(session_id: number) {
		const { data, error } = await apiClient.PATCH('/rental/rental-sessions/{session_id}/return', {
			params: { path: { session_id } },
		});
		if (error) {
			toastStore.error({ title: 'error when confirming return', description: error.detail });
			return;
		}
		toastStore.success({ title: `Сессия ${data.id} завершена` });
	}

	async function returnWithStrikeSession(session_id: number, strike_reason: string) {
		const { data, error } = await apiClient.PATCH('/rental/rental-sessions/{session_id}/return', {
			params: {
				path: { session_id },
				query: {
					with_strike: true,
					strike_reason,
				},
			},
		});
		if (error) {
			toastStore.error({
				title: 'error when trying to confirm return with strike',
				description: error.detail,
			});
			return;
		}
		toastStore.success({ title: `Сессия ${data.id} завершена со страйком ${data.strike_id}` });
	}

	async function requestFinishedPageSessions(user_id?: number) {
		const { data, error } = await apiClient.GET('/rental/rental-sessions', {
			params: {
				query: {
					is_returned: true,
					user_id,
				},
			},
		});
		if (error) {
			toastStore.error({
				title: 'error when requesting finished sessions',
				description: error.detail,
			});
			return;
		}
		finishedPageSessions.value = data;
	}

	async function requestCancelledPageSessions(user_id?: number) {
		const { data, error } = await apiClient.GET('/rental/rental-sessions', {
			params: {
				query: {
					is_canceled: true,
					is_dismissed: true,
					is_expired: true,
					user_id,
				},
			},
		});
		if (error) {
			toastStore.error({
				title: 'error when requesting cancelled sessions',
				description: error.detail,
			});
			return;
		}
		cancelledPageSessions.value = data;
	}

	async function requestEvents() {
		const { data, error } = await apiClient.GET('/rental/event');

		if (error) {
			toastStore.error({ title: 'Ошибка при попытке получить ивенты', description: error.detail });
			return;
		}

		allEvents.value = data ?? [];
	}

	return {
		reservedPageSessions,
		requestReservedPageSessions,
		startSession,

		activePageSessions,
		requestActivePageSessions,
		returnSession,
		returnWithStrikeSession,

		finishedPageSessions,
		cancelledPageSessions,
		requestFinishedPageSessions,
		requestCancelledPageSessions,

		dismissSession,

		allEvents,
		requestEvents,
	};
});
