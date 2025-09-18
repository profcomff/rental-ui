<script setup lang="ts">
import AdminSessionCard from '@/components/AdminSessionCard.vue';
import AdminTabs from '@/components/AdminTabs.vue';
import { RentalSession } from '@/models';
import { useAdminStore } from '@/store';
import { storeToRefs } from 'pinia';
import { onBeforeMount, ref } from 'vue';

onBeforeMount(async () => {
	await requestFinishedPageSessions();
	await requestCancelledPageSessions();

	selectedSessions.value = finishedPageSessions.value;
});

const adminStore = useAdminStore();
const { requestFinishedPageSessions, requestCancelledPageSessions } = adminStore;
const { finishedPageSessions, cancelledPageSessions } = storeToRefs(adminStore);

const selectedSessions = ref<RentalSession[]>([]);

const tab = ref<'finished' | 'cancelled'>('finished');
function switchMode(tab: 'finished' | 'cancelled') {
	if (tab === 'finished') {
		selectedSessions.value = finishedPageSessions.value;
	} else if (tab === 'cancelled') {
		selectedSessions.value = cancelledPageSessions.value;
	}
}
</script>

<template>
	<AdminTabs current-tab="/admin/journal" />
	<v-tabs
		class="my-2"
		align-tabs="center"
		v-model="tab"
		selected-class="bg-primary"
		@update:model-value="switchMode(tab)"
	>
		<v-tab variant="elevated" value="finished">Завершенные</v-tab>
		<v-tab variant="elevated" value="cancelled">Отмененные</v-tab>
	</v-tabs>
	<AdminSessionCard v-for="s in selectedSessions" :key="s.id" :session="s" location="journal" />
</template>
