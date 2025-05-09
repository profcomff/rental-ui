<script setup lang="ts">
import AdminTabs from '@/components/AdminTabs.vue';
import { ref, computed } from 'vue';
import { useTestStore } from '@/store/testRequestStore';
import { useItemStore } from '@/store/itemStore';
import { RentalSession } from '@/models';
import { convertTsToHHMM } from '@/utils';
import apiClient from '@/api';

const testStore = useTestStore();
const itemStore = useItemStore();
const selectedSessions = ref<RentalSession[]>([]);

const requestedItems = computed(() => {
	return Array.from(selectedSessions.value, x => itemStore.getItemType(x.item_id));
});

const search = ref('');
const tab = ref('all');

async function getCompleteSessions() {
	const { response, data, error } = await apiClient.GET('/rental/rental-sessions', {
		params: {
			query: {
				is_canceled: true,
				is_dismissed: true,
				is_overdue: true,
				is_returned: true,
			},
		},
	});

	if (!response.ok && error) {
		console.log('tried to get all non-active and non-request sessions', error);
	}

	if (data) {
		selectedSessions.value = data;
	}
}

async function changeTabs(tab: string) {
	if (tab == 'all') {
		await getCompleteSessions();
	}
	if (tab == 'strikes') {
		selectedSessions.value = testStore.getStrikedSessions();
	}
}
</script>

<template>
	<AdminTabs current-tab="/admin/log" />
	<v-text-field v-model="search" single-line hide-details="auto" placeholder="Поиск" density="compact" />
	<v-tabs v-model="tab" @update:model-value="changeTabs(tab)">
		<v-tab value="all">все</v-tab>
		<v-tab value="strikes">страйки</v-tab>
	</v-tabs>
	<v-data-iterator :items="selectedSessions">
		<template #default="{ items: sessions }">
			<v-card
				v-for="(session, idx) in sessions"
				class="allow-overflow"
				:key="session.raw.id"
				@click="$router.push(`/admin/session/${session.raw.id}`)"
			>
				<div v-if="session.raw.strike_id != null" class="strike-dot"></div>

				<template #title> {{ session.raw.user_id }} (айди пока нет юзердаты) </template>

				<template #subtitle>
					{{ requestedItems[idx]?.name }}
					<v-divider />
					<p>время начала: {{ convertTsToHHMM(session.raw.start_ts) }}</p>
					<p>время сдачи: {{ convertTsToHHMM(session.raw.end_ts) }}</p>
				</template>

				<template #prepend>
					<v-img :src="requestedItems[idx]?.image_url ?? ''" width="100px" />
				</template>
			</v-card>
		</template>
	</v-data-iterator>
</template>

<style scoped>
.strike-dot {
	position: absolute;
	top: 0;
	right: 0;
	margin-right: -2%;
	margin-top: -1%;
	background-color: red;
	border-radius: 100%;
	width: 2rem;
	height: 2rem;
}

.allow-overflow {
	overflow: visible;
}
</style>
