<script setup lang="ts">
import AdminSessionCard from '@/components/AdminSessionCard.vue';
import AdminTabs from '@/components/AdminTabs.vue';
import { useAdminStore, useItemStore } from '@/store';
import { storeToRefs } from 'pinia';
import { computed, onBeforeMount, ref } from 'vue';

onBeforeMount(async () => {
	requestFinishedPageSessions();
	requestCancelledPageSessions();
	useItemStore().requestItemTypes();
});

const adminStore = useAdminStore();
const { requestFinishedPageSessions, requestCancelledPageSessions } = adminStore;
const { finishedPageSessions, cancelledPageSessions } = storeToRefs(adminStore);

const selectedSessions = computed(() => {
	if (tab.value === 'finished') return finishedPageSessions.value;
	else return cancelledPageSessions.value;
});

const userId = ref<string>();

async function handleSearchById() {
	requestFinishedPageSessions(userId.value === '' ? undefined : Number(userId.value));
	requestCancelledPageSessions(userId.value === '' ? undefined : Number(userId.value));
}

const tab = ref<'finished' | 'cancelled'>('finished');
</script>

<template>
	<AdminTabs current-tab="/admin/journal" />
	<v-text-field
		v-model="userId"
		class="my-2 py-2 mx-2"
		placeholder="Поиск студента (по id)"
		:prepend-inner-icon="'mdi-magnify'"
		variant="outlined"
		@update:model-value="handleSearchById"
	></v-text-field>
	<v-tabs class="my-2" align-tabs="center" v-model="tab" selected-class="bg-primary">
		<v-tab variant="elevated" value="finished">Завершенные</v-tab>
		<v-tab variant="elevated" value="cancelled">Отмененные</v-tab>
	</v-tabs>
	<AdminSessionCard v-for="s in selectedSessions" :key="s.id" :session="s" location="journal" />
</template>
