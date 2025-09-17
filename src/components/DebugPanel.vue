<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAdminStore, useProfileStore } from '@/store';
import { storeToRefs } from 'pinia';
import UserTabs from './UserTabs.vue';
import AdminTabs from './AdminTabs.vue';

const { setupUserSession, setupAdminSession } = useProfileStore();
const { token } = storeToRefs(useProfileStore());
const sessionType = ref<'user' | 'admin'>('user');
const tvff_token = ref<string>('');

const currentToken = computed(() => token);

async function setupSession() {
	switch (sessionType.value) {
		case 'user':
			await setupUserSession(tvff_token.value);
			break;
		case 'admin':
			await setupAdminSession(tvff_token.value);
			break;
	}
}
</script>

<template>
	<h2>Юзерское</h2>
	<UserTabs current-tab="/debug" />
	<h2>Админское</h2>
	<AdminTabs current-tab="/debug" />
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
		<a href="https://app.test.profcomff.com/admin" target="_blank">Посмотреть токен</a>
		<v-btn text="Создать сессию" density="compact" @click="setupSession"></v-btn>
	</v-form>

	<v-btn @click="useAdminStore().makeAllAvailable">ALL ITEMS AVAILABLE</v-btn>
</template>
