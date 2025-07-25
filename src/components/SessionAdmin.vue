<script setup lang="ts">
import apiClient from '@/api';
import { RentalSession } from '@/models';
import { useProfileStore } from '@/store';
import { ref } from 'vue';

const { session } = defineProps<{ session: RentalSession }>();
const { user_id } = useProfileStore();

const strikeReason = ref('');

async function postStrike() {
	const { data, error } = await apiClient.POST('/rental/strike', {
		body: {
			user_id: session.user_id,
			admin_id: user_id!,
			reason: strikeReason.value,
			session_id: session.id,
		},
	});

	if (error) {
		console.log('Ошибка при попытке создать страйк: ', error);
		return;
	}

	console.log('Страйк успешно создан: ', data);
}
</script>

<template>
	<p>Выдал: {{ session.admin_open_id ?? 'Никто' }}</p>
	<p>Принял: {{ session.admin_open_id ?? 'Никто' }}</p>

	<v-form>
		<h2>Выдать страйк:</h2>
		<v-text-field v-model="strikeReason" />
		<v-btn type="submit" @click.prevent="postStrike">Отправить</v-btn>
	</v-form>
</template>
