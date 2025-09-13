<script setup lang="ts">
import { useToastStore } from '@/store';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';

const toastStore = useToastStore();
const { queue } = storeToRefs(toastStore);
const toast = computed(() => queue.value[0]);
const toastIcon = computed(() => {
	if (!toast.value) return 'mdi-information-outline';
	switch (toast.value.state) {
		case 'success':
			return 'mdi-check-circle-outline';
		case 'warning':
			return 'mdi-alert-circle';
		case 'error':
			return 'mdi-close-circle';
		default:
			return 'mdi-information-outline';
	}
});

const visible = ref(false);

watch(
	queue,
	newQueue => {
		if (newQueue.length > 0 && !visible.value) {
			visible.value = true;
		}
		console.log(toastIcon);
	},
	{ deep: true },
);

function onClose(id: number) {
	visible.value = false;
	toastStore._remove(id);
}
</script>

<template>
	<div class="fixed bottom-4 right-4">
		<v-snackbar
			v-if="queue.length > 0"
			v-model="visible"
			:key="toast.id"
			:timeout="toast.timeout"
			:color="toast.state"
			@update:model-value="val => !val && onClose(queue[0].id)"
		>
			<div class="d-flex align-center">
				<v-icon class="mr-3" :icon="toastIcon" color="white"></v-icon>
				<div>
					<h4 class="font-medium">{{ toast.title }}</h4>
					<p v-if="toast.description" class="text-sm opacity-80">
						{{ toast.description }}
					</p>
				</div>
			</div>
		</v-snackbar>
	</div>
</template>
