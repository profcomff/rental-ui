<script setup lang="ts">
import UserTabs from '@/components/UserTabs.vue';

import { useUserRentalStore } from '@/store';
import { computed } from 'vue';

const userRentalStore = useUserRentalStore();
const inactiveSessions = computed(() => userRentalStore.inactiveSessions);
</script>

<template>
	<UserTabs current-tab="/log" />
	<h1>Журнал сессий</h1>
	<ol>
		<li v-for="session in inactiveSessions" :key="session.id">
			{{ session.id }}: {{ session.item_id }}, {{ session.end_ts || 'Not ended' }} | {{ session.status }}
		</li>
	</ol>
</template>
