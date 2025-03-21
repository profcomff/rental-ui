<template>
  <v-container class="pa-2 justify-center">
    <v-data-iterator :items="items" :items-per-page="itemsPerPage">
      <template v-slot:header="{ page, pageCount, prevPage, nextPage }">
        <v-toolbar color="surface-variant">
          <v-toolbar-title class="text-h4">Доступные предметы</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="onClickSeeAll">
            {{ seeAllButtonText }}
          </v-btn>
          <v-btn :disabled="page === 1" icon="mdi-chevron-left" variant="tonal" @click="prevPage"></v-btn>
          <v-btn :disabled="page === pageCount" icon="mdi-chevron-right" variant="tonal" @click="nextPage"></v-btn>
        </v-toolbar>
      </template>

      <template v-slot:default="{ items }">
        <v-row>
          <v-col v-for="(item, i) in items" :key="i" cols="6" sm="4" md="4">
            <v-card height="200">
              <v-img :src="item.raw.image_url || 'https://image.mel.fm/i/P/P5zrJ8p5uM/1200.jpg'" height="150" cover></v-img>
              <v-card-title>{{ item.raw.name }}</v-card-title>
              <v-card-subtitle>{{ item.raw.description || 'Описание отсутствует' }}</v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useItemStore } from '@/store/itemStore';
import type { ItemType } from '@/models/index';

interface DataIteratorItem {
  raw: ItemType;
}

const itemStore = useItemStore();
const itemsPerPage = ref(4);

// Загрузка данных при монтировании компонента
onMounted(() => {
  itemStore.requestItemTypes();
});

// Используем данные из хранилища вместо моков
const items = computed<DataIteratorItem[]>(() =>
  itemStore.getItemTypes().map(item => ({
    raw: {
      ...item,
      image_url: item.image_url || '/default-image.jpg',
      description: item.description || 'Описание отсутствует'
    }
  }))
);

const seeAllButtonText = computed(() =>
  itemsPerPage.value === 4 ? 'Показать все' : 'Свернуть'
);

function onClickSeeAll() {
  itemsPerPage.value = itemsPerPage.value === 4 ? items.value.length : 4;
}
</script>