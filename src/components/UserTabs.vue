<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
	currentTab: { type: String, required: true },
});

const tab = ref(props.currentTab);
</script>

<template>
	<v-tabs v-model="tab" @update:model-value="$router.push(tab)">
		<v-tab value="/user/items">Доступные</v-tab>
		<v-tab value="/user/active">Текущие</v-tab>
		<v-tab value="/user/log">Журнал</v-tab>
	</v-tabs>
</template>
