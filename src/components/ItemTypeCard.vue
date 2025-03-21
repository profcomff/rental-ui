<template>
    <v-sheet border>
        <v-img :src="itemType.image_url || 'placeholder.jpg'" height="200" cover></v-img>

        <v-list-item :title="itemType.name" density="comfortable" lines="two">
            <template v-slot:title>
                <strong class="text-h6">{{ itemType.name }}</strong>
            </template>
        </v-list-item>

        <v-card-actions class="pa-4">
            <v-row align="center">
                <v-col cols="6">
                    <span>{{ buttonState.text }}</span>
                </v-col>
                <v-col cols="6" class="text-right">
                    <v-btn v-if="buttonState.showButton" :disabled="buttonState.disabled" @click="handleButtonClick"
                        color="secondary" variant="tonal">
                        {{ buttonState.action === 'cancel' ? 'Отменить' : 'Забронировать' }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-actions>

        <v-dialog v-model="showDialog" max-width="400">
            <v-card>
                <v-card-title class="text-h6">Подтвердите действие</v-card-title>
                <v-card-text>Вы уверены, что хотите выполнить это действие?</v-card-text>
                <v-card-actions class="d-flex justify-end">
                    <v-btn @click="cancelAction" color="error" variant="text">Нет</v-btn>
                    <v-btn @click="confirmAction" variant="text" color="primary">Да</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-sheet>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTestStore } from '@/store/testRequestStore';
import { ItemType } from '@/models/index';

const props = defineProps<{
    itemType: ItemType & {
        rentalSession?: {
            id: string;
            status: string;
            pickupTime?: string;
        }
    }
}>();

const testStore = useTestStore();
const currentUserId = 177; // Заглушка для текущего пользователя

const userSessions = computed(() => {
    return testStore.getSessions().filter(session =>
        session.item_id === props.itemType.id && session.user_id === currentUserId
    );
});

const activeSession = computed(() =>
    userSessions.value.find(s => s.status === 'active')
);
const reservedSession = computed(() =>
    userSessions.value.find(s => s.status === 'reserved')
);
const overdueSession = computed(() =>
    userSessions.value.find(s => s.status === 'overdue')
);

const isAvailable = computed(() => {
    const allSessions = testStore.getSessions();
    const activeOrReserved = allSessions.filter(s =>
        s.item_id === props.itemType.id &&
        (s.status === 'active' || s.status === 'reserved')
    );
    return activeOrReserved.length === 0;
});

const buttonState = computed(() => {
    if (activeSession.value) {
        return {
            disabled: true,
            text: 'В прокате',
            showButton: true
        };
    }
    if (reservedSession.value) {
        return {
            disabled: false,
            text: 'Отменить',
            action: 'cancel',
            showButton: true
        };
    }
    if (overdueSession.value) {
        const time = new Date(overdueSession.value.reservation_ts).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
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
});

const showDialog = ref(false);
let pendingAction = '';

const handleButtonClick = () => {
    if (buttonState.value.disabled) return;

    pendingAction = buttonState.value.action || '';
    showDialog.value = true;
};

const confirmAction = async () => {
    showDialog.value = false;
    if (pendingAction === 'reserve') {
        try {
            const response = await fetch(`/rental-sessions/${props.itemType.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUserId })
            });
            if (response.ok) {
                testStore.init();
            }
        } catch (error) {
            console.error('Ошибка бронирования:', error);
        }
    } else if (pendingAction === 'cancel' && reservedSession.value) {
        try {
            const response = await fetch(`/rental-sessions/${reservedSession.value.id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                testStore.init();
            }
        } catch (error) {
            console.error('Ошибка отмены:', error);
        }
    }
    pendingAction = '';
};

const cancelAction = () => {
    showDialog.value = false;
    pendingAction = '';
};
</script>