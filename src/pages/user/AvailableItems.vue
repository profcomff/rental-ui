<template>
  <v-container class="pa-2 justify-center">
    <v-data-iterator :items="processedItems" :items-per-page="itemsPerPage">
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
            <v-card class="d-flex flex-column">
              <div class="image-container">
                <v-img :src="item.raw.image_url" :aspect-ratio="1" contain>
                  <template v-if="!item.raw.image_url">
                    <v-sheet height="100%" color="grey-lighten-3"></v-sheet>
                  </template>
                </v-img>
              </div>

              <v-card-title class="text-wrap">{{ item.raw.name }}</v-card-title>
              <v-card-subtitle class="text-wrap">
                {{ item.raw.description || 'Описание отсутствует' }}
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<style scoped>
.image-container {
  position: relative;
  width: 100%;
  padding-top: 100%;
}

.v-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.v-card {
  height: 100%;
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useItemStore } from '@/store/itemStore';

const itemStore = useItemStore();
const itemsPerPage = ref(4);

onMounted(async () => {
  await itemStore.requestItemTypes();
});

const processedItems = computed(() =>
  itemStore.getItemTypes().map(item => ({
    ...item,
    image_url: item.image_url || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_Ii1DL7ODGnKq1PR_YPBYb_107OyaPm5Qwg&s',
    description: item.description || 'Конь в пальто'
  }))
);

const seeAllButtonText = computed(() =>
  itemsPerPage.value === 4 ? 'Показать все' : 'Свернуть'
);

function onClickSeeAll() {
  itemsPerPage.value = itemsPerPage.value === 4 ? processedItems.value.length : 4;
}
</script>