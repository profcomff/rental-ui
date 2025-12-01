<script setup lang="ts">
import { ref } from 'vue';

const model = defineModel<boolean>();
const emit = defineEmits<{
	(e: 'cancel'): void;
	(e: 'confirm', reason: string): void;
}>();
withDefaults(
	defineProps<{
		title: string;
		description?: string;
		confirmText?: string;
		cancelText?: string;
		reasons: Array<{ chip: string; value: string }>;
	}>(),
	{
		confirmText: 'Подтверить',
		cancelText: 'Отменить',
	},
);

const reason = ref('');

function handleConfirm() {
	model.value = false;
	emit('confirm', reason.value);
}

function handleCancel() {
	model.value = false;
	emit('cancel');
}
</script>

<template>
	<v-dialog width="90vw" max-width="400px" v-model="model">
		<v-card class="px-2 py-3" rounded="lg">
			<v-card-title class="text-center font-weight-bold py-1">{{ title }}</v-card-title>
			<v-card-subtitle class="text-center py-0">{{ description }}</v-card-subtitle>
			<v-card-text class="pa-2">
				<v-chip-group selected-class="bg-primary" column class="text-caption" v-model="reason">
					<v-chip v-for="reason in reasons" :key="reason.chip" :value="reason.value">{{
						reason.chip
					}}</v-chip>
				</v-chip-group>
				<p class="text-body-1 font-weight-bold mb-1 mt-2">Комментарий/другое</p>
				<v-text-field v-model="reason" hide-details="auto" placeholder="Текст комментария"></v-text-field>
			</v-card-text>
			<v-card-actions>
				<div class="d-flex flex-column ga-2 w-100">
					<v-btn block color="primary" variant="flat" @click="handleConfirm">{{ confirmText }}</v-btn>
					<v-btn block color="primary" variant="tonal" @click="handleCancel">{{ cancelText }}</v-btn>
				</div>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<style lang="css" scoped></style>
