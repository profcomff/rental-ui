<script setup lang="ts">
import ActiveSessionCard from '@/components/ActiveSessionCard.vue';
import UserTabs from '@/components/UserTabs.vue';
import { useItemStore, useUserSessions } from '@/store';
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';

const itemStore = useItemStore();
const userSessions = useUserSessions();
const { activePageSessions } = storeToRefs(userSessions);

const evenActivePageSessions = computed(() => activePageSessions.value.filter((_, idx) => idx % 2 === 0));
const oddActivePageSessions = computed(() => activePageSessions.value.filter((_, idx) => idx % 2 === 1));

onMounted(async () => {
	itemStore.requestItemTypes();
	userSessions.requestActive();
});
</script>

<template>
	<UserTabs current-tab="/active" />
	<div v-if="activePageSessions.length > 0" class="column-container" style="margin-top: 100px">
		<v-col class="d-flex flex-column align-center pa-0">
			<ActiveSessionCard v-for="s in evenActivePageSessions" :key="s.id" :session="s" />
		</v-col>
		<v-col class="d-flex flex-column align-center pa-0">
			<ActiveSessionCard v-for="s in oddActivePageSessions" :key="s.id" :session="s" />
		</v-col>
	</div>
	<p v-else class="pa-2 font-weight-bold">Нет активных сессий!</p>
</template>

<style lang="css" scoped>
.column-container {
	display: grid;
	grid-template-columns: 1fr 1fr;
	column-gap: 8px;
}
</style>
