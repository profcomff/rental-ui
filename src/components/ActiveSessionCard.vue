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

const state = computed(() => {
	switch (props.session.status) {
		case 'active':
			return 'active';
		case 'overdue':
			return 'overdue';
		case 'reserved':
			return 'reserved';
		default:
			return 'active';
	}
});

const { cancelReservation } = useUserSessions();

const buttonStates = {
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
		case 'active':
		case 'overdue':
			toastStore.warning({
				title: 'Для завершения сессии обратитесь в 2-39',
				description: `Назовите админку код сессии ${props.session?.id}`,
			});
			await useUserSessions().requestActive();
			return;
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

		<v-card-subtitle>
			<div v-if="state === 'reserved'" class="d-flex justify-space-between align-center mt-2">
				<p>{{ state === 'reserved' ? 'До окончания' : 'Бронь через' }}:</p>
				<TextTimer
					:duration="RESERVATION_TIME_MS"
					:start-time="new Date(Date.parse(session?.reservation_ts ?? '0'))"
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
