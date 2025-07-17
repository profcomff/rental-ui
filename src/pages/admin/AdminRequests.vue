<script setup lang="ts">
import apiClient from '@/api';
import AdminTabs from '@/components/AdminTabs.vue';
import { useAdminStore, useProfileStore } from '@/store';
import { getCurrentTs } from '@/utils';
import { onMounted } from 'vue';

const { id: user_id } = useProfileStore();

onMounted(async () => {
	await requestAllSessions();
});

const { sessionsByStatus, requestAllSessions } = useAdminStore();

async function dismissSession(session_id: number) {
	const { response, data, error } = await apiClient.PATCH('/rental/rental-sessions/{session_id}', {
		params: {
			path: { session_id },
		},
		body: {
			status: 'dismissed',
			end_ts: getCurrentTs(),
			admin_close_id: user_id,
		},
	});

	if (!response.ok && error) {
		console.log('Ошибка при попытке отказать в бронировании: ', error);
	} else if (data) {
		console.log('Сессия отменена: ', data);
		await requestAllSessions();
	}
}

async function startRentalSession(session_id: number) {
	const { response, data, error } = await apiClient.PATCH('/rental/rental-sessions/{session_id}/start', {
		params: { path: { session_id } },
	});

	if (!response.ok && error) {
		console.log('Ошибка при попытке начать сессию: ', error);
	} else if (data) {
		console.log('Выдача предмета прошла успешно: ', error);
		await requestAllSessions();
	}
}

getCurrentTs();
</script>

<template>
	<AdminTabs current-tab="/admin/requests" />
	<h2>Бронь</h2>
	<ul>
		<li v-for="session in sessionsByStatus.reserved" :key="session.id">
			{{ session.id }}. Пользователь {{ session.user_id }}, предмет {{ session.item_id }}, бронь с
			{{ session.reservation_ts }} | {{ session.status }} |
			<v-btn text="Отменить" color="secondary" @click="dismissSession(session.id)" />
			<v-btn text="Выдать" color="primary" @click="startRentalSession(session.id)" />
		</li>
	</ul>
	<h2>Просроченные (Бронь, временно)</h2>
	<ul>
		<li v-for="session in sessionsByStatus.overdue" :key="session.id">
			{{ session.id }}. Пользователь {{ session.user_id }}, предмет {{ session.item_id }}, бронь с
			{{ session.reservation_ts }} | {{ session.status }}
			<v-btn text="Отменить" color="secondary" @click="dismissSession(session.id)" />
		</li>
	</ul>
</template>
