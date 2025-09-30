<script setup lang="ts">
import ActiveSessionCard from '@/components/ActiveSessionCard.vue';
import UserTabs from '@/components/UserTabs.vue';
import { useItemStore, useUserSessions } from '@/store';
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';

const itemStore = useItemStore();
// const { itemTypes, itemTypeLatestSession } = storeToRefs(itemStore);
// const activeItemTypes = computed(() => {
// 	return itemTypes.value.filter(item => {
// 		const latestSession = itemTypeLatestSession.value[item.id];
// 		if (latestSession) return ['active', 'reserved', 'overdue'].includes(latestSession.status);
// 		return false;
// 	});
// });
// const itemTypesEven = computed(() => activeItemTypes.value.filter(i => i.id % 2 == 0));
// const itemTypesOdd = computed(() => activeItemTypes.value.filter(i => i.id % 2 == 1));

const userSessions = useUserSessions();
const { activePageSessions } = storeToRefs(userSessions);

const evenActivePageSessions = computed(() => activePageSessions.value.filter((_, idx) => idx % 2 === 0));
const oddActivePageSessions = computed(() => activePageSessions.value.filter((_, idx) => idx % 2 === 1));

onMounted(async () => {
	await itemStore.requestItemTypes();
	await userSessions.requestActive();
	console.log(activePageSessions.value);
});
</script>

<template>
	<UserTabs current-tab="/active" />
	<div v-if="activePageSessions.length > 0" class="column-container px-2">
		<v-col class="d-flex flex-column align-center pa-0">
			<ActiveSessionCard v-for="s in evenActivePageSessions" :key="s.id" :session="s" />
		</v-col>
		<v-col class="d-flex flex-column align-center pa-0">
			<ActiveSessionCard v-for="s in oddActivePageSessions" :key="s.id" :session="s" />
		</v-col>
	</div>
	<p v-else class="pa-2 font-weight-bold">Нет активных сессий!</p>
</template>

<style lang="css" scoped>
.column-container {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-column-gap: 8px;
}
</style>
