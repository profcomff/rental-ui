<template>
	<v-card class="mx-auto rounded-lg d-flex flex-column" style="width: 100%; max-width: 300px; height: 100%">
		<!-- Изображение с контейнером -->
		<div class="image-container">
			<v-img :src="itemType.image_url" :aspect-ratio="1" contain>
				<template v-if="!itemType.image_url">
					<v-sheet height="100%" color="grey-lighten-3"></v-sheet>
				</template>
			</v-img>
		</div>

		<!-- Контент карточки -->
		<div class="card-content pa-4 flex-grow-1">
			<v-card-title class="text-wrap font-weight-bold pb-0 card-title">
				{{ itemType.name }}
			</v-card-title>
			<v-card-subtitle class="text-wrap pt-1 card-description">
				{{ itemType.description }}
			</v-card-subtitle>
		</div>

		<!-- Кнопка и статус -->
		<div class="pa-4 pt-0 action-block">
			<v-row no-gutters class="ma-0">
				<v-spacer></v-spacer>
				<v-col cols="auto" class="pa-0 d-flex align-end">
					<v-btn
						v-if="buttonState.showButton"
						:disabled="buttonState.disabled"
						@click="handleButtonClick"
						color="primary"
						class="action-button rounded-sm"
						variant="tonal"
					>
						{{ buttonState.action === 'cancel' ? 'Отменить' : 'Забронировать' }}
					</v-btn>
				</v-col>
			</v-row>
		</div>

		<!-- Окно подтверждения -->
		<v-dialog v-model="showDialog" max-width="400">
			<v-card class="rounded-lg">
				<v-card-text class="px-4 pb-0">Подтвердите действие</v-card-text>
				<v-card-actions class="d-flex justify-end ga-2 pa-4">
					<v-btn
						@click="cancelAction"
						color="error"
						variant="tonal"
						size="large"
						class="auth-edit-button rounded-sm"
					>
						Нет
					</v-btn>
					<v-btn
						@click="confirmAction"
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
	</v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTestStore } from '@/store/testRequestStore';
import { ItemType } from '@/models/index';

const props = defineProps<{
	itemType: ItemType & {
		rentalSession?: {
			id: string;
			status: string;
			pickupTime?: string;
		};
	};
}>();

const testStore = useTestStore();
const currentUserId = 177;

const userSessions = computed(() => {
	return testStore
		.getSessions()
		.filter(session => session.item_id === props.itemType.id && session.user_id === currentUserId);
});

const activeSession = computed(() => userSessions.value.find(s => s.status === 'active'));
const reservedSession = computed(() => userSessions.value.find(s => s.status === 'reserved'));
const overdueSession = computed(() => userSessions.value.find(s => s.status === 'overdue'));

const isAvailable = computed(() => {
	const allSessions = testStore.getSessions();
	const activeOrReserved = allSessions.filter(
		s => s.item_id === props.itemType.id && (s.status === 'active' || s.status === 'reserved'),
	);
	return activeOrReserved.length === 0;
});

const buttonState = computed(() => {
	if (activeSession.value) {
		return {
			disabled: true,
			text: 'В прокате',
			showButton: true,
		};
	}
	if (reservedSession.value) {
		return {
			disabled: false,
			//text: 'Отменить',
			action: 'cancel',
			showButton: true,
		};
	}
	if (overdueSession.value) {
		const time = new Date(overdueSession.value.reservation_ts).toLocaleTimeString('ru-RU', {
			hour: '2-digit',
			minute: '2-digit',
		});
		return {
			disabled: true,
			text: `Забронировать повторно в ${time}`,
			showButton: false,
		};
	}
	if (!isAvailable.value) {
		return {
			disabled: true,
			//text: 'Нет в наличии',
			showButton: true,
		};
	}
	return {
		disabled: false,
		//text: 'Забронировать',
		action: 'reserve',
		showButton: true,
	};
});

const showDialog = ref(false);
let pendingAction = '';

const handleButtonClick = () => {
	if (buttonState.value.disabled) return;
	pendingAction = buttonState.value.action || '';
	showDialog.value = true;
};

const confirmAction = async () => {
	showDialog.value = false;
	if (pendingAction === 'reserve') {
		try {
			const response = await fetch(`/rental-sessions/${props.itemType.id}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: currentUserId }),
			});
			if (response.ok) testStore.init();
		} catch (error) {
			console.error('Ошибка бронирования:', error);
		}
	} else if (pendingAction === 'cancel' && reservedSession.value) {
		try {
			const response = await fetch(`/rental-sessions/${reservedSession.value.id}`, {
				method: 'DELETE',
			});
			if (response.ok) testStore.init();
		} catch (error) {
			console.error('Ошибка отмены:', error);
		}
	}
	pendingAction = '';
};

const cancelAction = () => {
	showDialog.value = false;
	pendingAction = '';
};
</script>

<style scoped>
.image-container {
	position: relative;
	width: 100%;
	padding-top: 100%;
}

.v-img {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: contain;
	border-top-left-radius: 12px;
	border-top-right-radius: 12px;
}

.card-title {
	font-size: 1.4rem !important;
	line-height: 1.4;
	font-family: 'Roboto Flex', sans-serif !important;
}

.card-description {
	font-size: 1.1rem !important;
	color: rgb(0 0 0 / 70%) !important;
	min-height: 60px;
	font-family: 'Roboto Flex', sans-serif !important;
}

.status-container {
	font-size: 1.2rem;
	position: absolute;
	left: 16px;
	bottom: 16px;
	line-height: 1.2;
	font-family: 'Roboto Flex', sans-serif !important;
}

.button-container {
	position: absolute;
	right: 16px;
	bottom: 16px;
}

.action-button {
	letter-spacing: normal !important;
	text-transform: none !important;
	font-weight: 700 !important;
	font-size: 1.1rem !important;
	padding: 12px 24px !important;
	min-width: 120px !important;
	height: 48px !important;
	border-radius: 8px !important;
	font-family: 'Roboto Flex', sans-serif !important;
	margin-right: 8px;
}

.v-dialog .v-card {
	padding: 24px;
}

.v-dialog .v-card-text {
	font-size: 1.25rem !important;
	font-weight: 500;
	text-align: center;
	padding: 24px 0 !important;
	font-family: 'Roboto Flex', sans-serif !important;
}

.auth-edit-button {
	min-width: 100px !important;
	height: 40px !important;
	border-radius: 4px !important;
	letter-spacing: normal !important;
	font-family: 'Roboto Flex', sans-serif !important;
}
</style>
