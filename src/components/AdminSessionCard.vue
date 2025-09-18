<script setup lang="ts">
import { RentalSession } from '@/models';
import StrikeChip from './StrikeChip.vue';

defineProps<{
	location: 'requests' | 'active' | 'journal';
	session: RentalSession;
}>();
</script>

<template>
	<v-card>
		<template #prepend>
			<div>
				<v-img
					min-width="100"
					aspect-ratio="1"
					cover
					src="https://pulsephotography.com.au/wp-content/uploads/2017/10/16x9-placeholder.jpg"
				></v-img>
			</div>
		</template>

		<template #title>
			<p class="text-wrap">Зарядка</p>
		</template>
		<template #subtitle>
			<p class="text-wrap">Иванов Иван Иванович</p>
		</template>
		<template #item>N{{ session.id }}</template>

		<template #append>
			<div>
				<StrikeChip v-if="session.status === 'overdue'" text="Просроч"></StrikeChip>
				<StrikeChip v-if="session.strike_id" text="Страйк"></StrikeChip>
			</div>
		</template>

		<template #text>
			<v-row>
				<v-col>
					<div>
						<p>Время до окончания брони</p>
						<p class="font-weight-bold">10:49</p>
					</div>
				</v-col>
				<v-col cols="3">
					<div>
						<p>Страйки</p>
						<p class="font-weight-bold">Да</p>
					</div>
				</v-col>
				<v-col cols="3">
					<div>
						<p>В наличии</p>
						<p class="font-weight-bold">Да</p>
					</div>
				</v-col>
			</v-row>
		</template>

		<template #actions>
			<v-row>
				<v-col class="d-flex justify-center">
					<v-btn color="danger font-weight-bold " variant="tonal" block @click="$emit('cancel')">
						Отклонить
					</v-btn>
				</v-col>
				<v-col class="d-flex justify-center">
					<v-btn color="primary font-weight-bold" variant="tonal" block @click="$emit('confirm')">
						Принять
					</v-btn>
				</v-col>
			</v-row>
		</template>
	</v-card>
</template>

<style lang="css" scoped></style>
