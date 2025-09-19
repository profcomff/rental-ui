<script setup lang="ts">
import apiClient from '@/api';
import { ItemType } from '@/models';
import { useItemStore } from '@/store';
import { onMounted, ref } from 'vue';

const props = defineProps<{
	itemType: ItemType;
}>();

const freeItems = ref(0);
onMounted(() => {
	freeItems.value = props.itemType.free_items_count ?? 0;
});

async function changeFreeItems() {
	const { data, error } = await apiClient.PATCH('/rental/itemtype/available/{id}', {
		params: { path: { id: props.itemType.id }, query: { count: freeItems.value } },
	});
	if (error) {
		console.log('error when setting free items, ', error);
		return;
	}
	freeItems.value = data.total_available;
}
</script>

<template>
	<v-card width="30vw" class="ma-2">
		<v-card-title class="text-wrap">{{ itemType.name }}</v-card-title>
		<v-img
			cover
			aspect-ratio="16/9"
			:height="`${(30 * 9) / 16}vw`"
			:src="useItemStore().constructPictureUrl(itemType.image_url)"
		></v-img>
		<v-card-actions>
			<v-number-input
				v-model="freeItems"
				control-variant="split"
				variant="outlined"
				hide-details="auto"
				bg-color="primary"
				icon-color="white"
				@change="changeFreeItems"
				@update:focused="changeFreeItems"
			>
			</v-number-input>
		</v-card-actions>
	</v-card>
</template>

<style lang="css" scoped></style>
