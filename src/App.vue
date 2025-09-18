<script setup lang="ts">
import { useProfileStore, useItemStore } from './store';
import { onMounted } from 'vue';

const itemStore = useItemStore();
const profileStore = useProfileStore();

onMounted(async () => {
	await profileStore.setupAdminSession(null);
	await itemStore.requestItemTypes();
});
</script>

<template>
	<main class="main">
		<Suspense>
			<RouterView />

			<template #fallback> Loading... </template>
		</Suspense>
	</main>
</template>

<style scoped>
.main {
	width: min(900px, 100%);
	margin: 0 auto;
}
</style>
