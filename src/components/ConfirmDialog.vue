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
		confirmText: 'Да',
		cancelText: 'Нет',
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
		<v-card class="px-2 py-3" rounded="lg">
			<v-card-title class="text-center font-weight-bold mb-2 pb-0">{{ title }}</v-card-title>
			<v-card-subtitle opacity="1" class="text-center text-wrap">{{ description }}</v-card-subtitle>
			<v-card-actions>
				<div class="d-flex flex-column ga-2 mt-2 w-100">
					<v-btn height="44" block color="primary" variant="flat" rounded="lg" @click="handleConfirm">{{
						confirmText
					}}</v-btn>
					<v-btn height="44" block color="primary" variant="tonal" rounded="lg" @click="handleCancel">{{
						cancelText
					}}</v-btn>
				</div>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<style lang="css" scoped></style>
