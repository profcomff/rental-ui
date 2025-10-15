<script setup lang="ts"></script>

<template>
	<v-card
		class="d-flex align-center justify-space-around elevated-1 px-2"
		style="height: 60px; line-height: 20px"
		rounded="0"
	>
		<div class="d-flex pr-4 py-2 mr-4 border-e-md text-green">
			<v-icon class="mx-2" :icon="'mdi-emoticon-happy-outline'" size="24"></v-icon>
			{{ 0 }}
		</div>
		<span class="ml-2">Перед бронированием ознакомьтесь с <a>правилами</a></span>
	</v-card>
</template>

<style lang="css" scoped></style>
