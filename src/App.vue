<script setup lang="ts">
import ToastQueue from './components/ToastQueue.vue';
import { useProfileStore, useItemStore } from './store';
import { onMounted } from 'vue';

const itemStore = useItemStore();
const profileStore = useProfileStore();

onMounted(async () => {
	profileStore.fromUrl();
	if (import.meta.env.MODE === 'development') await profileStore.setupDevAdminSession(null); // uncomment if debugging
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
	<ToastQueue />
</template>

<style scoped>
.main {
	width: min(900px, 100%);
	margin: 0 auto;
}
</style>
