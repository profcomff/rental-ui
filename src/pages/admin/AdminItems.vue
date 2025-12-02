<script setup lang="ts">
import AdminItemCard from '@/components/AdminItemCard.vue';
import AdminTabs from '@/components/AdminTabs.vue';
import { useItemStore } from '@/store';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const itemStore = useItemStore();
const { itemTypes } = storeToRefs(itemStore);

onMounted(itemStore.requestItemTypes);
</script>

<template>
	<AdminTabs current-tab="/admin/items" />
	<div class="d-flex flex-wrap justify-center">
		<AdminItemCard class="flex-grow-1 flex-shrink-1" v-for="i in itemTypes" :key="i.id" :item-type="i" />
	</div>
</template>

<style lang="css" scoped></style>
