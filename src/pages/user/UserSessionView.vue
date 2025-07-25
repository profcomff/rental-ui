<script setup lang="ts">
import SessionInfo from '@/components/SessionInfo.vue';
import { ref, onBeforeMount } from 'vue';
import apiClient from '@/api';
import { RentalSession } from '@/models';
import { useRoute } from 'vue-router';

const session = ref<RentalSession>();
console.log('HI');

onBeforeMount(async () => {
	const { params } = useRoute();
	const session_id = params.sessionId instanceof Array ? Number(params.sessionId[0]) : Number(params.sessionId);
	const { data, error } = await apiClient.GET('/rental/rental-sessions/{session_id}', {
		params: { path: { session_id } },
	});

	if (error) {
		console.log('Ошибка при попытке запроса сессии:', error);
	}

	console.log(data);
	session.value = data;
});
</script>

<template>
	<template v-if="session">
		<SessionInfo :session="session" />
	</template>
</template>

<style lang="css" scoped></style>
