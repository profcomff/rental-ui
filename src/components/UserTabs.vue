<script setup lang="ts">
import { router } from '@/router';
import { useProfileStore } from '@/store';
import { storeToRefs } from 'pinia';
import { ref, PropType } from 'vue';
import StatusBar from './StatusBar.vue';

type Tab = '/' | '/active' | '/log' | '/admin/';
const props = defineProps({
	currentTab: { type: String as PropType<Tab>, required: true },
});
const tab = ref(props.currentTab);

const { isAdmin } = storeToRefs(useProfileStore());

async function sameTabClick(location: Tab) {
	if (location === tab.value) {
		await router.replace(tab.value);
	}
}
</script>

<template>
	<v-tabs
		class="position-fixed top-0 left-50"
		style="z-index: 1000; width: min(100%, 900px)"
		v-model="tab"
		bg-color="primary"
		grow
		@update:model-value="$router.push(tab)"
	>
		<v-tab value="/" @click="sameTabClick('/')">Аренда</v-tab>
		<v-tab value="/active" @click="sameTabClick('/active')">Текущие</v-tab>
		<v-tab value="/log" @click="sameTabClick('/log')">Журнал</v-tab>
		<v-tab v-if="isAdmin" value="/admin/">Админка</v-tab>
	</v-tabs>
	<StatusBar
		v-if="tab !== '/log'"
		class="position-fixed"
		style="z-index: 2000; width: min(100%, 900px); top: 48px"
	></StatusBar>
</template>
