<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
	currentTab: { type: String, required: true },
});

const tab = ref(props.currentTab);
</script>

<template>
	<v-tabs v-model="tab" @update:model-value="$router.push(tab)">
		<v-tab value="/admin/requests">Заявки</v-tab>
		<v-tab value="/admin/active">Текущие</v-tab>
		<v-tab value="/admin/journal">Архив</v-tab>
		<v-tab value="/admin/log">Журнал действий</v-tab>
		<v-tab value="/admin/items">Айтемы</v-tab>
		<v-tab value="/">Пользовательская</v-tab>
		<v-tab v-if="import.meta.env.MODE === 'development'" value="/debug">Залогиниться</v-tab>
	</v-tabs>
</template>
