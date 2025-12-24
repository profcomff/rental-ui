<template>
	<v-dialog width="90vw" v-model="open">
		<v-card class="px-2 py-3" rounded="lg">
			<v-card-title>Редактирование пользователя {{ $props.user_id }}</v-card-title>
			<v-card-text class="d-flex ga-2 flex-column">
				<v-text-field v-model="full_name_model" label="Полное имя" placeholder="Иванов Иван Иванович" />
				<v-text-field
					v-model="student_card_number_model"
					label="Номер студенческого"
					placeholder="0123456789"
				/>
			</v-card-text>
			<v-card-actions class="mx-4">
				<v-btn color="primary" variant="flat" text="Сохранить" @click="handleSave()" />
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { UserData, useUserdata } from '../api/useUserdata';

const props = defineProps<UserData>();
const emit = defineEmits<{
	'data-updated': [];
}>();

const full_name_model = ref(props.full_name);
const student_card_number_model = ref(props.student_card_number);

watch(props, () => {
	full_name_model.value = props.full_name;
	student_card_number_model.value = props.student_card_number;
});

const open = defineModel<boolean>({ default: false });

async function handleSave() {
	const data = await useUserdata().patchUserById(
		props.user_id,
		full_name_model.value,
		student_card_number_model.value,
	);
	if (!!data) {
		emit('data-updated');
		open.value = false;
	}
}
</script>

<style lang="css" scoped></style>
