<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import { RESERVATION_TIME_MS } from '@/constants';
import { useToastStore } from '@/store';

const toastStore = useToastStore();

const props = defineProps({
	duration: { type: Number, required: true, default: RESERVATION_TIME_MS },
	startTime: { type: Date, required: true },
});
const emit = defineEmits(['time-ran-out']);

const duration = computed(() => props.duration);
const endTs = computed(
	() => props.startTime.getTime() + duration.value - props.startTime.getTimezoneOffset() * 60 * 1000,
);
const nowTs = ref(Date.now());
const timeToShow = computed(() => {
	const theTime = endTs.value - nowTs.value;
	return theTime < 0 ? 0 : theTime;
});

function handleClockUpdate() {
	nowTs.value = Date.now();
	if (timeToShow.value <= 0) {
		emit('time-ran-out');
		toastStore.warning({ title: 'Время брони вышло' });
		clearInterval(intervalId);
	}
}

const intervalId = setInterval(handleClockUpdate, 1000);

onUnmounted(() => clearInterval(intervalId));
</script>

<template>
	<span>{{ (timeToShow / 1000).toFixed(0) }} с</span>
</template>
