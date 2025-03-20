<template>
  <v-data-iterator :items="items" :items-per-page="itemsPerPage">
    <template v-slot:header="{ page, pageCount, prevPage, nextPage }">
      <h1 class="text-h4 font-weight-bold d-flex justify-space-between mb-4 align-center">
        <div class="text-truncate">
          Доступные предметы
        </div>

        <div class="d-flex align-center">
          <v-btn class="me-8" variant="text" @click="onClickSeeAll">
            <span class="text-decoration-underline text-none">Все предметы</span>
          </v-btn>

          <div class="d-inline-flex">
            <v-btn :disabled="page === 1" class="me-2" icon="mdi-arrow-left" size="small" variant="tonal"
              @click="prevPage"></v-btn>

            <v-btn :disabled="page === pageCount" icon="mdi-arrow-right" size="small" variant="tonal"
              @click="nextPage"></v-btn>
          </div>
        </div>
      </h1>
    </template>

    <template v-slot:default="{ items }">
      <v-row>
        <v-col v-for="(item, i) in items" :key="i" cols="6" sm="6" xl="3">
          <ItemTypeCard :item="item.raw" @rent="handleRent" @cancel="handleCancel" />
        </v-col>
      </v-row>
    </template>

    <template v-slot:footer="{ page, pageCount }">
      <v-footer class="justify-space-between text-body-2 mt-4" color="surface-variant">
        Всего предметов: {{ items.length }}

        <div>
          Страница {{ page }} из {{ pageCount }}
        </div>
      </v-footer>
    </template>
  </v-data-iterator>
</template>

<script setup lang="ts">
//import { shallowRef } from 'vue'
//import ItemTypeCard from '@/components/ItemTypeCard.vue'

interface RentalItem {
  id: number
  name: string
  image: string
  available: boolean
  rentalSession?: {
    id: string
    status: 'active' | 'reserved' | 'expired'
    pickupTime?: string
  }
}
<script setup lang = "ts">
import { shallowRef } from 'vue'
import ItemTypeCard from '@/components/ItemTypeCard.vue'

interface RentalSession {
  id: string
  status: 'active' | 'reserved' | 'expired'
  pickupTime?: string
}

interface RentalItem {
  id: number
  name: string
  image: string
  available: boolean
  rentalSession?: RentalSession // Исправлено: явно указан optional параметр
}

const itemsPerPage = shallowRef(8)
const items = shallowRef<RentalItem[]>([
  {
    id: 1,
    name: 'Павербанк Xiaomi',
    image: 'https://example.com/powerbank.jpg',
    available: true
  },
  {
    id: 2,
    name: 'Ручка Parker',
    image: 'https://example.com/pen.jpg',
    available: false
  },
  {
    id: 3,
    name: 'Теннисная ракетка',
    image: 'https://example.com/racket.jpg',
    available: true,
    rentalSession: {
      id: '123',
      status: 'reserved',
      pickupTime: '11:11'
    }
  },
  {
    id: 4,
    name: 'Словарь Ожегова',
    image: 'https://example.com/dictionary.jpg',
    available: true
  },
  {
    id: 5,
    name: 'Наушники Sony',
    image: 'https://example.com/headphones.jpg',
    available: true
  },
  {
    id: 6,
    name: 'Зонт',
    image: 'https://example.com/umbrella.jpg',
    available: false
  },
  {
    id: 7,
    name: 'Фонарик',
    image: 'https://example.com/flashlight.jpg',
    available: true
  },
  {
    id: 8,
    name: 'Калькулятор',
    image: 'https://example.com/calculator.jpg',
    available: true
  }
])

function onClickSeeAll() {
  itemsPerPage.value = itemsPerPage.value === 8 ? items.value.length : 8
}

function handleRent(itemId: number) {
  // API call to /rental-sessions/{item_type_id}
  console.log('Rent item:', itemId)
}

function handleCancel(sessionId: string) {
  // API call to /rental-sessions/{session_id}
  console.log('Cancel session:', sessionId)
}
</script>