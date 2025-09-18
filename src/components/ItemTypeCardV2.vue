<script setup lang="ts">
import { ItemType, RentalSession } from '@/models';
import TextTimer from './TextTimer.vue';
import { useItemStore, useUserSessions } from '@/store';
import { computed, ref } from 'vue';
import ConfirmDialogue from './ConfirmDialogue.vue';
import { RESERVATION_TIME_MS } from '@/constants';

const props = defineProps<{
	itemType: ItemType;
	session: RentalSession | undefined;
}>();

const state = computed(() => {
	if (props.session) {
		switch (props.session.status) {
			case 'active':
				return 'active';
			case 'overdue':
				return 'overdue';
			case 'reserved':
				return 'reserved';
		}
	}

	const isItemAvailable = computed(() => {
		return props.itemType.free_items_count && props.itemType.free_items_count > 0;
	});
	if (!isItemAvailable.value) return 'unavailable';
	return 'available';
});

const { reserveItem, cancelReservation } = useUserSessions();

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
	reserved: {
		text: 'Отмена брони',
		color: 'danger',
		tooltip: 'Нажмите, чтобы отменить бронь',
		disabled: false,
	},
	active: {
		text: 'Завершить аренду',
		color: 'danger',
		tooltip: null,
		disabled: false,
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
		case 'active':
		case 'overdue':
			console.log('Тут будет конец аренды');
			return;
		case 'reserved':
			dialogTitle.value = 'Отменить бронь?';
			dialogSubitle.value = 'Повторно забронировать вы сможете только через 15 минут';
			dialogActive.value = true;
			return;
		default:
			console.log('Нет доступных действий');
	}
}

async function handleDialogConfirm() {
	switch (state.value) {
		case 'available':
			await reserveItem(props.itemType.id);
			return;
		case 'reserved':
			if (!props.session || !props.session.id) {
				console.log('Ошибка при попытке отменить сессию - нет айди');
				return;
			}
			await cancelReservation(props.session.id);
			return;
	}
}
</script>

<template>
	<v-card class="my-2 py-1" min-width="min(40vw, 300px)" max-width="344px" rounded="lg" variant="elevated">
		<v-card-title>
			<div class="d-flex justify-space-between align-center">
				<p class="font-weight-bold text-wrap">{{ itemType.name }}</p>
				<v-btn icon="mdi-arrow-right" variant="flat" density="compact"></v-btn>
			</div>
		</v-card-title>

		<v-img
			:src="useItemStore().constructPictureUrl(itemType.image_url)"
			cover
			aspect-ratio="16/9"
			max-height="193.5px"
		></v-img>

		<v-card-subtitle>
			<div v-if="state === 'reserved'" class="d-flex justify-space-between align-center mt-2">
				<p>{{ state === 'reserved' ? 'До окончания' : 'Бронь через' }}:</p>
				<TextTimer
					:duration="RESERVATION_TIME_MS"
					:start-time="new Date(Date.parse(session?.reservation_ts ?? '0') + 3 * 60 * 60 * 1000)"
				/>
			</div>
		</v-card-subtitle>

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
