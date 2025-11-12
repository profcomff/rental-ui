<script setup lang="ts">
import AdminTabs from '@/components/AdminTabs.vue';
import { useAdminStore } from '@/store';
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import AdminSessionCard from '@/components/AdminSessionCard.vue';

onMounted(async () => {
	await requestActivePageSessions();
});

const adminStore = useAdminStore();
const { requestActivePageSessions } = adminStore;
const { activePageSessions } = storeToRefs(adminStore);

const userId = ref<string>();

async function handleSearchById() {
	await requestActivePageSessions(userId.value === '' ? undefined : Number(userId.value));
}
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
		@update:model-value="handleSearchById"
	></v-text-field>
	<AdminSessionCard v-for="s in activePageSessions" :key="s.id" location="active" :session="s" />
</template>
