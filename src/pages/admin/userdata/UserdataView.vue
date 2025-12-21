<template>
	<AdminTabs current-tab="/admin/journal" />
	<v-text-field
		v-model="userId"
		class="my-2 py-2 mx-2"
		placeholder="Поиск студента (по id)"
		:prepend-inner-icon="'mdi-magnify'"
		variant="outlined"
		@update:model-value="handleSearchById"
	/>
	<UserdataCard v-if="!!data" v-bind="data" @user-edit="handleEdit" />
	<UserdataEdit v-if="!!data" v-bind="data" v-model="editDialog" />
</template>

<script setup lang="ts">
import { UserData, useUserdata } from '@/pages/admin/userdata/api/useUserdata';
import { ref } from 'vue';
import AdminTabs from '@/components/AdminTabs.vue';
import UserdataCard from './components/UserdataCard.vue';
import UserdataEdit from './components/UserdataEdit.vue';

const userId = ref();
const data = ref<UserData>();
const editDialog = ref(false);

async function handleSearchById() {
	data.value = await useUserdata().getUserById(userId.value);
}

function handleEdit() {
	editDialog.value = true;
}
</script>

<style lang="css" scoped></style>
