import { RentalSession, RentalStatus } from '@/models';
import { defineStore } from 'pinia';
import apiClient from '@/api';
import { ref } from 'vue';
import { useToastStore } from './toastStore';
import { useItemStore } from './itemStore';

export const useUserSessions = defineStore('user-sessions', () => {
	const toastStore = useToastStore();
	const itemStore = useItemStore();

	const availablePageSessions = ref<RentalSession[]>([]);
	const activePageSessions = ref<RentalSession[]>([]);
	const journalPageSessions = ref<RentalSession[]>([]);

	async function requestAvailable() {
		availablePageSessions.value = await _requestSessions(['active', 'canceled', 'reserved', 'overdue']);
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
			toastStore.error({
				title: 'Ошибка при попытке забронировать предмет',
				description: error.detail,
			});
			return;
		}
		toastStore.success({
			title: `Предмет ${itemStore.itemTypes.find(i => i.id === item_type_id)?.name ?? item_type_id} забронирован`,
		});
		return data;
	}

	async function cancelReservation(session_id: number) {
		const { data, error } = await apiClient.DELETE('/rental/rental-sessions/{session_id}/cancel', {
			params: { path: { session_id } },
		});
		if (error) {
			toastStore.error({ title: 'Ошибка при попытке отменить сессию', description: error.detail });
			return;
		}
		toastStore.success({
			title: `Бронь ${session_id} отменена`,
		});
		return data;
	}

	type _StatusOptions = Partial<{ [T in RentalStatus as `$is_{T}`]: boolean }>;

	function _createOptions(statuses: RentalStatus[]): _StatusOptions {
		const result = {} as _StatusOptions;
		for (const status of statuses) {
			result[`is_${status}` as keyof _StatusOptions] = true;
		}
		console.log(result);
		return result;
	}

	async function _requestSessions(statuses: RentalStatus[]): Promise<RentalSession[]> {
		const { data, error } = await apiClient.GET('/rental/rental-sessions/user/me', {
			params: { query: { ..._createOptions(statuses) } as never },
		});
		if (error) {
			console.log(error);
			toastStore.error({ title: 'error when requesting user sessions', description: error.detail });
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
