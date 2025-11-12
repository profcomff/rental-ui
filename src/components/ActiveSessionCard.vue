<script setup lang="ts">
import { RentalSession } from '@/models';
import TextTimer from './TextTimer.vue';
import { useItemStore, useToastStore, useUserSessions } from '@/store';
import { computed, ref } from 'vue';
import ConfirmDialogue from './ConfirmDialog.vue';
import { RESERVATION_TIME_MS } from '@/constants';
import StrikeChip from './StrikeChip.vue';

const toastStore = useToastStore();

const props = defineProps<{
	session: RentalSession;
}>();

const itemType = computed(() => useItemStore().itemTypes.find(i => i.id === props.session.item_type_id));

const state = computed(() => props.session.status);

const { cancelReservation } = useUserSessions();

const buttonStates = {
	reserved: {
		text: 'Отмена брони',
		color: 'danger',
		tooltip: 'Нажмите, чтобы отменить бронь',
		disabled: false,
	},
};

const timerText = computed(() => {
	switch (state.value) {
		case 'reserved': {
			return 'До окончания:';
		}
		case 'active': {
			return 'До окончания:';
		}
		case 'overdue': {
			return 'Прошло:';
		}
		default:
			return '';
	}
});

const dialogActive = ref(false);
const dialogTitle = ref('');
const dialogSubitle = ref<string | undefined>();

async function handleButtonClick() {
	switch (state.value) {
		case 'reserved':
			dialogTitle.value = 'Отменить бронь?';
			dialogSubitle.value = 'Повторно забронировать вы сможете только через 15 минут';
			dialogActive.value = true;
			return;
		default:
			toastStore.error({ title: 'Нет доступных действий' });
	}
}

async function handleDialogConfirm() {
	switch (state.value) {
		case 'reserved':
			if (!props.session || !props.session.id) {
				toastStore.error({ title: 'Ошибка при попытке отменить сессию -- сессия не определена' });
				return;
			}
			await cancelReservation(props.session.id);
			await useUserSessions().requestActive();
			return;
	}
}
</script>

<template>
	<v-card class="my-3 py-1 w-100" rounded="lg" variant="elevated">
		<v-card-title>
			<div class="d-flex justify-space-between align-center">
				<p class="font-weight-bold text-wrap">{{ itemType?.name }}</p>
			</div>
		</v-card-title>

		<div>
			<v-img ref="itemImage" :src="useItemStore().constructPictureUrl(itemType?.image_url)" aspect-ratio="1/1">
				<StrikeChip
					v-if="session.status === 'overdue'"
					class="position-relative"
					style="top: 3px; left: 3px"
					text="Просрочено"
				></StrikeChip>
			</v-img>
		</div>

		<v-card-subtitle :opacity="1">
			<div
				v-if="['reserved', 'active', 'overdue'].includes(state)"
				class="d-flex justify-space-between align-center my-2"
			>
				<p class="text-caption">{{ timerText }}</p>
				<TextTimer
					class="text-body-1"
					v-if="state === 'reserved'"
					:start-time="new Date(session.reservation_ts + 'Z')"
					:duration="RESERVATION_TIME_MS"
				/>
				<TextTimer
					class="text-body-1"
					v-else-if="state === 'active'"
					:deadline="new Date(session.deadline_ts + 'Z')"
				/>
				<TextTimer
					class="text-body-1"
					v-else-if="state === 'overdue'"
					:start-time="new Date(session.deadline_ts + 'Z')"
					mode="count-up"
				/>
			</div>
		</v-card-subtitle>

		<v-card-actions v-if="state === 'reserved'">
			<div class="d-flex align-center w-100">
				<v-btn
					class="flex-grow-1"
					v-bind="buttonStates[state]"
					variant="tonal"
					@click="handleButtonClick"
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
