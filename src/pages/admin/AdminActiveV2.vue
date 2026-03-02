<script setup lang="ts">
import AdminTabs from '@/components/AdminTabs.vue';
import { useAdminStore, useItemStore } from '@/store';
import { onMounted, onUnmounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import AdminSessionCard from '@/components/AdminSessionCard.vue';

onMounted(async () => {
	requestActivePageSessions();
	useItemStore().requestItemTypes();
});

const adminStore = useAdminStore();
const { requestActivePageSessions } = adminStore;
const { activePageSessions } = storeToRefs(adminStore);

const userId = ref<string>();
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

async function executeSearch() {
	await requestActivePageSessions(userId.value === '' ? undefined : Number(userId.value));
}

function handleSearchInput() {
	if (searchTimeout) {
		clearTimeout(searchTimeout);
	}

	searchTimeout = setTimeout(() => {
		executeSearch();
	}, 500);
}

onUnmounted(() => {
	if (searchTimeout) {
		clearTimeout(searchTimeout);
	}
});
</script>

<template>
	<AdminTabs current-tab="/admin/active" />
	<v-text-field
		v-model="userId"
		class="mb-2 mx-3"
		style="margin-top: 58px"
		placeholder="Поиск студента (по id)"
		:prepend-inner-icon="'mdi-magnify'"
		variant="outlined"
		@update:model-value="handleSearchInput"
	></v-text-field>
	<AdminSessionCard v-for="s in activePageSessions" :key="s.id" location="active" :session="s" />
</template>
