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
		<v-card rounded="lg">
			<v-card-title class="text-center font-weight-bold">{{ title }}</v-card-title>
			<v-card-subtitle class="text-center text-wrap">{{ description }}</v-card-subtitle>
			<v-card-actions>
				<div class="d-flex flex-column ga-2 mt-2 w-100">
					<v-btn block color="primary" variant="flat" @click="handleConfirm">{{ confirmText }}</v-btn>
					<v-btn block color="primary" varinat="tonal" @click="handleCancel">{{ cancelText }}</v-btn>
				</div>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<style lang="css" scoped></style>
