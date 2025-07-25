<script setup lang="ts">
import apiClient from '@/api';
import { RentalSession, Strike } from '@/models';
import { onMounted, ref } from 'vue';

const { session } = defineProps<{ session: RentalSession }>();

const strikes = ref<Strike[]>([]);

onMounted(async () => {
	const { data, error } = await apiClient.GET('/rental/strike', {
		params: { query: { session_id: session.id } },
	});

	if (error) {
		console.log('Ошибка при попытке получить страйки для сессии', error);
	}

	strikes.value = data!;
});
</script>

<template>
	<template v-if="session">
		<h1>Сессия {{ session.id }} | {{ session.status }}</h1>
		<p>Предмет {{ session.item_id }}</p>
		<p>Бронь: {{ session.reservation_ts }}</p>
		<p>Начало проката: {{ session.start_ts }}</p>
		<p>Окончание проката (по плану): {{ session.end_ts }}</p>
		<p>Окончание проката (по факту): {{ session.actual_return_ts }}</p>

		<p v-if="strikes">Страйки:</p>
		<ul>
			<li v-for="strike in strikes" :key="strike.id">{{ strike.id }}, {{ strike.reason }}</li>
		</ul>
	</template>
</template>
