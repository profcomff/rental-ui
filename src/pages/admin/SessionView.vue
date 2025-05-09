<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useTestStore } from '@/store/testRequestStore';
import { useItemStore } from '@/store/itemStore';
import { RentalSession } from '@/models';
import { convertTsToHHMM, sessionEnded } from '@/utils';

const route = useRoute();
const testStore = useTestStore();
const itemStore = useItemStore();

const sessionId = ref(0);
const session = ref<RentalSession>();

onMounted(() => {
	sessionId.value = Number(route.params.id);
	session.value = testStore.getSessionById(sessionId.value);
});

const requestedItem = computed(() => {
	return itemStore.getItemType(session.value?.item_id ?? 0);
});

const strike = computed(() => {
	return testStore.getStrikeById(session.value?.strike_id ?? -1);
});

const strikeReason = computed(() => {
	return strike.value?.reason;
});
</script>

<template>
	<div v-if="!session">Такой сессии нет, где-то ошибка</div>
	<div v-else>
		<v-card>
			<template #title> {{ session.user_id }} (айди пока нет юзердаты) </template>

			<template #subtitle>
				{{ requestedItem?.name }}
				<v-divider />
				<p>время брони: {{ convertTsToHHMM(session.reservation_ts) }}</p>
				<p>время старта: {{ convertTsToHHMM(session.start_ts) }}</p>
				<p>предполагаемое время завершения: {{ convertTsToHHMM(session.end_ts) }}</p>
				<p>действительное время завершения: {{ convertTsToHHMM(session.actual_return_ts) }}</p>
			</template>

			<template #text>
				<p>Статус сессии: {{ session.status }}</p>
				<v-row justify="space-evenly">
					<v-col cols="auto">
						<p>Выдал: {{ session.admin_open_id ?? 'сессия не начата' }}</p>
					</v-col>
					<v-col cols="auto">
						<p>Принял: {{ session.admin_close_id ?? 'сессия не завершена' }}</p>
					</v-col>
				</v-row>
			</template>

			<template #prepend>
				<v-img :src="requestedItem?.image_url ?? ''" width="100px" />
			</template>
		</v-card>

		<v-card
			:title="`${session.user_id} пока нет юзердаты`"
			:subtitle="`Страйки: ${testStore.getStrikes().length}`"
			:prepend-avatar="'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'"
		/>

		<p>Комментарий к сессии:</p>
		<v-text-field v-model="strikeReason" :disabled="sessionEnded(session)" />
	</div>
</template>

<style scoped>
p {
	margin: 0;
}
</style>
