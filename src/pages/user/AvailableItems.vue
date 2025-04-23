<template>
	<v-container class="pa-2 d-flex flex-column align-center">
		<v-data-iterator :items="processedItems" :items-per-page="-1">
			<template v-slot:header>
				<v-toolbar color="surface-variant">
					<v-toolbar-title class="text-h4">Доступные предметы</v-toolbar-title>
					<v-spacer></v-spacer>
				</v-toolbar>
			</template>

			<template v-slot:default="{ items }">
				<v-row class="justify-center" no-gutters style="row-gap: 20px; width: 100%">
					<v-col
						v-for="(item, i) in items"
						:key="i"
						cols="12"
						sm="6"
						md="5"
						lg="4"
						class="px-2 mb-4 d-flex justify-center"
					>
						<ItemTypeCard :itemType="item.raw" />
					</v-col>
				</v-row>
			</template>
		</v-data-iterator>
	</v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useItemStore } from '@/store/itemStore';
import { useTestStore } from '@/store/testRequestStore';
import ItemTypeCard from '@/components/ItemTypeCard.vue';

const itemStore = useItemStore();
const testStore = useTestStore();

onMounted(async () => {
	await itemStore.requestItemTypes();
	testStore.init();
});

const processedItems = computed(() =>
	itemStore.getItemTypes().map(item => ({
		...item,
		image_url:
			item.image_url ||
			'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_Ii1DL7ODGnKq1PR_YPBYb_107OyaPm5Qwg&s',
		//description: item.description || 'Конь в пальто'
		name: item.name || 'Название отсутствует',
		description: item.description || 'Описание отсутствует',
	})),
);
</script>
