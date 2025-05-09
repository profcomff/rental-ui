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
	return Array.from(testStore.getRequestSessions(), x => itemStore.getItemType(x.item_id));
});

function dismissRequest(requestId: number) {
	console.log(testStore.dismissSession(requestId));
}

function approveRequest(requestId: number) {
	console.log(testStore.startSession(requestId, 177))
}
</script>

<template>
	<AdminTabs current-tab="/admin/requests"/>
	<v-data-iterator :items="testStore.getRequestSessions()">
		<template #default="{ items: requests }">
			<v-card v-for="(req, idx) in requests" :key="req.raw.id">
				<template #title> {{ req.raw.user_id }} (айди пока нет юзердаты) </template>

				<template #subtitle>
					{{ requestedItems[idx]?.name }} | В наличии: 7
					<v-divider />
					<p>страйки: 0 (тут типа ручка)</p>
					<p>время: {{ convertTsToHHMM(req.raw.reservation_ts) }}</p>
				</template>

				<template #prepend>
					<v-img :src="requestedItems[idx]?.image_url ?? ''" width="100px" />
				</template>

				<template #actions>
					<v-btn text="отклонить" @click="dismissRequest(req.raw.id)" />
					<v-btn text="одобрить" @click="approveRequest(req.raw.id)" />
				</template>
			</v-card>
		</template>
	</v-data-iterator>
</template>
