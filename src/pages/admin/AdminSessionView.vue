<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import apiClient from '@/api';
import { RentalSession, Strike } from '@/models';
import { useRoute } from 'vue-router';
import StrikeChip from '@/components/StrikeChip.vue';
import { ItemType } from '@/models';
import { convertTsToDateTime } from '@/utils';
import { useItemStore } from '@/store';
import AdminTabs from '@/components/AdminTabs.vue';

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
		console.log('Ошибка при попытке запроса сессии:', error);
		return;
	}
	session.value = data;

	const { data: itemData, error: itemError } = await apiClient.GET('/rental/itemtype/{id}', {
		params: { path: { id: session.value!.item_type_id } },
	});
	if (itemError) {
		console.log('Ошибка при попытке запроса предмета:', itemError);
		return;
	}

	itemType.value = itemData;

	const { data: strikeData, error: strikeError } = await apiClient.GET('/rental/strike', {
		params: { query: { session_id: data.id } },
	});
	if (strikeError) {
		console.log('Ошибка при попытке запроса страйка', strikeError);
		return;
	}

	strike.value = strikeData[0];
});
</script>

<template>
	<AdminTabs current-tab="/admin/journal" />
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

						<template #title>Иванов Иван Иванович</template>
						<template #subtitle>ID1234 +7 999 999-99-99</template>
						<template #item>Страйки: да</template>

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
	</v-card>
</template>

<style lang="css" scoped></style>
