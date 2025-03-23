<template>
  <v-container class="pa-2 d-flex flex-column align-center">
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
        <v-row class="justify-center" no-gutters style="row-gap: 20px; width: 100%">
          <v-col v-for="(item, i) in items" :key="i" cols="12" sm="6" md="5" lg="4"
            class="px-2 mb-4 d-flex justify-center">
            <v-card class="mx-auto rounded-lg d-flex flex-column" style="width: 100%; max-width: 300px; height: 100%;">

              <!-- Изображение -->
              <div class="image-container">
                <v-img :src="item.raw.image_url" :aspect-ratio="1" contain>
                  <template v-if="!item.raw.image_url">
                    <v-sheet height="100%" color="grey-lighten-3"></v-sheet>
                  </template>
                </v-img>
              </div>

              <!-- Контент карточки -->
              <div class="card-content pa-4 flex-grow-1">
                <v-card-title class="text-wrap font-weight-bold pb-0 card-title">
                  {{ item.raw.name || 'название отсутсвует' }}
                </v-card-title>
                <v-card-subtitle class="text-wrap pt-1 card-description">
                  {{ item.raw.description || 'Описание отсутствует' }}
                </v-card-subtitle>
              </div>

              <!-- Кнопка и статус -->
              <v-card-actions class="pa-4 pt-0" style="position: relative;">
                <!-- Надпись в левом нижнем углу -->
                <div class="status-container">
                  <span v-if="getButtonState(item.raw).text === 'Нет в наличии'" class="status-text">
                    <span style="padding-left: 9px">нет в</span><br>
                    <span>наличии</span>
                  </span>
                </div>

                <!-- Кнопка в правом нижнем углу -->
                <div class="button-container">
                  <v-btn v-if="getButtonState(item.raw).showButton" :disabled="getButtonState(item.raw).disabled"
                    @click="handleButtonClick(item.raw)" color="primary" class="action-button rounded-sm"
                    variant="tonal">
                    {{ getButtonState(item.raw).action === 'cancel' ? 'Отменить' : 'Забронировать' }}
                  </v-btn>
                </div>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>

    <!-- Модальное окно -->
    <v-dialog v-model="showDialog" max-width="400">
      <v-card class="rounded-lg">
        <!---<v-card-title class="text-h6 px-4 pt-4">Подтвердите действие</v-card-title>-->
        <v-card-text class="px-4 pb-0">Подтвердите действие</v-card-text>
        <v-card-actions class="d-flex justify-end ga-2 pa-4">
          <v-btn @click="cancelAction" color="error" variant="tonal" size="large" class="auth-edit-button rounded-sm">
            Нет
          </v-btn>
          <v-btn @click="confirmAction" color="primary" variant="tonal" size="large"
            class="auth-edit-button rounded-sm">
            Да
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.card-title {
  font-size: 1.25rem !important;
  line-height: 1.4;
}

.card-description {
  font-size: 0.95rem !important;
  color: rgb(0 0 0 / 70%) !important;
  min-height: 60px;
}

.status-container {
  font-size: 1.2rem;
  position: absolute;
  left: 16px;
  bottom: 16px;
  line-height: 1.2;
}

.button-container {
  position: absolute;
  right: 16px;
  bottom: 16px;
}

.action-button {
  letter-spacing: normal !important;
  text-transform: none !important;
  font-weight: 700 !important;
  font-size: 1rem !important;
  padding: 12px 24px !important;
  min-width: 120px !important;
  height: 48px !important;
  border-radius: 8px !important;
}

.v-dialog .v-card {
  padding: 24px;
}

.v-dialog .v-card-text {
  font-size: 1.25rem !important;
  font-weight: 500;
  text-align: center;
  padding: 24px 0 !important;
}

.auth-edit-button {
  min-width: 100px !important;
  height: 40px !important;
  border-radius: 4px !important;
  letter-spacing: normal !important;
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useItemStore } from '@/store/itemStore';
import { useTestStore } from '@/store/testRequestStore';

const itemStore = useItemStore();
const testStore = useTestStore();
const itemsPerPage = ref(4);
const currentUserId = 177;
const showDialog = ref(false);
const pendingItem = ref<any>(null);
const pendingAction = ref<string>('');

onMounted(async () => {
  await itemStore.requestItemTypes();
  testStore.init(); // Инициализируем тестовые данные
});

const processedItems = computed(() =>
  itemStore.getItemTypes().map(item => ({
    ...item,
    image_url: item.image_url || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_Ii1DL7ODGnKq1PR_YPBYb_107OyaPm5Qwg&s',
    description: item.description || 'Конь в пальто'
  }))
);

const getButtonState = (item) => {
  const userSessions = testStore.getSessions().filter(session =>
    session.item_id === item.id && session.user_id === currentUserId
  );

  const activeSession = userSessions.find(s => s.status === 'active');
  const reservedSession = userSessions.find(s => s.status === 'reserved');
  const overdueSession = userSessions.find(s => s.status === 'overdue');

  const isAvailable = computed(() => {
    const allSessions = testStore.getSessions();
    const activeOrReserved = allSessions.filter(s =>
      s.item_id === item.id && (s.status === 'active' || s.status === 'reserved')
    );
    return activeOrReserved.length === 0;
  });

  if (activeSession) {
    return {
      disabled: true,
      text: 'В прокате',
      showButton: true
    };
  }
  if (reservedSession) {
    return {
      disabled: false,
      text: 'Отменить',
      action: 'cancel',
      showButton: true
    };
  }
  if (overdueSession) {
    const time = new Date(overdueSession.value.reservation_ts).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return {
      disabled: true,
      text: `Забронировать повторно в ${time}`,
      showButton: false
    };
  }
  if (!isAvailable.value) {
    return {
      disabled: true,
      text: 'Нет в наличии',
      showButton: true
    };
  }
  return {
    disabled: false,
    text: 'Забронировать',
    action: 'reserve',
    showButton: true
  };
};

const handleButtonClick = (item) => {
  const state = getButtonState(item);
  if (state.disabled) return;

  pendingItem.value = item;
  pendingAction.value = state.action || '';
  showDialog.value = true;
};

const confirmAction = async () => {
  showDialog.value = false;
  try {
    if (pendingAction.value === 'reserve') {
      await fetch(`/rental-sessions/${pendingItem.value.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId })
      });
    } else if (pendingAction.value === 'cancel') {
      const session = testStore.getSessions().find(s =>
        s.item_id === pendingItem.value.id && s.user_id === currentUserId
      );
      if (session) {
        await fetch(`/rental-sessions/${session.id}`, { method: 'DELETE' });
      }
    }
    testStore.init(); // Обновляем данные сессий
  } catch (error) {
    console.error('Ошибка:', error);
  }
  pendingItem.value = null;
};

const cancelAction = () => {
  showDialog.value = false;
  pendingItem.value = null;
};

const seeAllButtonText = computed(() =>
  itemsPerPage.value === 4 ? 'Показать все' : 'Свернуть'
);

function onClickSeeAll() {
  itemsPerPage.value = itemsPerPage.value === 4 ? processedItems.value.length : 4;
}
</script>