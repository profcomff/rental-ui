<script setup lang="ts">
import { computed, ref } from 'vue';
import { useProfileStore } from '@/store';
import { storeToRefs } from 'pinia';

const { setupDevUserSession, setupDevAdminSession } = useProfileStore();
const { token } = storeToRefs(useProfileStore());
const sessionType = ref<'user' | 'admin'>('user');
const tvff_token = ref<string>('');

const currentToken = computed(() => token);

async function setupSession() {
	switch (sessionType.value) {
		case 'user':
			await setupDevUserSession(tvff_token.value);
			break;
		case 'admin':
			await setupDevAdminSession(tvff_token.value);
			break;
	}
}
</script>

<template>
	<h3>Текущая сессия:</h3>
	<p>{{ currentToken }}</p>
	<v-form>
		<v-select
			v-model="sessionType"
			label="Вид сессии"
			:items="['user', 'admin']"
			density="compact"
			autocomplete="off"
		/>
		<v-text-field
			v-model="tvff_token"
			label="Вставь токен из 'ТВОЙ ФФ (тест)'"
			density="compact"
			autocomplete="off"
		/>
		<p>
			<a href="https://app.test.profcomff.com/admin" target="_blank">Посмотреть токен</a>
		</p>
		<v-btn text="Создать сессию" density="compact" @click="setupSession"></v-btn>

		<v-btn @click="$router.push('/')" density="compact" color="primary">В приложение</v-btn>
	</v-form>
</template>
