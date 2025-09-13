<script setup lang="ts">
const model = defineModel<boolean>();
const emit = defineEmits(['confirm', 'cancel']);
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

function handleConfirm() {
	model.value = false;
	emit('confirm');
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
