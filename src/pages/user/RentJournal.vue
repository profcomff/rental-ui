<script setup lang="ts">
import UserSessionCard from '@/components/UserSessionCard.vue';
import UserTabs from '@/components/UserTabs.vue';

import { useUserSessions } from '@/store';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';

const tab = ref<'all' | 'strikes'>('all');
const userSession = useUserSessions();
const { journalPageSessions } = storeToRefs(userSession);
const strikedSessions = computed(() => journalPageSessions.value.filter(i => !!i.strike_id));

const selectedItems = ref(journalPageSessions.value);

function switchMode(value: 'all' | 'strikes') {
	if (value === 'all') {
		selectedItems.value = journalPageSessions.value;
	} else if (value === 'strikes') {
		selectedItems.value = strikedSessions.value;
	}
}

onMounted(async () => {
	await userSession.requestJournal();
});
</script>

<template>
	<UserTabs current-tab="/log" />
	<v-tabs
		class="my-2"
		align-tabs="center"
		v-model="tab"
		selected-class="bg-primary"
		@update:model-value="switchMode(tab)"
	>
		<v-tab variant="elevated" value="all">Все</v-tab>
		<v-tab variant="elevated" value="strikes">Страйки</v-tab>
	</v-tabs>
	<UserSessionCard
		v-for="session in selectedItems"
		:key="session.id"
		:session="session"
		@click="$router.push(`/session/${session.id}`)"
	/>
</template>
