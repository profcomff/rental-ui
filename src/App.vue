<script setup lang="ts">
import { useProfileStore, useUserRentalStore, useItemStore, useTestStore, useAdminStore } from './store';
import { onMounted } from 'vue';

const itemStore = useItemStore();
const profileStore = useProfileStore();
const userStore = useUserRentalStore();
const testStore = useTestStore();
const adminStore = useAdminStore();

onMounted(async () => {
	await profileStore.setupAdminSession(null);
	await itemStore.requestItemTypes();
	await userStore.requestUserSessions();
	await adminStore.requestAllSessions();
	testStore.init();
});
</script>

<template>
	<main class="main">
		<RouterView />
	</main>
</template>

<style scoped>
.main {
	width: min(900px, 100%);
	margin: 0 auto;
}
</style>
