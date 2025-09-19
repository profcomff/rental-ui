<script setup lang="ts">
import { useProfileStore } from '@/store';
import { storeToRefs } from 'pinia';
import { ref, PropType } from 'vue';

type Tab = '/' | '/active' | '/log' | '/admin/';
const props = defineProps({
	currentTab: { type: String as PropType<Tab>, required: true },
});
const tab = ref(props.currentTab);

const { isAdmin } = storeToRefs(useProfileStore());
</script>

<template>
	<v-tabs v-model="tab" bg-color="primary" grow @update:model-value="$router.push(tab)">
		<v-tab value="/">Аренда</v-tab>
		<v-tab value="/active">Текущие</v-tab>
		<v-tab value="/log">Журнал</v-tab>
		<v-tab v-if="isAdmin" value="/admin/">Админка</v-tab>
	</v-tabs>
</template>
