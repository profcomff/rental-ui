<script setup lang="ts">
import { computed, onMounted, ref, watch, nextTick } from 'vue';
import { useItemStore } from '@/store/itemStore'; // Assuming path is correct
import { useTestStore } from '@/store/testRequestStore'; // Assuming path is correct
import ItemTypeCard from '@/components/ItemTypeCard.vue'; // Assuming path is correct
import { ItemType } from '@/models/index'; // Assuming path is correct
import UserTabs from '@/components/UserTabs.vue';

const itemStore = useItemStore();
const testStore = useTestStore();

const itemCards = ref<InstanceType<typeof ItemTypeCard>[]>([]);

// Define a constant for the current user ID (as seen in ItemTypeCard.vue)
// In a real application, this would likely come from an auth store or props
const currentUserId = 177;

onMounted(async () => {
    await itemStore.requestItemTypes();
    testStore.init();
    nextTick(() => {
        setEqualCardHeights();
    });
});

const processedSessions = computed(() => {
    const allSessions = testStore.getSessions();
    const userActiveSessions = allSessions.filter(
        session => session.user_id === currentUserId && session.status === 'active',
    );

    // Map active sessions to the item data structure expected by ItemTypeCard
    return userActiveSessions
        .map(session => {
            const itemDetails = itemStore.getItemTypes().find(it => it.id === session.item_id);

            return {
                id: itemDetails?.id || session.item_id, // Crucial: ItemTypeCard uses itemType.id
                name: itemDetails?.name || `Предмет ID: ${session.item_id}`, // Fallback name
                description: itemDetails?.description || 'Описание отсутствует', // Fallback description
                image_url:
                    itemDetails?.image_url ||
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_Ii1DL7ODGnKq1PR_YPBYb_107OyaPm5Qwg&s',
                ...(itemDetails || {}),
            } as ItemType;
        })
        .filter(item => item.id != null);
});

watch(
    () => processedSessions.value,
    () => {
        nextTick(() => {
            setEqualCardHeights();
        });
    },
    { deep: true },
);

function setEqualCardHeights() {
    nextTick(() => {
        const cards = itemCards.value;
        if (!cards || cards.length === 0) return;

        let maxHeight = 0;

        cards.forEach(cardComponent => {
            if (cardComponent?.$el) {
                const cardElement = cardComponent.$el as HTMLElement;
                cardElement.style.height = 'auto'; // Reset height
                const cardHeight = cardElement.offsetHeight; // Get current height
                if (cardHeight > maxHeight) {
                    maxHeight = cardHeight;
                }
            }
        });

        if (maxHeight > 0) {
            cards.forEach(cardComponent => {
                if (cardComponent?.$el) {
                    const cardElement = cardComponent.$el as HTMLElement;
                    cardElement.style.height = `${maxHeight}px`;
                }
            });
        }
    });
}
</script>

<template>
    <UserTabs current-tab="/user/active" />
    <v-container fluid class="pa-0 d-flex flex-column align-center">
        <v-data-iterator :items="processedSessions" :items-per-page="-1">
            <template v-slot:header>
                <v-toolbar color="surface-variant">
                    <v-toolbar-title class="items-title">Активные сессии</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>
            </template>

            <template v-slot:default="{ items }">
                <v-row class="items-row" no-gutters>
                    <v-col v-for="(item, i) in items" :key="item.raw.id || i" cols="12" sm="6" md="5" lg="4" xl="3"
                        class="item-col d-flex justify-center">
                        <ItemTypeCard :itemType="item.raw" class="fill-height card" ref="itemCards" />
                    </v-col>
                </v-row>
                <v-row v-if="!items || items.length === 0" class="justify-center pa-4">
                    <v-col cols="12" class="text-center">
                        <p class="text-h6">У вас нет активных сессий.</p>
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
    padding: 10px;
}

.item-col {
    display: flex;
    padding: 5px;
}

.card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
}

.text-h6 {
    font-family: 'Roboto Flex', sans-serif !important;
    font-size: 1.25rem !important;
    font-weight: 500;
    line-height: 1.6;
    letter-spacing: 0.0075em;
    color: rgb(0 0 0 / 60%);
}
</style>
