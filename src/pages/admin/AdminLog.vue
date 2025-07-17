<script setup lang="ts">
import AdminTabs from '@/components/AdminTabs.vue';
import { useAdminStore } from '@/store';
import { onMounted } from 'vue';

onMounted(async () => {
	await adminStore.requestEvents();
});

const adminStore = useAdminStore();
</script>

<template>
	<AdminTabs current-tab="/admin/log" />
	<ul>
		<li v-for="{ id, action_type, create_ts } in adminStore.allEvents" :key="id">
			[{{ create_ts }}] | {{ id }}. {{ action_type }}
		</li>
	</ul>
</template>

<style scoped>
.strike-dot {
	position: absolute;
	top: 0;
	right: 0;
	margin-right: -2%;
	margin-top: -1%;
	background-color: red;
	border-radius: 100%;
	width: 2rem;
	height: 2rem;
}

.allow-overflow {
	overflow: visible;
}
</style>
