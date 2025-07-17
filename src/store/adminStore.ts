import apiClient from '@/api';
import { Event, RentalSession, RentalStatus } from '@/models/index';
import { defineStore } from 'pinia';
import { ref, Ref, watch } from 'vue';

export const useAdminStore = defineStore('admin', () => {
	const allSessions = ref<RentalSession[]>([]);
	const reservedSessions = ref<RentalSession[]>([]);
	const canceledSessions = ref<RentalSession[]>([]);
	const dismissedSessions = ref<RentalSession[]>([]);
	const activeSessions = ref<RentalSession[]>([]);
	const overdueSessions = ref<RentalSession[]>([]);
	const returnedSessions = ref<RentalSession[]>([]);

	const allEvents = ref<Event[]>([]);

	const sessionsByStatus: Record<RentalStatus, Ref<RentalSession[]>> = {
		reserved: reservedSessions,
		canceled: canceledSessions,
		dismissed: dismissedSessions,
		active: activeSessions,
		overdue: overdueSessions,
		returned: returnedSessions,
	};

	watch(allSessions, value => {
		let type: keyof typeof sessionsByStatus;
		for (type in sessionsByStatus) {
			sessionsByStatus[type].value = value.filter(s => s.status == type);
		}
	});

	async function requestAllSessions() {
		const { response, data, error } = await apiClient.GET('/rental/rental-sessions', {
			params: {
				query: {
					is_reserved: true,
					is_canceled: true,
					is_dismissed: true,
					is_active: true,
					is_overdue: true,
					is_returned: true,
				},
			},
		});

		if (!response.ok && error) {
			console.log('Что-то не так с запросом всех сессий: ', error);
			return;
		}

		allSessions.value = data ?? [];

		return true;
	}

	async function requestSessions(session_statuses: RentalStatus[]) {
		const sessionStatusQuery = {
			is_reserved: session_statuses.includes('reserved') ? true : false,
			is_canceled: session_statuses.includes('canceled') ? true : false,
			is_dismissed: session_statuses.includes('dismissed') ? true : false,
			is_active: session_statuses.includes('active') ? true : false,
			is_overdue: session_statuses.includes('overdue') ? true : false,
			is_returned: session_statuses.includes('returned') ? true : false,
		};

		const { response, data, error } = await apiClient.GET('/rental/rental-sessions', {
			params: { query: { ...sessionStatusQuery } },
		});

		if (!response.ok && error) {
			console.log('Ошибка при запросе сессий со статусами', session_statuses, error);
			return;
		}

		for (const status in session_statuses) {
			sessionsByStatus[status as RentalStatus].value = data?.filter(s => s.status == status) ?? [];
		}
	}

	async function requestEvents() {
		const { response, data, error } = await apiClient.GET('/rental/event');

		if (!response.ok && error) {
			console.log('Ошибка при попытке получить ивенты', error);
			return;
		}

		allEvents.value = data ?? [];
	}

	return {
		allSessions,
		sessionsByStatus,
		requestAllSessions,
		requestSessions,

		allEvents,
		requestEvents,
	};
});
