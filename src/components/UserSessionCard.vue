<script setup lang="ts">
import { RentalSession } from '@/models';
import { useItemStore } from '@/store';
import { computed } from 'vue';
import StrikeChip from './StrikeChip.vue';

const props = defineProps<{
	session: RentalSession;
}>();

const itemStore = useItemStore();
const itemType = computed(() => itemStore.itemTypes.find(i => i.id === props.session.item_type_id));
</script>

<template>
	<v-card variant="elevated" rounded="lg">
		<template #prepend>
			<div>
				<v-img
					aspect-ratio="1"
					cover
					min-width="100px"
					:src="useItemStore().constructPictureUrl(itemType?.image_url)"
				></v-img>
			</div>
		</template>
		<template #title>{{ itemType?.name }}</template>
		<template #subtitle>#{{ session.id }}</template>
		<template #item>{{ new Date(Date.parse(session.reservation_ts)).toLocaleDateString('ru-RU') }}</template>
		<template #append>
			<StrikeChip v-if="!!session.strike_id" text="Страйк" />
		</template>
	</v-card>
</template>

<style lang="css" scoped></style>
