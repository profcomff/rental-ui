<template>
	<AdminTabs current-tab="/admin/userdata" />
	<v-text-field
		v-model="userId"
		class="my-2 py-2 mx-2"
		placeholder="Поиск студента (по id)"
		:prepend-inner-icon="'mdi-magnify'"
		variant="outlined"
		@update:model-value="handleSearchById"
	/>
	<UserdataCard v-if="!!userdata" v-bind="userdata" @user-edit="handleEdit" />
	<UserdataEdit v-if="!!userdata" v-bind="userdata" v-model="editDialog" @data-updated="handleSearchById" />
</template>

<script setup lang="ts">
import { useUserdata } from '@/pages/admin/userdata/api/useUserdata';
import { ref } from 'vue';
import AdminTabs from '@/components/AdminTabs.vue';
import UserdataCard from './components/UserdataCard.vue';
import UserdataEdit from './components/UserdataEdit.vue';
import { storeToRefs } from 'pinia';

const userdataStore = useUserdata();
const { userdata } = storeToRefs(userdataStore);

const userId = ref();
const editDialog = ref(false);

async function handleSearchById() {
	await userdataStore.getUserById(userId.value);
}

function handleEdit() {
	editDialog.value = true;
}
</script>

<style lang="css" scoped></style>
