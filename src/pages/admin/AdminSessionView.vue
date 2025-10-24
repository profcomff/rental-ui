<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import apiClient from '@/api';
import { RentalSession, Strike } from '@/models';
import { useRoute } from 'vue-router';
import StrikeChip from '@/components/StrikeChip.vue';
import { ItemType } from '@/models';
import { convertTsToDateTime } from '@/utils';
import { useAdminStore, useItemStore, useToastStore } from '@/store';
import AdminTabs from '@/components/AdminTabs.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import ReasonDialog from '@/components/ReasonDialog.vue';

const toastStore = useToastStore();
const adminStore = useAdminStore();

const session = ref<RentalSession>();
const itemType = ref<ItemType>();
const strike = ref<Strike>();
const hasStrikes = ref(false);

function handleRefuse() {
	if (session?.value && session.value.status === 'reserved') {
		reserveRefuseDialog.value = true;
	} else {
		activeRefuseDialog.value = true;
	}
}

function handleAccept() {
	if (session?.value && session.value.status === 'reserved') {
		reserveAcceptDialog.value = true;
	} else {
		activeAcceptDialog.value = true;
	}
}

const reserveRefuseDialog = ref(false);
const reserveAcceptDialog = ref(false);
const activeRefuseDialog = ref(false);
const activeAcceptDialog = ref(false);

onBeforeMount(async () => {
	const { params } = useRoute();
	const session_id = params.sessionId instanceof Array ? Number(params.sessionId[0]) : Number(params.sessionId);
	const { data, error } = await apiClient.GET('/rental/rental-sessions/{session_id}', {
		params: { path: { session_id } },
	});

	if (error) {
		toastStore.error({ title: 'Ошибка при попытке запроса сессии:', description: error.detail });
		return;
	}
	session.value = data;

	const { data: itemData, error: itemError } = await apiClient.GET('/rental/itemtype/{id}', {
		params: { path: { id: session.value!.item_type_id } },
	});
	if (itemError) {
		toastStore.error({ title: 'Ошибка при попытке запроса предмета:', description: itemError.detail });
		return;
	}

	itemType.value = itemData as ItemType;

	const { data: strikeData, error: strikeError } = await apiClient.GET('/rental/strike', {
		params: { query: { session_id: data.id } },
	});
	if (strikeError) {
		toastStore.error({ title: 'Ошибка при попытке запроса страйка', description: strikeError.detail });
		return;
	}

	strike.value = strikeData[0];

	const { data: userStrikes, error: userError } = await apiClient.GET('/rental/strike/user/{user_id}', {
		params: { path: { user_id: session.value.user_id } },
	});
	if (userError) {
		toastStore.error({ title: 'Ошибка при попытке запроса страйка', description: userError.detail });
		return;
	}

	hasStrikes.value = userStrikes.length > 0;
});
</script>

<template>
	<AdminTabs current-tab="/admin/journal" />
	<div class="d-flex align-center mb-2" style="margin-top: 64px">
		<v-btn class="mx-2" icon="mdi-chevron-left" density="compact" variant="flat" @click="$router.back()"></v-btn>
		<h3>К сессиям</h3>
	</div>
	<v-card variant="flat">
		<template #prepend>
			<div>
				<v-img
					aspect-ratio="16/9"
					cover
					width="150"
					:height="String((150 * 9) / 16)"
					rounded="lg"
					:src="useItemStore().constructPictureUrl(itemType?.image_url)"
				></v-img>
			</div>
		</template>

		<template #title>
			<p class="text-body-2 font-weight-bold">{{ itemType?.name }}</p>
		</template>

		<template #subtitle>
			<p class="text-body-1 font-weight-bold text-black opacity-100">N{{ session ? session.id : '-' }}</p>
		</template>

		<template #item>
			<StrikeChip v-if="strike" text="Страйк" />
		</template>

		<template #text>
			<v-row>
				<v-col>
					<p>Дата и время брони</p>
					<p class="font-weight-bold text-body-1">{{ convertTsToDateTime(session?.reservation_ts) }}</p>
				</v-col>
				<v-col>
					<p>Дата и время окончания сессии</p>
					<p class="font-weight-bold text-body-1">{{ convertTsToDateTime(session?.end_ts) }}</p>
				</v-col>
			</v-row>
			<v-row>
				<v-col>
					<p>Статус сессии</p>
				</v-col>
				<v-col>
					<p class="font-weight-bold text-body-1">
						{{ session?.strike_id === null ? 'Завершена' : 'Завершена со страйком' }}
					</p>
				</v-col>
			</v-row>
			<v-row>
				<v-col>
					<p>Выдал</p>
					<p class="font-weight-bold text-body-1">{{ session?.admin_open_id }}</p>
				</v-col>
				<v-col>
					<p>Принял</p>
					<p class="font-weight-bold text-body-1">{{ session?.admin_close_id }}</p>
				</v-col>
			</v-row>
			<v-row>
				<v-col>
					<v-card block>
						<template #prepend></template>

						<template #title>{{ session?.user_fullname ?? 'Неизвестен' }}</template>
						<template #subtitle>ID1234 {{ session?.user_phone ?? 'Нет телефона' }}</template>
						<template #item>Страйки: {{ hasStrikes ? 'да' : 'нет' }}</template>

						<template #text>
							<v-row>
								<v-col>Запись 1</v-col>
								<v-col>N1234567</v-col>
								<v-col></v-col>
							</v-row>
							<v-row>
								<v-col>Запись 2</v-col>
								<v-col>N1234567</v-col>
								<v-col><StrikeChip text="страйк" /></v-col>
							</v-row>
						</template>
					</v-card>
				</v-col>
			</v-row>
			<v-row>
				<v-col>
					<p>Комментарий к сессии</p>
					<p class="font-weight-bold text-body-1">{{ strike?.reason }}</p>
				</v-col>
			</v-row>
		</template>

		<template #actions>
			<div v-if="session?.status === 'reserved'">
				<v-btn color="primary" text="Выдать" @click="handleAccept"></v-btn>
				<v-btn color="danger" text="Отказать" @click="handleRefuse"></v-btn>
			</div>
			<div v-else-if="session?.status === 'active'">
				<v-btn color="primary" text="Завершить" @click="handleAccept"></v-btn>
				<v-btn color="danger" text="Завершить со страйком" @click="handleRefuse"></v-btn>
			</div>
			<div v-else-if="session?.status === 'overdue'">
				<v-btn color="danger" text="Завершить со страйком" @click="handleRefuse"></v-btn>
			</div>
		</template>
	</v-card>

	<ConfirmDialog
		v-model="reserveRefuseDialog"
		title="Причина отказа"
		:description="`Отказ для сессии N${session?.id}`"
		@cancel="reserveRefuseDialog = false"
		@confirm="
			async () => {
				if (!session || !session.id) {
					toastStore.error({ title: 'session id is undefined' });
					reserveRefuseDialog = false;
					return;
				}
				await adminStore.dismissSession(session?.id);
				if (session?.status === 'reserved') await adminStore.requestReservedPageSessions();
				if (session?.status === 'active') await adminStore.requestActivePageSessions();
				reserveRefuseDialog = false;
			}
		"
	/>

	<ConfirmDialog
		v-model="reserveAcceptDialog"
		title="Выдать предмет"
		@cancel="reserveAcceptDialog = false"
		@confirm="
			async () => {
				if (!session || !session.id) {
					toastStore.error({ title: 'session id is undefined' });
					reserveAcceptDialog = false;
					return;
				}
				await adminStore.startSession(session?.id);
				if (session?.status === 'reserved') await adminStore.requestReservedPageSessions();
				if (session?.status === 'active') await adminStore.requestActivePageSessions();
				reserveAcceptDialog = false;
			}
		"
	/>

	<ReasonDialog
		v-model="activeRefuseDialog"
		title="Завершить прокат со страйком?"
		:description="`Причина страйка для проката N${session?.id}`"
		@cancel="activeRefuseDialog = false"
		@confirm="
			async (reason: string) => {
				if (!session || !session.id) {
					toastStore.error({ title: 'session id is undefined' });
					activeRefuseDialog = false;
					return;
				}
				await adminStore.returnWithStrikeSession(session?.id, reason);
				if (session?.status === 'reserved') await adminStore.requestReservedPageSessions();
				if (session?.status === 'active') await adminStore.requestActivePageSessions();
				activeRefuseDialog = false;
			}
		"
	/>

	<ConfirmDialog
		v-model="activeAcceptDialog"
		title="Завершить аренду?"
		:description="`Завершить прокат N${session?.id}`"
		@cancel="activeAcceptDialog = false"
		@confirm="
			async () => {
				if (!session || !session.id) {
					toastStore.error({ title: 'session id is undefined' });
					activeAcceptDialog = false;
					return;
				}
				await adminStore.returnSession(session?.id);
				if (session?.status === 'reserved') await adminStore.requestReservedPageSessions();
				if (session?.status === 'active') await adminStore.requestActivePageSessions();
				activeAcceptDialog = false;
			}
		"
	/>
</template>

<style lang="css" scoped></style>
