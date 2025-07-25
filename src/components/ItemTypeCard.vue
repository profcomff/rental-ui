<script setup lang="ts">
import { ItemType } from '@/models/index';
import UserItemButton from './UserItemButton.vue';

const props = defineProps<{
	itemType: ItemType;
}>();
</script>

<template>
	<v-card class="mx-auto rounded-lg d-flex flex-column" style="width: 100%; max-width: 300px; height: 100%">
		<!-- Изображение с контейнером -->
		<div class="image-container">
			<v-img :src="itemType.image_url ?? ''" :aspect-ratio="1" contain>
				<template v-if="!itemType.image_url">
					<v-sheet height="100%" color="grey-lighten-3"></v-sheet>
				</template>
			</v-img>
		</div>

		<!-- Контент карточки -->
		<div class="card-content pa-4 flex-grow-1">
			<v-card-title class="font-weight-bold pb-0 card-title">
				{{ itemType.name }}
			</v-card-title>
			<v-card-subtitle class="pt-1 card-description">
				{{ itemType.description }}
			</v-card-subtitle>
		</div>

		<!-- Кнопка и статус -->
		<UserItemButton :item-type="props.itemType" />
	</v-card>
</template>

<style scoped>
.image-container {
	position: relative;
	width: 100%;
	padding-top: 100%;
}

.v-img {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: contain;
	border-top-left-radius: 12px;
	border-top-right-radius: 12px;
}

.card-title {
	font-size: 1.4rem !important;
	line-height: 1.4;
	font-family: 'Roboto Flex', sans-serif !important;
	white-space: normal !important;
	display: -webkit-box !important;
	-webkit-box-orient: vertical !important;
	width: 100%;
}

.card-description {
	font-size: 1.1rem !important;
	color: rgb(0 0 0 / 70%) !important;
	min-height: 60px;
	font-family: 'Roboto Flex', sans-serif !important;
	white-space: normal !important;
	display: -webkit-box !important;
	-webkit-box-orient: vertical !important;
	width: 100%;
}

.card-content {
	min-width: 0;
}

.status-container {
	font-size: 1.2rem;
	position: absolute;
	left: 16px;
	bottom: 16px;
	line-height: 1.2;
	font-family: 'Roboto Flex', sans-serif !important;
}

.action-button {
	letter-spacing: normal !important;
	text-transform: none !important;
	font-weight: 700 !important;
	font-size: 1.1rem !important;
	padding: 12px 24px !important;
	min-width: 120px !important;
	height: 48px !important;
	border-radius: 8px !important;
	font-family: 'Roboto Flex', sans-serif !important;
	margin-right: 8px;
	margin-bottom: 8px !important;
}

.v-dialog .v-card {
	padding: 24px;
}

.v-dialog .v-card-text {
	font-size: 1.25rem !important;
	font-weight: 500;
	text-align: center;
	padding: 24px 0 !important;
	font-family: 'Roboto Flex', sans-serif !important;
}

.auth-edit-button {
	min-width: 100px !important;
	height: 40px !important;
	border-radius: 4px !important;
	letter-spacing: normal !important;
	font-family: 'Roboto Flex', sans-serif !important;
}
</style>
