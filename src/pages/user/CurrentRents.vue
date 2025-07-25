<script setup lang="ts">
import UserTabs from '@/components/UserTabs.vue';
import { computed } from 'vue';
import { useUserRentalStore } from '@/store';
import UserItemButton from '@/components/UserItemButton.vue';
import { testItemType } from '@/constants/mockData';
import TextTimer from '@/components/TextTimer.vue';

const userRentalStore = useUserRentalStore();
const activeSessions = computed(() => userRentalStore.activeSessions);
const reservedSessions = computed(() => userRentalStore.reservedSessions);
</script>

<template>
	<UserTabs current-tab="/active" />
	<h1>Активные сессии</h1>
	<ol>
		<li v-for="session in activeSessions" :key="session.id">
			{{ session.id }}: {{ session.item_id }}, {{ session.reservation_ts }} | {{ session.status }}
		</li>
	</ol>
	<hr />
	<h1>Забронированные сессии</h1>
	<ol>
		<li v-for="session in reservedSessions" :key="session.id">
			{{ session.id }}: {{ session.reservation_ts }} | dismissed in
			<TextTimer
				:start-time="new Date(session.reservation_ts + 'Z')"
				@time-ran-out="console.log('Время вышло, тут можно что-то сделать')"
			/>
			<UserItemButton :item-type="testItemType" :rental-session="session" />
		</li>
	</ol>
</template>
