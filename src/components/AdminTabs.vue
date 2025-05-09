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
		<v-tab value="/admin/log">Журнал</v-tab>
	</v-tabs>
</template>
