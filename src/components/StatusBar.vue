<script setup lang="ts">
defineProps({
	location: { type: String as () => '/' | '/active', required: true },
});
</script>

<template>
	<v-card
		class="d-flex align-center justify-space-between elevated-1 px-2"
		style="height: 60px; line-height: 20px"
		rounded="0"
	>
		<div class="d-flex pr-4 py-2 mr-4 border-e-md text-green align-center">
			<v-icon class="mx-2" :icon="'mdi-emoticon-happy-outline'" size="24"></v-icon>
			<span class="text-body-1">{{ 0 }}</span>
		</div>
		<span v-if="location === '/'" class="ml-2 flex-grow-1"
			>Перед бронированием ознакомьтесь с <a>правилами</a></span
		>
		<span v-if="location === '/active'" class="ml-2 flex-grow-1"
			>Для начала и завершения аренды подойдите в каб. 2-39</span
		>
	</v-card>
</template>

<style lang="css" scoped></style>
