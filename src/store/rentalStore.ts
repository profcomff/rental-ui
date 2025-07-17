import { RentalSession } from '@/models';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '@/api';

export const useUserRentalStore = defineStore('rental', () => {
	const allSessions = ref<RentalSession[]>([]);
	const activeSessions = computed(() => allSessions.value.filter(i => i.status == 'active'));
	const reservedSessions = computed(() => allSessions.value.filter(i => i.status == 'reserved'));
	const inactiveSessions = computed(() => allSessions.value.filter(i => !['active', 'reserved'].includes(i.status)));

	async function requestUserSessions() {
		const user_id = 177;
		if (!user_id) {
			console.log('Пользователь не авторизован');
			return;
		}

		const { response, data, error } = await apiClient.GET('/rental/rental-sessions/user/{user_id}', {
			params: { path: { user_id } },
		});

		if (!response.ok && error) {
			console.log('Ошибка при попытке запросить сессии', error);
			return false;
		}

		if (data) {
			allSessions.value = data;
		}

		return true;
	}

	return {
		allSessions,
		activeSessions,
		reservedSessions,
		inactiveSessions,
		requestUserSessions,
	};
});
