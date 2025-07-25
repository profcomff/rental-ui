import apiClient from '@/api';
import { ItemType } from '@/models/index';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useItemStore = defineStore('items', () => {
	const itemTypes = ref<ItemType[]>([]);

	async function requestItemTypes() {
		const { response, data, error } = await apiClient.GET('/rental/itemtype');

		if (!response.ok && error) {
			console.log('trying to get item types', error);
			return;
		}

		if (data) {
			itemTypes.value = data;
		}

		return itemTypes.value;
	}

	function getItemTypes() {
		// а нужна ли эта функция...
		console.log(itemTypes.value);
		return itemTypes.value;
	}

	async function getItemType(typeId: number) {
		const { response, data, error } = await apiClient.GET('/rental/itemtype/{id}', {
			params: { path: { id: typeId } },
		});

		if (!response.ok && error) {
			console.log('trying to get item type', typeId, error);
		}

		if (data) {
			return data;
		}
	}

	return {
		itemTypes,
		requestItemTypes,
		getItemTypes,
		getItemType,
	};
});
