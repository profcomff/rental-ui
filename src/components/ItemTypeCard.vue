<template>
    <v-card border>
        <v-img :src="item.image" height="150" cover></v-img>

        <v-card-title class="text-h6 pa-4">
            {{ item.name }}
        </v-card-title>

        <v-card-actions class="px-4 pb-4 justify-space-between">
            <div class="text-caption">
                <template v-if="!item.available">
                    Нет в наличии
                </template>
                <template v-else-if="isReserved">
                    Забронировано до {{ item.rentalSession.pickupTime }}
                </template>
                <template v-else-if="isExpired">
                    Забронировать повторно в {{ item.rentalSession.pickupTime }}
                </template>
                <template v-else>
                    Забронировать через: __:___
                </template>
            </div>

            <v-btn :disabled="!isButtonActive" :color="buttonColor" variant="tonal" size="small" @click="handleClick">
                {{ buttonText }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue' // Добавлен импорт computed
import type { PropType } from 'vue'

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
    rentalSession?: RentalSession
}

const props = defineProps({
    item: {
        type: Object as PropType<RentalItem>,
        required: true
    }
})

const isReserved = computed(() =>
    props.item.rentalSession?.status === 'reserved'
)

const isExpired = computed(() =>
    props.item.rentalSession?.status === 'expired'
)

const isButtonActive = computed(() => {
    if (!props.item.available) return false
    if (props.item.rentalSession?.status === 'active') return false
    return true
})

const buttonText = computed(() => {
    if (isReserved.value) return 'Отменить'
    if (isExpired.value) return 'Повторить'
    return 'Забронировать'
})

const buttonColor = computed(() =>
    isReserved.value ? 'error' : 'primary'
)

function handleClick() {
    if (isReserved.value) {
        emit('cancel', props.item.rentalSession.id)
    } else {
        emit('rent', props.item.id)
    }
}

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
</script>