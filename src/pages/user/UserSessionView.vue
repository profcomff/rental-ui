<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue';
import apiClient from '@/api';
import { RentalSession, Strike } from '@/models';
import { useRoute } from 'vue-router';
import StrikeChip from '@/components/StrikeChip.vue';
import UserTabs from '@/components/UserTabs.vue';
import { ItemType } from '@/models';
import { convertTsToDateTime } from '@/utils';
import { useItemStore, useToastStore } from '@/store';

const toastStore = useToastStore();

const session = ref<RentalSession>();
const itemType = ref<ItemType>();
const strike = ref<Strike>();

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
		toastStore.error({ title: 'Ошибка при попытке запроса предмета', description: itemError.detail });
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
});

const sessionStatus = computed(() => {
	if (!session.value) return '';

	switch (session.value.status) {
		case 'reserved':
			return 'Забронирована';
		case 'active':
			return 'Активна';
		case 'overdue':
			return 'Просрочена';
		case 'canceled':
			return 'Отменена';
		case 'dismissed':
			return 'Отменена админом';
		case 'expired':
			return 'Истекло бронирование';
		case 'returned':
			return !!session.value.strike_id ? 'Завершена со страйком' : 'Завершена';
		default:
			return '';
	}
});
</script>

<template>
	<UserTabs current-tab="/log" />
	<div class="d-flex align-center mb-2" style="margin-top: 64px">
		<v-btn class="mx-2" icon="mdi-chevron-left" density="compact" variant="flat" @click="$router.back()"></v-btn>
		<h3>В журнал</h3>
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
						{{ sessionStatus }}
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
					<p class="font-weight-bold text-body-1">{{ session?.admin_close_id ?? '--' }}</p>
				</v-col>
			</v-row>
			<v-row v-if="!!strike?.reason">
				<v-col>
					<p>Комментарий к сессии</p>
					<p class="font-weight-bold text-body-1">{{ strike?.reason }}</p>
				</v-col>
			</v-row>
		</template>
	</v-card>
</template>

<style lang="css" scoped></style>
