<script setup lang="ts">
import AdminTabs from '@/components/AdminTabs.vue';
import { useAdminStore } from '@/store';
import { computed, onBeforeMount } from 'vue';

onBeforeMount(async () => {
	await adminStore.requestAllSessions();
});

const adminStore = useAdminStore();
const sessions = computed(() => adminStore.allSessions.toSorted((a, b) => a.id - b.id));
</script>

<template>
	<AdminTabs current-tab="/admin/archive" />
	<ul>
		<li v-for="{ id, user_id, item_id, start_ts, status } in sessions" :key="id">
			[{{ start_ts ?? 'NO_TIMESTAMP_FOR_END' }}] {{ id }}. User {{ user_id }}, Item {{ item_id }} |
			{{ status }} -- <a @click="$router.push(`/admin/session/${id}`)">подробнее</a>
		</li>
	</ul>
</template>
