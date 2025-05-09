<script setup lang="ts">
import { useProfileStore } from './store';
import { onMounted } from 'vue';
import { useItemStore } from './store/itemStore';
import { useTestStore } from './store/testRequestStore';
import { setupAdminSession } from './api';

const profileStore = useProfileStore();
const itemStore = useItemStore();
const testStore = useTestStore();

onMounted(() => {
	profileStore.fromUrl();
	itemStore.requestItemTypes();
	testStore.init();

	setupAdminSession();
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
