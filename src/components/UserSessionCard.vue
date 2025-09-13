<script setup lang="ts">
import { RentalSession } from '@/models';
import { useItemStore } from '@/store';
import { computed, onMounted } from 'vue';
import StrikeChip from './StrikeChip.vue';

const props = defineProps<{
	session: RentalSession;
}>();

const itemStore = useItemStore();
const itemName = computed(() => itemStore.itemTypes.find(i => i.id === props.session.item_type_id)?.name);

onMounted(() => {
	console.log(itemStore.itemTypes);
	console.log(itemName.value);
});
</script>

<template>
	<v-card variant="elevated" max-width="500px" rounded="lg">
		<template #prepend>
			<div>
				<v-img
					aspect-ratio="1"
					cover
					min-width="100px"
					src="https://pulsephotography.com.au/wp-content/uploads/2017/10/16x9-placeholder.jpg"
				></v-img>
			</div>
		</template>
		<template #title>{{ itemName }}</template>
		<template #subtitle>#{{ session.id }}</template>
		<template #item>{{ new Date(Date.parse(session.reservation_ts)).toLocaleString() }}</template>
		<template #append>
			<StrikeChip v-if="!!session.strike_id" />
		</template>
	</v-card>
</template>

<style lang="css" scoped></style>
