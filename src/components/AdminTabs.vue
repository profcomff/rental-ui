<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
	currentTab: { type: String, required: true },
});

const tab = ref(props.currentTab);
</script>

<template>
	<v-tabs
		class="position-fixed top-0 left-50 bg-white"
		style="z-index: 1000; width: min(100%, 900px)"
		v-model="tab"
		@update:model-value="$router.push(tab)"
	>
		<v-tab value="/admin/requests">Заявки</v-tab>
		<v-tab value="/admin/active">Текущие</v-tab>
		<v-tab value="/admin/journal">Архив</v-tab>
		<v-tab value="/admin/items">Айтемы</v-tab>
		<v-tab value="/">Пользовательская</v-tab>
	</v-tabs>
</template>
