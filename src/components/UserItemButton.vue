<script setup lang="ts">
import { computed, ref } from 'vue';
import { ItemType, RentalSession } from '@/models';
import apiClient from '@/api';
import { useToastStore } from '@/store';
// import { refreshData } from '@/utils';

const toastStore = useToastStore();

const props = defineProps<{
	itemType: ItemType;
	rentalSession?: RentalSession;
}>();

interface UserItemButtonState {
	disabled: boolean;
	text: string;
	action?: (id: number) => Promise<RentalSession> | null;
}

const defaultButtonState = {
	disabled: false,
	text: 'Забронировать',
	action: reserveItem,
} as UserItemButtonState;

async function reserveItem(itemTypeId: number) {
	const { data, error } = await apiClient.POST('/rental/rental-sessions/{item_type_id}', {
		params: { path: { item_type_id: itemTypeId } },
	});

	if (error) {
		toastStore.error({
			title: 'Ошибка при попытке забронировать',
			description: error.detail,
		});
		return null;
	}

	showDialog.value = false;
	// await refreshData();
	return data;
}

async function cancelReservation(session_id: number) {
	const { data, error } = await apiClient.DELETE('/rental/rental-sessions/{session_id}/cancel', {
		params: { path: { session_id } },
	});

	if (error) {
		toastStore.error({
			title: 'Возникла ошибка при попытке отменить бронь',
			description: error.detail,
		});
		return;
	}

	showDialog.value = false;
	// await refreshData();
	return data;
}

const buttonState = computed(() => {
	const isEnoughItems = computed(() => {
		const itemCount = ref(props.itemType.free_items_count);
		if (!itemCount.value) return false;

		return itemCount.value > 0;
	});

	if (!isEnoughItems.value) {
		return {
			disabled: true,
			text: 'Нет в наличии',
		} as UserItemButtonState;
	}

	if (!props.rentalSession) {
		return defaultButtonState;
	}

	switch (props.rentalSession.status) {
		case 'active':
			return {
				disabled: true,
				text: 'В прокате',
			} as UserItemButtonState;
			break;
		case 'reserved':
			return {
				disabled: false,
				text: 'Отменить',
				action: cancelReservation,
			} as UserItemButtonState;
			break;
		case 'overdue':
			return {
				disabled: true,
				text: 'Просрочено!',
			} as UserItemButtonState;
			break;
		case 'canceled':
			return {
				disabled: true,
				text: 'Повторная бронь',
			} as UserItemButtonState;
			break;
	}

	return defaultButtonState;
});

async function processAction(action: ((id: number) => Promise<RentalSession> | null) | undefined) {
	showDialog.value = true;
	if (!action) {
		toastStore.error({
			title: 'У кнопки не назначено действие',
			description: 'Расскажите нам, как вы это сделали :)',
		});
		return;
	}

	let id: number = 0;
	switch (action.name) {
		case 'reserveItem':
			id = props.itemType.id;
			break;
		case 'cancelReservation':
			id = props.rentalSession?.id ?? 0;
			break;
		default:
			break;
	}

	await action(id);
}

const showDialog = ref(false);
</script>

<template>
	<v-dialog v-model="showDialog" max-width="400">
		<template #activator>
			<v-btn v-bind="buttonState" @click="showDialog = true" />
		</template>
		<v-card class="rounded-lg">
			<v-card-text class="px-4 pb-0">Подтвердите действие</v-card-text>
			<v-card-actions class="d-flex justify-end ga-2 pa-4">
				<v-btn
					@click="showDialog = false"
					color="error"
					variant="tonal"
					size="large"
					class="auth-edit-button rounded-sm"
				>
					Нет
				</v-btn>
				<v-btn
					@click="processAction(buttonState.action)"
					color="primary"
					variant="tonal"
					size="large"
					class="auth-edit-button rounded-sm"
				>
					Да
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
