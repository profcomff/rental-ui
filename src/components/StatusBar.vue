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
		<span v-if="location === '/'" class="ml-2 flex-grow-1"
			>Перед бронированием ознакомьтесь с
			<a href="https://pages.profcomff.com/rent-rules" target="_blank">правилами</a></span
		>
		<span v-if="location === '/active'" class="ml-2 flex-grow-1"
			>Для начала и завершения аренды подойдите в каб. 2-39</span
		>
	</v-card>
</template>

<style lang="css" scoped></style>
