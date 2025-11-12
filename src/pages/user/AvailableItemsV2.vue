<script setup lang="ts">
import AvailableItemCard from '@/components/AvailableItemCard.vue';
import UserTabs from '@/components/UserTabs.vue';
import { useItemStore } from '@/store';
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';

const itemStore = useItemStore();
const { itemTypes } = storeToRefs(itemStore);
const availableItemTypes = computed(() => itemTypes.value);
const itemTypesEven = computed(() => availableItemTypes.value.filter((_, idx) => idx % 2 === 0));
const itemTypesOdd = computed(() => availableItemTypes.value.filter((_, idx) => idx % 2 === 1));

onMounted(async () => {
	await itemStore.requestItemTypes();
});
</script>

<template>
	<UserTabs current-tab="/" />
	<div class="column-container px-2" style="margin-top: 100px">
		<v-col class="d-flex flex-column align-center pa-0">
			<AvailableItemCard v-for="item in itemTypesEven" :key="item.id" :itemType="item" />
		</v-col>
		<v-col class="d-flex flex-column align-center pa-0">
			<AvailableItemCard v-for="item in itemTypesOdd" :key="item.id" :itemType="item" />
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
