<script setup lang="ts">
import AdminSessionCard from '@/components/AdminSessionCard.vue';
import AdminTabs from '@/components/AdminTabs.vue';
import { useAdminStore } from '@/store';
import { getCurrentTs } from '@/utils';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

onMounted(async () => {
	await requestReservedPageSessions();
});

const adminStore = useAdminStore();
const { requestReservedPageSessions, startSession, dismissSession } = adminStore;
const { reservedPageSessions } = storeToRefs(adminStore);

getCurrentTs();
</script>

<template>
	<AdminTabs current-tab="/admin/requests" />
	<AdminSessionCard
		v-for="s in reservedPageSessions"
		:key="s.id"
		:session="s"
		location="requests"
		@cancel="dismissSession(s.id)"
		@confirm="startSession(s.id)"
	/>
</template>
