<script setup lang="ts">
import AdminTabs from '@/components/AdminTabs.vue';
import { useAdminStore } from '@/store';
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import AdminSessionCard from '@/components/AdminSessionCard.vue';

onMounted(async () => {
	await requestActivePageSessions();
});

const adminStore = useAdminStore();
const { requestActivePageSessions } = adminStore;
const { activePageSessions } = storeToRefs(adminStore);
</script>

<template>
	<AdminTabs current-tab="/admin/active" />
	<AdminSessionCard v-for="s in activePageSessions" :key="s.id" location="active" :session="s" />
</template>
