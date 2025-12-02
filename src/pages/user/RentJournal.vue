<script setup lang="ts">
import UserSessionCard from '@/components/UserSessionCard.vue';
import UserTabs from '@/components/UserTabs.vue';

import { useItemStore, useUserSessions } from '@/store';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';

const tab = ref<'all' | 'cancelled'>('all');
const userSession = useUserSessions();
const { journalPageSessions } = storeToRefs(userSession);
const cancelledSesssions = computed(() =>
	journalPageSessions.value.filter(i => ['canceled', 'dismissed'].includes(i.status)),
);

const selectedItems = ref(journalPageSessions.value);

function switchMode(value: 'all' | 'cancelled') {
	if (value === 'all') {
		selectedItems.value = journalPageSessions.value;
	} else if (value === 'cancelled') {
		selectedItems.value = cancelledSesssions.value;
	}
}

onMounted(async () => {
	useItemStore().requestItemTypes();
	await userSession.requestJournal();
	selectedItems.value = journalPageSessions.value;
});
</script>

<template>
	<UserTabs current-tab="/log" />
	<v-tabs
		style="margin-top: 64px"
		align-tabs="center"
		v-model="tab"
		selected-class="bg-primary"
		@update:model-value="switchMode(tab)"
	>
		<v-tab variant="elevated" value="all">Все</v-tab>
		<v-tab variant="elevated" value="cancelled">Отмененные</v-tab>
	</v-tabs>
	<UserSessionCard
		v-for="session in selectedItems"
		:key="session.id"
		:session="session"
		class="my-2 mx-2"
		@click="$router.push(`/session/${session.id}`)"
	/>
</template>
