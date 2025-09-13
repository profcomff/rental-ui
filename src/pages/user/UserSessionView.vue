<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import apiClient from '@/api';
import { RentalSession } from '@/models';
import { useRoute } from 'vue-router';
import StrikeChip from '@/components/StrikeChip.vue';

const session = ref<RentalSession>();
console.log('HI');

onBeforeMount(async () => {
	const { params } = useRoute();
	const session_id = params.sessionId instanceof Array ? Number(params.sessionId[0]) : Number(params.sessionId);
	const { data, error } = await apiClient.GET('/rental/rental-sessions/{session_id}', {
		params: { path: { session_id } },
	});

	if (error) {
		console.log('Ошибка при попытке запроса сессии:', error);
	}

	console.log(data);
	session.value = data;
});
</script>

<template>
	<v-card variant="flat">
		<template #prepend>
			<div>
				<v-img
					aspect-ratio="16/9"
					cover
					width="150"
					rounded="lg"
					src="https://pulsephotography.com.au/wp-content/uploads/2017/10/16x9-placeholder.jpg"
				></v-img>
			</div>
		</template>

		<template #title>
			<p class="text-body-2 font-weight-bold">Зарядка</p>
		</template>

		<template #subtitle>
			<p class="text-body-1 font-weight-bold text-black opacity-100">N{{ session ? session.id : '-' }}</p>
		</template>

		<template #item>
			<StrikeChip v-if="true" />
		</template>

		<template #text>
			<v-row>
				<v-col>
					<p>Дата и время брони</p>
					<p class="font-weight-bold text-body-1">10.01.2000</p>
				</v-col>
				<v-col>
					<p>Дата и время окончания сессии</p>
					<p class="font-weight-bold text-body-1">10.01.2000</p>
				</v-col>
			</v-row>
			<v-row>
				<v-col>
					<p>Статус сессии</p>
				</v-col>
				<v-col>
					<p class="font-weight-bold text-body-1">Завершена со страйком</p>
				</v-col>
			</v-row>
			<v-row>
				<v-col>
					<p>Выдал</p>
					<p class="font-weight-bold text-body-1">Иванов Иван Иванович</p>
				</v-col>
				<v-col>
					<p>Принял</p>
					<p class="font-weight-bold text-body-1">Иванов Иван Иванович</p>
				</v-col>
			</v-row>
			<v-row>
				<v-col>
					<p>Комментарий к сессии</p>
					<p class="font-weight-bold text-body-1">Страйк за поломку</p>
				</v-col>
			</v-row>
		</template>
	</v-card>
</template>

<style lang="css" scoped></style>
