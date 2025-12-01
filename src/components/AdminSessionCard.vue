<script setup lang="ts">
import { RentalSession } from '@/models';
import StrikeChip from './StrikeChip.vue';
import { computed, onMounted, onUpdated, ref } from 'vue';
import { useAdminStore, useItemStore } from '@/store';
import { storeToRefs } from 'pinia';
import TextTimer from './TextTimer.vue';
import { RESERVATION_TIME_MS } from '@/constants';
import { convertTsToDateTime } from '@/utils';
import ReasonDialog from './ReasonDialog.vue';
import ConfirmDialog from './ConfirmDialog.vue';
import apiClient from '@/api';

const props = defineProps<{
	location: 'requests' | 'active' | 'journal';
	session: RentalSession;
}>();

onMounted(async () => {
	itemStore.requestItemTypes();
	const { data } = await apiClient.GET('/rental/strike/user/{user_id}', {
		params: { path: { user_id: props.session.user_id } },
	});
	userStrikes.value = (data as unknown[]) ?? [];
});

onUpdated(async () => {
	itemStore.requestItemTypes();
});

const itemStore = useItemStore();
const { itemTypes } = storeToRefs(itemStore);
const itemType = computed(() => itemTypes.value.find(i => i.id === props.session.item_type_id));
const adminStore = useAdminStore();

const userStrikes = ref<unknown[]>([]);

const userHasStrikes = computed(() => {
	return userStrikes.value.length > 0;
});

const statusToDateTimeText = {
	reserved: 'До конца брони',
	active: 'До конца аренды',
	overdue: 'Просрочено с',
	returned: 'Дата и время',
	canceled: 'Дата и время',
	expired: 'Дата и время',
	dismissed: 'Дата и время',
} as const;
const dateTimeText = computed(() => statusToDateTimeText[props.session.status]);

function handleRefuseClick() {
	if (props.location === 'requests') {
		requestRefuseDialog.value = true;
	} else if (props.location === 'active') {
		activeRefuseDialog.value = true;
	}
}

function handleAcceptClick() {
	if (props.location === 'requests') {
		requestAcceptDialog.value = true;
	} else if (props.location === 'active') {
		activeAcceptDialog.value = true;
	}
}

const requestRefuseDialog = ref(false);
const requestAcceptDialog = ref(false);
const activeRefuseDialog = ref(false);
const activeAcceptDialog = ref(false);
</script>

<template>
	<v-card class="my-2 mx-2" @click="$router.push(`/admin/session/${session.id}`)">
		<template #prepend>
			<div>
				<v-img
					min-width="100"
					aspect-ratio="1"
					cover
					:src="itemStore.constructPictureUrl(itemType?.image_url)"
				></v-img>
			</div>
		</template>

		<template #title>
			<p class="text-wrap text-body-1">{{ itemType?.name ?? 'Что-то' }}</p>
		</template>

		<template #subtitle>
			<p class="text-wrap text-h3 font-weight-bold text-black">
				{{ session?.user_fullname ?? `user ${session?.user_id ?? 'unkown'}` }}
			</p>
		</template>
		<template #item>N{{ session.id }}</template>

		<template #append>
			<div>
				<StrikeChip v-if="!!session.strike_id" text="Страйк" />
			</div>
		</template>

		<template #text>
			<v-row>
				<v-col v-if="location == 'active' && session.status === 'overdue'">
					<StrikeChip text="Просрочено" />
				</v-col>
				<v-col cols="5">
					<div class="d-flex flex-column ga-1">
						<p class="text-caption">{{ dateTimeText }}</p>
						<TextTimer
							class="text-body-1 font-weight-bold"
							v-if="session.status === 'reserved'"
							:duration="RESERVATION_TIME_MS"
							:start-time="new Date(session.reservation_ts + 'Z')"
						/>
						<TextTimer
							class="text-body-1 font-weight-bold"
							v-else-if="session.status === 'active'"
							:deadline="new Date(session.deadline_ts + 'Z')"
							:start-time="new Date(Date.parse(session.start_ts ?? '0'))"
						/>
						<p v-else-if="session.status === 'overdue'" class="font-weight-bold">
							{{ convertTsToDateTime(session.deadline_ts) }}
						</p>
						<p v-else class="font-weight-bold">{{ convertTsToDateTime(session.end_ts) }}</p>
					</div>
				</v-col>
				<v-col v-if="location == 'requests'" cols="3">
					<div class="d-flex flex-column ga-1">
						<p class="text-caption">Страйки</p>
						<p class="text-body-1 font-weight-bold">{{ userHasStrikes ? 'Да' : 'Нет' }}</p>
					</div>
				</v-col>
				<v-col v-if="location == 'requests'" cols="3">
					<div>
						<p class="text-caption">В наличии</p>
						<p class="text-body-1 font-weight-bold">{{ itemType?.available_items_count ?? 0 }}</p>
					</div>
				</v-col>
			</v-row>
		</template>

		<template #actions>
			<v-row v-if="location !== 'journal'">
				<v-col class="d-flex justify-center pr-1">
					<v-btn color="danger" variant="tonal" block @click.stop="handleRefuseClick">
						{{ location === 'requests' ? 'Отклонить' : 'Завершить со страйком' }}
					</v-btn>
				</v-col>
				<v-col class="d-flex justify-center pl-1">
					<v-btn color="primary" variant="tonal" block @click.stop="handleAcceptClick">
						{{ location === 'requests' ? 'Принять' : 'Завершить' }}
					</v-btn>
				</v-col>
			</v-row>
			<v-btn v-else block color="primary" variant="tonal" @click="$router.push(`/admin/session/${session.id}`)"
				>Подробнее</v-btn
			>
		</template>
	</v-card>

	<ReasonDialog
		v-model="requestRefuseDialog"
		title="Причина отказа"
		:description="`Отказ для сессии N${session.id}`"
		:reasons="[
			{ chip: 'Сломаны', value: 'Все предметы сломаны' },
			{ chip: 'Закончились', value: 'Предметы закончились' },
		]"
		@cancel="requestRefuseDialog = false"
		@confirm="
			async () => {
				await adminStore.dismissSession(session.id);
				if (location === 'requests') await adminStore.requestReservedPageSessions();
				if (location === 'active') await adminStore.requestActivePageSessions();
				requestRefuseDialog = false;
			}
		"
	/>

	<ConfirmDialog
		v-model="requestAcceptDialog"
		title="Выдать предмет"
		@cancel="requestAcceptDialog = false"
		@confirm="
			async () => {
				await adminStore.startSession(session.id);
				if (location === 'requests') await adminStore.requestReservedPageSessions();
				if (location === 'active') await adminStore.requestActivePageSessions();
				requestAcceptDialog = false;
			}
		"
	/>

	<ReasonDialog
		v-model="activeRefuseDialog"
		:title="`Завершить со страйком?`"
		:description="`Завершить сессию N${session.id} со страйком`"
		confirmText="Отказать"
		cancelText="Отмена"
		:reasons="[
			{ chip: 'Сломан', value: 'Предмет был поврежден' },
			{ chip: 'Украден', value: 'Предмет был украден' },
			{ chip: 'Просрочен', value: 'Просрочено время возврата' },
		]"
		@cancel="activeRefuseDialog = false"
		@confirm="
			async reason => {
				await adminStore.returnWithStrikeSession(session.id, reason);
				if (location === 'requests') await adminStore.requestReservedPageSessions();
				if (location === 'active') await adminStore.requestActivePageSessions();
				activeRefuseDialog = false;
			}
		"
	/>

	<ConfirmDialog
		v-model="activeAcceptDialog"
		title="Завершить аренду?"
		:description="`Завершить прокат N${session.id}`"
		@cancel="activeAcceptDialog = false"
		@confirm="
			async () => {
				await adminStore.returnSession(session.id);
				if (location === 'requests') await adminStore.requestReservedPageSessions();
				if (location === 'active') await adminStore.requestActivePageSessions();
				activeAcceptDialog = false;
			}
		"
	/>
</template>

<style lang="scss" scoped></style>
