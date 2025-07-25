<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
	currentTab: { type: String, required: true },
});

const tab = ref(props.currentTab);
</script>

<template>
	<v-tabs v-model="tab" @update:model-value="$router.push(tab)">
		<v-tab value="/">Аренда</v-tab>
		<v-tab value="/active">Текущие</v-tab>
		<v-tab value="/log">Журнал</v-tab>
		<v-tab value="/admin/">Админка</v-tab>
		<v-tab value="/debug">Залогиниться</v-tab>
	</v-tabs>
</template>
