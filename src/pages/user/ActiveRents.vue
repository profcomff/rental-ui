<script setup lang="ts">
import UserTabs from '@/components/UserTabs.vue';
import { onMounted } from 'vue';
import { useUserSessions } from '@/store';
import UserItemButton from '@/components/UserItemButton.vue';
import { testItemType } from '@/constants/mockData';
import TextTimer from '@/components/TextTimer.vue';

const userRentalStore = useUserSessions();

onMounted(userRentalStore.requestActive());
</script>

<template>
	<UserTabs current-tab="/active" />
	<h1>Активные сессии</h1>
	<ol>
		<li v-for="session in userRentalStore.activePageSessions" :key="session.id">
			{{ session.id }}: {{ session.item_id }}, {{ session.reservation_ts }} | {{ session.status }}
		</li>
	</ol>
	<hr />
	<h1>Забронированные сессии</h1>
	<ol>
		<li v-for="session in userRentalStore.activePageSessions" :key="session.id">
			{{ session.id }}: {{ session.reservation_ts }} | dismissed in
			<TextTimer
				:start-time="new Date(session.reservation_ts + 'Z')"
				@time-ran-out="console.log('Время вышло, тут можно что-то сделать')"
			/>
			<UserItemButton :item-type="testItemType" :rental-session="session" />
		</li>
	</ol>
</template>
