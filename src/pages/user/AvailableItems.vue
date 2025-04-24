<script setup lang="ts">
import { computed, onMounted, ref, watch, nextTick } from 'vue';
import { useItemStore } from '@/store/itemStore';
import { useTestStore } from '@/store/testRequestStore';
import ItemTypeCard from '@/components/ItemTypeCard.vue';

const itemStore = useItemStore();
const testStore = useTestStore();
const itemCards = ref<InstanceType<typeof ItemTypeCard>[]>([]);

onMounted(async () => {
	await itemStore.requestItemTypes();
	testStore.init();
	setEqualCardHeights();
});

const processedItems = computed(() =>
	itemStore.getItemTypes().map(item => ({
		...item,
		image_url:
			item.image_url ||
			'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_Ii1DL7ODGnKq1PR_YPBYb_107OyaPm5Qwg&s',
		name: item.name || 'Название отсутствует',
		description: item.description || 'Описание отсутствует',
	})),
);

// Вотчер для отслеживания изменений в данных
watch(
	() => processedItems.value,
	() => {
		nextTick(() => {
			setEqualCardHeights();
		});
	},
	{ deep: true },
);

// Функция выравнивания высот карточек
function setEqualCardHeights() {
	nextTick(() => {
		const cards = itemCards.value;
		if (!cards || cards.length === 0) return;

		let maxHeight = 0;

		// Первый проход - сброс высоты и расчет максимальной
		cards.forEach(card => {
			if (card?.$el) {
				card.$el.style.height = 'auto';
				const cardHeight = card.$el.offsetHeight;
				maxHeight = Math.max(maxHeight, cardHeight);
			}
		});

		// Второй проход - установка единой высоты
		cards.forEach(card => {
			if (card?.$el) {
				card.$el.style.height = `${maxHeight}px`;
			}
		});
	});
}
</script>

<template>
	<v-container fluid class="pa-0 d-flex flex-column align-center">
		<v-data-iterator :items="processedItems" :items-per-page="-1">
			<template v-slot:header>
				<v-toolbar color="surface-variant">
					<v-toolbar-title class="items-title">Доступные предметы</v-toolbar-title>
					<v-spacer></v-spacer>
				</v-toolbar>
			</template>

			<template v-slot:default="{ items }">
				<v-row class="items-row" no-gutters>
					<v-col
						v-for="(item, i) in items"
						:key="i"
						cols="12"
						sm="6"
						md="5"
						lg="4"
						xl="3"
						class="item-col d-flex justify-center"
					>
						<ItemTypeCard :itemType="item.raw" class="fill-height card" ref="itemCards" />
					</v-col>
				</v-row>
			</template>
		</v-data-iterator>
	</v-container>
</template>

<style scoped>
.items-title {
	font-family: 'Roboto Flex', sans-serif !important;
	font-size: 2.125rem !important;
	font-weight: 400;
	line-height: 2.5rem;
	letter-spacing: 0.0074em !important;
}

.items-row {
	row-gap: 10px;
	width: 100%;
}

.item-col {
	height: 100%;
	display: flex;
}

.card {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.text-h4 {
	font-size: 2.125rem;
	font-weight: 400;
	line-height: 2.5rem;
	letter-spacing: 0.0074em;
}
</style>
