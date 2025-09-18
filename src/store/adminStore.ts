import apiClient from '@/api';
import { Event, RentalSession } from '@/models/index';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAdminStore = defineStore('admin', () => {
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
			console.log('error when getting requested sessions' + error);
			return;
		}
		reservedPageSessions.value = data;
	}

	async function startSession(session_id: number) {
		const { data, error } = await apiClient.PATCH('/rental/rental-sessions/{session_id}/start', {
			params: { path: { session_id } },
		});
		if (error) {
			console.log('error when getting requested sessions' + error);
			return;
		}
		console.log(data);
	}

	async function dismissSession(session_id: number) {
		const { data, error } = await apiClient.PATCH('/rental/rental-sessions/{session_id}', {
			params: { path: { session_id } },
			body: {
				status: 'dismissed',
			},
		});
		if (error) {
			console.log('error when dismissing session, ' + error);
			return;
		}
		console.log(data);
	}

	async function requestActivePageSessions() {
		const { data, error } = await apiClient.GET('/rental/rental-sessions', {
			params: {
				query: {
					is_active: true,
					is_overdue: true,
				},
			},
		});
		if (error) {
			console.log('error when requesting active page sessions' + error);
			return;
		}
		activePageSessions.value = data;
	}

	async function returnSession(session_id: number) {
		const { data, error } = await apiClient.PATCH('/rental/rental-sessions/{session_id}/return', {
			params: { path: { session_id } },
		});
		if (error) {
			console.log('error when confirming return' + error);
			return;
		}
		console.log(data);
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
			console.log('error when trying to confirm return with strike', error);
			return;
		}
		console.log(data);
	}

	async function requestFinishedPageSessions() {
		const { data, error } = await apiClient.GET('/rental/rental-sessions', {
			params: {
				query: {
					is_returned: true,
				},
			},
		});
		if (error) {
			console.log('error when requesting finished sessions', error);
			return;
		}
		finishedPageSessions.value = data;
	}

	async function requestCancelledPageSessions() {
		const { data, error } = await apiClient.GET('/rental/rental-sessions', {
			params: {
				query: {
					is_canceled: true,
					is_dismissed: true,
					is_expired: true,
				},
			},
		});
		if (error) {
			console.log('error when requesting cancelled sessions', error);
			return;
		}
		cancelledPageSessions.value = data;
	}

	async function requestEvents() {
		const { response, data, error } = await apiClient.GET('/rental/event');

		if (!response.ok && error) {
			console.log('Ошибка при попытке получить ивенты', error);
			return;
		}

		allEvents.value = data ?? [];
	}

	async function makeAllAvailable() {
		const { data, error } = await apiClient.GET('/rental/item');
		if (error) {
			console.log('error when getting all items' + error);
			return;
		}
		for (const i of data) {
			const { error: itemError } = await apiClient.PATCH('/rental/item/{id}', {
				params: { path: { id: i.id }, query: { is_available: true } },
			});
			if (itemError) {
				console.log('Could not make item' + i.id + 'available');
			}
		}
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

		makeAllAvailable,
	};
});
