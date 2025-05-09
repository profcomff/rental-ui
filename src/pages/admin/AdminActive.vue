<script setup lang="ts">
// import apiClient from '@/api';
import { useItemStore } from '@/store/itemStore';
import { computed } from 'vue';
import { convertTsToHHMM } from '@/utils';
import { useTestStore } from '@/store/testRequestStore';
import AdminTabs from '@/components/AdminTabs.vue';

const itemStore = useItemStore();
const testStore = useTestStore();

const requestedItems = computed(() => {
	return Array.from(testStore.getActiveSessions(), x => itemStore.getItemType(x.item_id));
});

function closeWithStrike(sessionId: number) {
	console.log(testStore.createStrike(177, 177, 'шизофрения', sessionId));
	console.log(testStore.closeSession(sessionId, 177));
}

function closeSession(sessionId: number) {
	console.log(testStore.closeSession(sessionId, 177));
}
</script>

<template>
	<AdminTabs current-tab="/admin/active" />
	<v-data-iterator :items="testStore.getActiveSessions()">
		<template #default="{ items: requests }">
			<v-card v-for="(req, idx) in requests" :key="req.raw.id">
				<template #title> {{ req.raw.user_id }} (айди пока нет юзердаты) </template>

				<template #subtitle>
					{{ requestedItems[idx]?.name }}
					<v-divider />
					<p>время брони: {{ convertTsToHHMM(req.raw.reservation_ts) }}</p>
					<p>время старта: {{ convertTsToHHMM(req.raw.start_ts) }}</p>
					<p>время окончания (запланированное): {{ convertTsToHHMM(req.raw.end_ts) }}</p>
				</template>

				<template #prepend>
					<v-img :src="requestedItems[idx]?.image_url ?? ''" width="100px" />
				</template>

				<template #actions>
					<v-btn text="выдать страйк" @click="closeWithStrike(req.raw.id)" />
					<v-btn text="завершить прокат" @click="closeSession(req.raw.id)" />
				</template>
			</v-card>
		</template>
	</v-data-iterator>
</template>
