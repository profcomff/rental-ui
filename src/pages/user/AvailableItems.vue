<template>
  <v-container>
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
          <v-col v-for="(item, i) in items" :key="i" cols="6" sm="4" md="3">
            <v-card height="250">
              <!--<v-img :src="item.raw.image_url || 'default-image-url.jpg'" height="150" cover></v-img> -->
              <!--<v-card-title>{{ item.raw.name || 'defult-description' }}</v-card-title> -->
              <!-- <v-card-subtitle>{{ item.raw.description || 'Описание отсутствует' }}</v-card-subtitle> -->
              <v-img :src="'default-image-url.jpg'" height="150" cover></v-img>
              <v-card-title>{{ 'defult-description' }}</v-card-title>
              <v-card-subtitle>{{ 'Описание отсутствует' }}</v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ItemType } from '@/models/index'; // Импортируем тип

interface DataIteratorItem {
  raw: ItemType;
}

const itemsPerPage = ref(4);

const mockItems: ItemType[] = [
  {
    id: 1,
    name: 'Павербанк Xiaomi',
    image_url: 'https://example.com/powerbank.jpg',
    description: 'Мощный павербанк на 20000 mAh',
  },
  {
    id: 2,
    name: 'Ручка Parker',
    image_url: 'https://example.com/pen.jpg',
    description: 'Премиальная шариковая ручка',
  },
  {
    id: 3,
    name: 'Теннисная ракетка',
    image_url: 'https://example.com/racket.jpg',
    description: 'Профессиональная ракетка',
  },
  {
    id: 4,
    name: 'Словарь Ожегова',
    image_url: 'https://example.com/dictionary.jpg',
    description: 'Толковый словарь русского языка',
  },
  {
    id: 5,
    name: 'Наушники Sony',
    image_url: 'https://example.com/headphones.jpg',
    description: 'Беспроводные наушники',
  },
  {
    id: 6,
    name: 'Зонт',
    image_url: 'https://example.com/umbrella.jpg',
    description: 'Складной зонт-автомат',
  },
  {
    id: 7,
    name: 'Фонарик',
    image_url: 'https://example.com/flashlight.jpg',
    description: 'Светодиодный фонарь',
  },
  {
    id: 8,
    name: 'Калькулятор',
    image_url: 'https://example.com/calculator.jpg',
    description: 'Инженерный калькулятор',
  },
];

// Преобразуем mockItems в массив DataIteratorItem
const items = computed<DataIteratorItem[]>(() =>
  mockItems.map(item => ({
    raw: {
      ...item,
      image_url: item.image_url || '', // Заглушка для отсутствующих изображений
      description: item.description || '' // Заглушка для отсутствующих описаний
    }
  }))
);

const seeAllButtonText = computed(() =>
  itemsPerPage.value === 4 ? 'Показать все' : 'Свернуть'
);

function onClickSeeAll() {
  itemsPerPage.value = itemsPerPage.value === 4 ? mockItems.length : 4;
}
</script>