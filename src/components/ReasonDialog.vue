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
	<v-dialog width="90vw" max-width="300px" v-model="model">
		<v-card>
			<v-card-title class="text-center">{{ title }}</v-card-title>
			<v-card-subtitle class="text-center">{{ description }}</v-card-subtitle>
			<v-card-text>
				<v-chip-group></v-chip-group>
				<h4>Комментарий/другое</h4>
				<v-text-field v-model="reason"></v-text-field>
			</v-card-text>
			<v-card-actions>
				<div class="d-flex flex-column w-100">
					<v-btn block color="primary" @click="handleConfirm">{{ confirmText }}</v-btn>
					<v-btn block @click="handleCancel">{{ cancelText }}</v-btn>
				</div>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<style lang="css" scoped></style>
