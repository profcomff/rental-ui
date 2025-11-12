<script setup lang="ts">
import AdminSessionCard from '@/components/AdminSessionCard.vue';
import AdminTabs from '@/components/AdminTabs.vue';
import { useAdminStore } from '@/store';
import { getCurrentTs } from '@/utils';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted } from 'vue';

let intervalId: NodeJS.Timeout | null = null;

onMounted(async () => {
	await requestReservedPageSessions();
	intervalId = setInterval(async () => await requestReservedPageSessions(), 5000);
});

onUnmounted(() => {
	if (!!intervalId) clearInterval(intervalId);
});

const adminStore = useAdminStore();
const { requestReservedPageSessions } = adminStore;
const { reservedPageSessions } = storeToRefs(adminStore);

getCurrentTs();
</script>

<template>
	<AdminTabs current-tab="/admin/requests" />
	<AdminSessionCard v-for="s in reservedPageSessions" :key="s.id" :session="s" location="requests" />
</template>
