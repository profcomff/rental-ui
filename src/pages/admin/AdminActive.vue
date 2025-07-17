<script setup lang="ts">
import AdminTabs from '@/components/AdminTabs.vue';
import { useAdminStore } from '@/store';
import { onMounted } from 'vue';
import apiClient from '@/api';

onMounted(async () => {
	await requestAllSessions();
});

const { requestAllSessions, sessionsByStatus } = useAdminStore();

async function confirmReturn(session_id: number, with_strike?: boolean, strike_reason?: string) {
	const { response, data, error } = await apiClient.PATCH('/rental/rental-sessions/{session_id}/return', {
		params: {
			path: { session_id },
			query: {
				with_strike,
				strike_reason,
			},
		},
	});

	if (!response.ok && error) {
		console.log('Ошибка при попытке одобрить возврат предмета: ', error);
	} else if (data) {
		console.log('Сессия успешно завершена: ', data);
		await requestAllSessions();
	}
}
</script>

<template>
	<AdminTabs current-tab="/admin/active" />
	<h2>Активные</h2>
	<ul>
		<li v-for="session in sessionsByStatus.active" :key="session.id">
			{{ session.id }}. Пользователь {{ session.user_id }}, предмет {{ session.item_id }}, бронь с
			{{ session.reservation_ts }} | {{ session.status }}
			<v-btn text="Принять возврат" color="secondary" @click="confirmReturn(session.id)" />
		</li>
	</ul>
</template>
