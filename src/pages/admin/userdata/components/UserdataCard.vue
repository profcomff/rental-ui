<template>
	<v-card class="mx-2">
		<v-card-title>{{ $props.user_id }}. {{ $props.full_name ?? 'Неизвестен' }} </v-card-title>
		<v-card-text>
			<div class="d-flex flex-column">
				<p>Студенческий: {{ student_card_number ?? 'не указан' }}</p>
				<p>
					Член профсоюза: <span class="font-bold">{{ is_union_member !== 'false' ? 'Да' : 'Нет' }}</span>
				</p>
				<p v-if="is_union_member !== 'false'">Профсоюзный билет: {{ union_card_number }}</p>
			</div>
		</v-card-text>
	</v-card>
</template>

<script setup lang="ts">
import { UserData } from '../api/useUserdata';

defineProps<UserData>();
</script>

<style lang="css" scoped></style>
