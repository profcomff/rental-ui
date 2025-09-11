<script setup lang="ts">
import ItemTypeCardV2 from '@/components/ItemTypeCardV2.vue';
import UserTabs from '@/components/UserTabs.vue';
import { useItemStore, useUserSessions } from '@/store';
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';

const itemStore = useItemStore();
const { itemTypes, itemTypeLatestSession } = storeToRefs(itemStore);
const activeItemTypes = computed(() => {
	return itemTypes.value.filter(item => {
		const latestSession = itemTypeLatestSession.value[item.id];
		if (latestSession) return ['active', 'reserved', 'overdue'].includes(latestSession.status);
		return false;
	});
});
const itemTypesEven = computed(() => activeItemTypes.value.filter(i => i.id % 2 == 0));
const itemTypesOdd = computed(() => activeItemTypes.value.filter(i => i.id % 2 == 1));

const userSessions = useUserSessions();

onMounted(async () => {
	await itemStore.requestItemTypes();
	await userSessions.requestAvailable();
	itemStore.populateItemSessionMap(userSessions.availablePageSessions);
});
</script>

<template>
	<UserTabs current-tab="/active" />
	<div class="column-container">
		<v-col class="d-flex flex-column align-center pa-0">
			<ItemTypeCardV2
				v-for="item in itemTypesOdd"
				:key="item.id"
				:itemType="item"
				:session="itemTypeLatestSession[item.id]"
			/>
		</v-col>
		<v-col class="d-flex flex-column align-center pa-0">
			<ItemTypeCardV2
				v-for="item in itemTypesEven"
				:key="item.id"
				:itemType="item"
				:session="itemTypeLatestSession[item.id]"
			/>
		</v-col>
	</div>
</template>

<style lang="css" scoped>
.column-container {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-column-gap: 8px;
}
</style>
