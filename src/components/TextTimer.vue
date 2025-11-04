<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from 'vue';
import { RESERVATION_TIME_MS } from '@/constants';
import { useToastStore } from '@/store';

const toastStore = useToastStore();

const props = defineProps({
	// For count-up mode: pass only startTime
	// For count-down to deadline: pass only deadline
	// For count-down with duration: pass startTime and duration
	startTime: { type: Date, required: false },
	deadline: { type: Date, required: false },
	duration: { type: Number, required: false, default: RESERVATION_TIME_MS },
	mode: {
		type: String as () => 'count-up' | 'count-down',
		required: false,
		default: 'count-down',
	},
});

const emit = defineEmits(['time-ran-out']);

const nowTs = ref(Date.now());

const targetTs = computed(() => {
	if (props.deadline) {
		return props.deadline.getTime();
	} else if (props.startTime && props.duration) {
		return props.startTime.getTime() + props.duration;
	} else if (props.startTime) {
		// Count up from start time
		return props.startTime.getTime();
	}
	return 0;
});

// Compute time difference based on mode
const timeToShow = computed(() => {
	if (props.mode === 'count-up') {
		const elapsed = nowTs.value - targetTs.value;
		return elapsed < 0 ? 0 : elapsed;
	} else {
		const remaining = targetTs.value - nowTs.value;
		return remaining < 0 ? 0 : remaining;
	}
});

// Time formatting computations
const seconds = computed(() =>
	Math.floor((timeToShow.value / 1000) % 60)
		.toString()
		.padStart(2, '0'),
);

const minutes = computed(() =>
	Math.floor((timeToShow.value / (60 * 1000)) % 60)
		.toString()
		.padStart(2, '0'),
);

const hours = computed(() =>
	Math.floor(timeToShow.value / (60 * 60 * 1000))
		.toString()
		.padStart(2, '0'),
);

// Check if time has run out (for count-down mode)
const hasTimeRunOut = computed(() => props.mode === 'count-down' && timeToShow.value <= 0);

function handleClockUpdate() {
	nowTs.value = Date.now();

	if (hasTimeRunOut.value) {
		emit('time-ran-out');
		toastStore.warning({ title: 'Время брони вышло' });
		clearInterval(intervalId);
	}
}

const intervalId = setInterval(handleClockUpdate, 1000);

// Watch for prop changes to restart timer if needed
watch([() => props.startTime, () => props.deadline, () => props.duration], () => {
	nowTs.value = Date.now(); // Reset current time reference
});

onUnmounted(() => clearInterval(intervalId));
</script>

<template>
	<span v-if="Number(hours) > 0" class="font-weight-bold"> {{ hours }}:{{ minutes }}:{{ seconds }} </span>
	<span v-else class="font-weight-bold"> {{ minutes }}:{{ seconds }} </span>
</template>
