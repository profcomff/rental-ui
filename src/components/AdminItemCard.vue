<script setup lang="ts">
import apiClient from '@/api';
import { ItemType } from '@/models';
import { useItemStore, useToastStore } from '@/store';
import { onMounted, ref } from 'vue';

const toastStore = useToastStore();

const props = defineProps<{
	itemType: ItemType;
}>();

const freeItems = ref(0);
const itemWasChanged = ref(false);

onMounted(() => {
	freeItems.value = props.itemType.available_items_count ?? 0;
});

async function setItems() {
	const { data, error } = await apiClient.PATCH('/rental/itemtype/available/{id}', {
		params: { path: { id: props.itemType.id }, query: { count: freeItems.value } },
	});
	if (error) {
		toastStore.error({ title: 'error when setting free items', description: (error as { ru: string }).ru });
	}
	if (data?.items_changed === 0) {
		toastStore.warning({
			title: 'Не удалось изменить количество вещей',
			description: 'Возможно, достигнут максимум свободных вещей этого типа',
		});
		return;
	}
	if (!!data) {
		freeItems.value = data.total_available;
		itemWasChanged.value = false;
		toastStore.success({ title: 'Количество свободных вещей успешно изменено' });
	}
}

async function incrementItems() {
	freeItems.value += 1;
	itemWasChanged.value = true;
}

async function decrementItems() {
	freeItems.value -= 1;
	itemWasChanged.value = true;
}
</script>

<template>
	<v-card class="ma-2" max-width="350px">
		<v-card-title class="text-wrap">{{ itemType.name }}</v-card-title>
		<v-img cover max-height="150px" :src="useItemStore().constructPictureUrl(itemType.image_url)"></v-img>
		<v-card-actions>
			<div class="d-flex flex-column ga-2 w-100">
				<div class="d-flex justify-center w-100">
					<v-btn icon="mdi-minus" rounded="sm" @click="decrementItems"></v-btn>
					<v-text-field
						v-model="freeItems"
						class="bg-primary text-white align-center text-end"
						variant="outlined"
						@input="itemWasChanged = true"
					/>
					<v-btn icon="mdi-plus" rounded="sm" @click="incrementItems"></v-btn>
				</div>
				<v-btn
					v-if="itemWasChanged"
					class="w-100"
					color="primary"
					variant="flat"
					text="Сохранить"
					@click="setItems"
				></v-btn>
			</div>
		</v-card-actions>
	</v-card>
</template>

<style lang="css" scoped></style>
