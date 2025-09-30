<script setup lang="ts">
import { ItemType } from '@/models';
import { useItemStore, useToastStore, useUserSessions } from '@/store';
import { computed, ref } from 'vue';
import ConfirmDialogue from './ConfirmDialog.vue';

const toastStore = useToastStore();

const props = defineProps<{
	itemType: ItemType;
}>();

const state = computed(() => {
	if (!props.itemType.available_items_count) return 'unavailable';
	return props.itemType.available_items_count > 0 ? 'available' : 'unavailable';
});

const { reserveItem } = useUserSessions();

const buttonStates = {
	available: {
		text: 'Забронировать',
		color: 'primary',
		tooltip: null,
		disabled: false,
	},
	cooldown: {
		text: 'Забронировать',
		color: 'disabled',
		tooltip: 'Вы не забрали предмет, поэтому повторная бронь доступна лишь спустя время',
		disabled: true,
	},
	unavailable: {
		text: 'Недоступен',
		color: 'disabled',
		tooltip: null,
		disabled: true,
	},
	overdue: {
		text: 'Просрочен',
		color: 'danger',
		tooltip: 'Капец',
		disabled: false,
	},
};

const dialogActive = ref(false);
const dialogTitle = ref('');
const dialogSubitle = ref<string | undefined>();

async function handleButtonClick() {
	switch (state.value) {
		case 'available':
			dialogTitle.value = 'Забронировать?';
			dialogSubitle.value = 'Забрать вещь нужно будет в течение 15 минут';
			dialogActive.value = true;
			return;
		default:
			toastStore.error({ title: 'Нет доступных действий' });
	}
}

async function handleDialogConfirm() {
	switch (state.value) {
		case 'available':
			await reserveItem(props.itemType.id);
			await useUserSessions().requestAvailable();
			await useItemStore().requestItemTypes();
			return;
	}
}
</script>

<template>
	<v-card
		v-if="itemType.availability"
		class="my-2 py-1"
		min-width="min(40vw, 300px)"
		max-width="344px"
		rounded="lg"
		variant="elevated"
	>
		<v-card-title>
			<div class="d-flex justify-space-between align-center">
				<p class="font-weight-bold text-wrap">{{ itemType.name }}</p>
				<v-btn icon="mdi-arrow-right" variant="flat" density="compact"></v-btn>
			</div>
		</v-card-title>

		<v-img
			ref="itemImage"
			:src="useItemStore().constructPictureUrl(itemType.image_url)"
			cover
			max-height="168.75px"
			aspect-ratio="16/9"
		></v-img>

		<v-card-actions>
			<div class="d-flex align-center w-100">
				<v-btn
					class="font-weight-bold flex-grow-1"
					v-bind="buttonStates[state]"
					variant="tonal"
					@click="handleButtonClick"
				></v-btn>
				<v-btn
					v-if="buttonStates[state].tooltip"
					:color="buttonStates[state].color"
					variant="text"
					density="comfortable"
					icon="mdi-information-outline"
				></v-btn>
			</div>
		</v-card-actions>
	</v-card>

	<ConfirmDialogue
		v-model="dialogActive"
		:title="dialogTitle"
		:description="dialogSubitle"
		@confirm="handleDialogConfirm"
		@cancel="dialogActive = false"
	/>
</template>

<style lang="css" scoped></style>
