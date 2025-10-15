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

const props = defineProps<{
	location: 'requests' | 'active' | 'journal';
	session: RentalSession;
}>();

onMounted(async () => {
	await itemStore.requestItemTypes();
});

onUpdated(async () => {
	await itemStore.requestItemTypes();
});

const itemStore = useItemStore();
const { itemTypes } = storeToRefs(itemStore);
const itemType = computed(() => itemTypes.value.find(i => i.id === props.session.item_type_id));
const adminStore = useAdminStore();

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
	<v-card class="my-2" @click="$router.push(`/admin/session/${session.id}`)">
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
			<p class="text-wrap">{{ itemType?.name ?? 'Что-то' }}</p>
		</template>
		<template #subtitle>
			<p class="text-wrap">{{ session?.user_fullname ?? `user ${session?.user_id ?? 'unkown'}` }}</p>
		</template>
		<template #item>N{{ session.id }}</template>

		<template #append>
			<div>
				<StrikeChip v-if="session.status === 'overdue'" text="Просроч" />
				<StrikeChip v-if="!!session.strike_id" text="Страйк" />
			</div>
		</template>

		<template #text>
			<v-row>
				<v-col cols="5">
					<div>
						<p>{{ dateTimeText }}</p>
						<TextTimer
							v-if="session.status === 'reserved'"
							:duration="RESERVATION_TIME_MS"
							:start-time="new Date(Date.parse(session.reservation_ts))"
						/>
						<TextTimer
							v-else-if="session.status === 'active'"
							:duration="RESERVATION_TIME_MS * 2"
							:start-time="new Date(Date.parse(session.start_ts ?? '0'))"
						/>
						<p v-else-if="session.status === 'overdue'" class="font-weight-bold">
							{{ convertTsToDateTime(session.deadline_ts) }}
						</p>
						<p v-else class="font-weight-bold">{{ convertTsToDateTime(session.end_ts) }}</p>
					</div>
				</v-col>
				<v-col v-if="location !== 'journal'" cols="3">
					<div>
						<p>Страйки</p>
						<p class="font-weight-bold">{{ !!session.strike_id ? 'Да' : 'Нет' }}</p>
					</div>
				</v-col>
				<v-col cols="4">
					<div>
						<p>В наличии</p>
						<p class="font-weight-bold">{{ itemType?.available_items_count ?? 0 }}</p>
					</div>
				</v-col>
			</v-row>
		</template>

		<template #actions>
			<v-row v-if="location !== 'journal'">
				<v-col class="d-flex justify-center pr-1">
					<v-btn color="danger font-weight-bold " variant="tonal" block @click.stop="handleRefuseClick">
						{{ location === 'requests' ? 'Отклонить' : 'Завершить со страйком' }}
					</v-btn>
				</v-col>
				<v-col class="d-flex justify-center pl-1">
					<v-btn color="primary font-weight-bold" variant="tonal" block @click.stop="handleAcceptClick">
						{{ location === 'requests' ? 'Принять' : 'Завершить' }}
					</v-btn>
				</v-col>
			</v-row>
			<v-btn v-else block color="primary" variant="tonal" @click="$router.push(`/admin/session/${session.id}`)"
				>Подробнее</v-btn
			>
		</template>
	</v-card>

	<ConfirmDialog
		v-model="requestRefuseDialog"
		title="Причина отказа"
		:description="`Отказ для сессии N${session.id}`"
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
		title="Завершить прокат со страйком?"
		:description="`Причина страйка для проката N${session.id}`"
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

<style lang="css" scoped></style>
