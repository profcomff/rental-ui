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
	<v-dialog width="90vw" max-width="400px" v-model="model">
		<v-card rounded="lg">
			<v-card-title class="text-center font-weight-bold">{{ title }}</v-card-title>
			<v-card-subtitle class="text-center">{{ description }}</v-card-subtitle>
			<v-card-text class="pa-2">
				<v-chip-group selected-class="bg-primary" column class="text-caption">
					<v-chip>Сломан</v-chip>
					<v-chip>Украден</v-chip>
					<v-chip>Просрочено</v-chip>
				</v-chip-group>
				<h4>Комментарий/другое</h4>
				<v-text-field v-model="reason" hide-details="auto"></v-text-field>
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
