import { RentalSession, RentalStatus } from '@/models';
import { defineStore } from 'pinia';
import apiClient from '@/api';
import { ref } from 'vue';

export const useUserSessions = defineStore('user-sessions', () => {
	const availablePageSessions = ref<RentalSession[]>([]);
	const activePageSessions = ref<RentalSession[]>([]);
	const journalPageSessions = ref<RentalSession[]>([]);

	async function requestAvailable() {
		availablePageSessions.value = await _requestSessions(['active', 'canceled', 'reserved', 'overdue']);
		console.log(availablePageSessions.value);
	}

	async function requestActive() {
		activePageSessions.value = await _requestSessions(['active', 'reserved', 'overdue']);
	}

	async function requestJournal() {
		journalPageSessions.value = await _requestSessions(['canceled', 'dismissed', 'returned']);
	}

	async function reserveItem(item_type_id: number) {
		const { data, error } = await apiClient.POST('/rental/rental-sessions/{item_type_id}', {
			params: { path: { item_type_id } },
		});
		if (error) {
			console.log('Ошибка при попытке забронировать предмет', error);
			return;
		}
		console.log(data);
		return data;
	}

	async function cancelReservation(session_id: number) {
		const { data, error } = await apiClient.DELETE('/rental/rental-sessions/{session_id}/cancel', {
			params: { path: { session_id } },
		});
		if (error) {
			console.log('Ошибка при попытке отменить сессию', error);
			return;
		}
		console.log(data);
		return data;
	}

	type _StatusOptions = Partial<{ [T in RentalStatus as `$is_{T}`]: boolean }>;

	function _createOptions(statuses: RentalStatus[]): _StatusOptions {
		const result = {} as _StatusOptions;
		for (const status of statuses) {
			result[status as keyof _StatusOptions] = true;
		}
		return result;
	}

	async function _requestSessions(statuses: RentalStatus[]): Promise<RentalSession[]> {
		const { data, error } = await apiClient.GET('/rental/rental-sessions/user/me', {
			params: { query: { ..._createOptions(statuses) } },
		});
		if (error) {
			console.log('error when requesting user sessions', error);
			return [];
		}
		return (data as RentalSession[]).sort((a, b) => Date.parse(b.reservation_ts) - Date.parse(a.reservation_ts));
	}

	return {
		availablePageSessions,
		activePageSessions,
		journalPageSessions,
		requestActive,
		requestAvailable,
		requestJournal,

		reserveItem,
		cancelReservation,
	};
});
